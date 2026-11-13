import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = [
  "https://www.adverve.io",
  "https://adverve.io",
  "http://localhost:5173",
];

function corsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get("Origin") ?? "";
  return {
    "Access-Control-Allow-Origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
    "Vary": "Origin",
  };
}

const LIMITS = { name: 200, email: 254, company: 200, message: 5000 };
// Site-wide cap so a bot can't flood the table or the Resend account.
const MAX_SUBMISSIONS_PER_10_MIN = 10;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function field(value: unknown, max: number): string | null {
  if (value === undefined || value === null) return "";
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed.length > max ? null : trimmed;
}

Deno.serve(async (req: Request) => {
  const headers = { ...corsHeaders(req), "Content-Type": "application/json" };
  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), { status, headers });

  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders(req) });
  }
  if (req.method !== "POST") {
    return json(405, { error: "method_not_allowed" });
  }

  try {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    if (!body) return json(400, { error: "Please check the form and try again." });

    const name = field(body.name, LIMITS.name);
    const email = field(body.email, LIMITS.email);
    const company = field(body.company, LIMITS.company);
    const message = field(body.message, LIMITS.message);

    if (
      name === null || email === null || company === null || message === null ||
      !name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return json(400, { error: "Please check the form and try again." });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { count } = await supabase
      .from("contact_submissions")
      .select("id", { count: "exact", head: true })
      .gte("created_at", new Date(Date.now() - 10 * 60_000).toISOString());
    if ((count ?? 0) >= MAX_SUBMISSIONS_PER_10_MIN) {
      return json(429, { error: "Too many messages right now. Please email owen@adverve.io instead." });
    }

    const { error: dbError } = await supabase
      .from("contact_submissions")
      .insert({ name, email, company, message });
    if (dbError) throw dbError;

    const resendKey = Deno.env.get("Resend_API_Key");
    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${resendKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Adverve Contact Form <onboarding@resend.dev>",
          to: ["Owen@adverve.io"],
          reply_to: email,
          subject: `New contact form submission from ${name.replace(/[\r\n]+/g, " ")}`,
          html: `
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${escapeHtml(name)}</p>
            <p><strong>Email:</strong> ${escapeHtml(email)}</p>
            <p><strong>Company:</strong> ${escapeHtml(company || "Not provided")}</p>
            <p><strong>Message:</strong></p>
            <p>${escapeHtml(message).replace(/\n/g, "<br>")}</p>
          `,
        }),
        signal: AbortSignal.timeout(15_000),
      });
    }

    return json(200, { success: true });
  } catch (err) {
    console.error("contact-form error", err);
    return json(500, { error: "Something went wrong. Please email owen@adverve.io instead." });
  }
});
