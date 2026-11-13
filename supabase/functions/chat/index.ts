import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient, type SupabaseClient } from "npm:@supabase/supabase-js@2";

// Only the live site (and local dev) may call this from a browser.
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

// Cost and abuse limits. The browser never touches the database directly:
// this function is the only thing that reads or writes chat rows, so the
// tables need no public (anon) policies at all.
const MAX_MESSAGE_CHARS = 1000; // longest single visitor message
const MAX_USER_MESSAGES_PER_CONVERSATION = 25; // then we point them to a call
const HISTORY_MESSAGES = 20; // how much history is sent to the model
const MAX_USER_MESSAGES_PER_MINUTE = 40; // across the whole site
const MAX_NEW_CONVERSATIONS_PER_MINUTE = 20; // across the whole site
const MAX_TOOL_ROUNDS = 3; // hard stop on the model calling tools in a loop

const GREETING =
  "Hi! I'm Adbot, Adverve's AI assistant. I'd love to learn more about your business and see how we can help you grow. What's your name?";
const LIMIT_REPLY =
  "Thanks for all the questions! The best next step from here is a quick call with Owen. You can book one in the section below, or email owen@adverve.io.";
const BUSY_REPLY =
  "I'm a little busy right now. Could you try again in a minute, or book a call in the section below?";
const ERROR_REPLY =
  "Sorry, I had trouble connecting just now. Could you try again, or reach out via the contact form below?";

const SYSTEM_PROMPT = `You are Adverve's website chat assistant. Adverve is a B2B outreach infrastructure company based in the UK, serving clients across the UK and North America. It designs, builds, and manages the backend systems behind high-performance B2B outreach campaigns, not another marketing agency, it builds the infrastructure and runs it using tools like Clay, Smartlead, HeyReach, ZoomInfo, GoHighLevel (GHL), Lemlist, LinkedIn Sales Navigator, and B2B Rocket.
Services:
1. Outreach System Builds, full campaign setup from list to booked call: ICP definition, list building, sequence architecture, inbox warm-up, deliverability setup.
2. Ongoing Campaign Management, continuous A/B testing, weekly performance reporting, reply handling, lead handoff.
3. List Building and Data Enrichment, Clay-powered enrichment workflows, email and LinkedIn verification, ZoomInfo and intent data integration.
4. CRM and Workflow Integration, GoHighLevel setup and automation, lead routing, pipeline management.
5. Website Design, clean, conversion-focused websites built and handed over ready to use.
Track record: 22 clients served, 48 campaigns launched, UK and North America. Founder: Owen Cawston.
Tone: friendly, direct, knowledgeable, never pushy or salesy. Keep replies short, 2 to 4 sentences typically, this is a chat widget not an essay.
Never invent pricing, guarantees, timelines, or client names or results beyond what is stated here. If asked about pricing, explain it depends on scope and tools involved, and the best next step is a Discovery Call.
Only talk about Adverve, B2B outreach and the visitor's business. If asked to do unrelated work (write code, essays, homework, translations and so on), politely decline and steer back to how Adverve could help.
Conversation approach, in priority order:
1. If you do not know the visitor's name yet, ask for it naturally within your first reply or two. Do not interrogate, just ask once, warmly, and let them answer in their own time if they ignore it and ask something else first.
2. Answer their questions helpfully using only the information above.
3. If the visitor shows real buying interest, asking about pricing, next steps, wanting to get started, or wanting to book a call, ask for their email so Owen can follow up personally. Explain briefly that it is so Owen can reach out, nothing else.
4. Once you have their name and email and they seem ready, point them to the Book a Discovery Call button on the page, or let them know Owen will be in touch.
Formatting: this is a plain-text chat widget that does not render markdown. Never use markdown formatting, no asterisks for bold, no hashtags, no markdown bullet or numbered lists. Write in plain sentences only. If you need to list items, use simple numbered lines with plain text and no special characters around words.
You have two tools: save_lead_name and save_lead_email. Call save_lead_name the moment the visitor tells you their name, and save_lead_email the moment they give you their email, even if both are given in the same message. After a tool call resolves, continue the conversation naturally, never mention the tool call itself to the visitor.`;

const TOOLS = [
  {
    name: "save_lead_name",
    description: "Save the visitor's name to the lead record.",
    input_schema: {
      type: "object",
      properties: { name: { type: "string" } },
      required: ["name"],
    },
  },
  {
    name: "save_lead_email",
    description: "Save the visitor's email to the lead record.",
    input_schema: {
      type: "object",
      properties: { email: { type: "string" } },
      required: ["email"],
    },
  },
];

interface ContentBlock {
  type: string;
  text?: string;
  name?: string;
  id?: string;
  input?: Record<string, unknown>;
}

interface AnthropicResponse {
  content: ContentBlock[];
  stop_reason: string | null;
}

type ApiMessage = { role: "user" | "assistant"; content: unknown };

async function callAnthropic(apiKey: string, messages: ApiMessage[]): Promise<AnthropicResponse> {
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 512,
      system: SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
    }),
    signal: AbortSignal.timeout(30_000),
  });

  if (!res.ok) {
    throw new Error(`Anthropic API error ${res.status}`);
  }
  return (await res.json()) as AnthropicResponse;
}

function extractText(content: ContentBlock[]): string {
  return content
    .filter((b) => b.type === "text" && b.text)
    .map((b) => b.text!)
    .join("");
}

function isUuid(value: unknown): value is string {
  return typeof value === "string" &&
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

function isSessionId(value: unknown): value is string {
  return typeof value === "string" && value.length >= 8 && value.length <= 100;
}

function minuteAgo(): string {
  return new Date(Date.now() - 60_000).toISOString();
}

/** Turn stored rows into a valid Anthropic message list (starts with user, alternating roles). */
function toApiMessages(rows: Array<{ role: string; message: string }>): ApiMessage[] {
  const out: ApiMessage[] = [];
  for (const row of rows) {
    const role = row.role === "assistant" ? "assistant" : "user";
    if (out.length === 0 && role === "assistant") continue;
    const last = out[out.length - 1];
    if (last && last.role === role) {
      last.content = `${last.content}\n\n${row.message}`;
    } else {
      out.push({ role, content: row.message });
    }
  }
  return out;
}

async function startConversation(supabase: SupabaseClient, sessionId: string) {
  const { count } = await supabase
    .from("chat_conversations")
    .select("id", { count: "exact", head: true })
    .gte("created_at", minuteAgo());
  if ((count ?? 0) >= MAX_NEW_CONVERSATIONS_PER_MINUTE) {
    return { status: 429, body: { greeting: BUSY_REPLY } };
  }

  const { data: conversation, error } = await supabase
    .from("chat_conversations")
    .insert({ session_id: sessionId })
    .select("id")
    .single();
  if (error || !conversation) throw error ?? new Error("Could not start conversation");

  await supabase
    .from("chat_messages")
    .insert({ conversation_id: conversation.id, role: "assistant", message: GREETING });

  return { status: 200, body: { conversationId: conversation.id, greeting: GREETING } };
}

async function handleMessage(
  supabase: SupabaseClient,
  apiKey: string,
  conversationId: string,
  sessionId: string,
  text: string,
) {
  // The conversation must belong to the browser session that started it.
  const { data: conversation } = await supabase
    .from("chat_conversations")
    .select("id")
    .eq("id", conversationId)
    .eq("session_id", sessionId)
    .maybeSingle();
  if (!conversation) {
    return { status: 404, body: { error: "conversation_not_found" } };
  }

  const { count: userCount } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("conversation_id", conversationId)
    .eq("role", "user");
  if ((userCount ?? 0) >= MAX_USER_MESSAGES_PER_CONVERSATION) {
    return { status: 200, body: { reply: LIMIT_REPLY } };
  }

  const { count: recentCount } = await supabase
    .from("chat_messages")
    .select("id", { count: "exact", head: true })
    .eq("role", "user")
    .gte("created_at", minuteAgo());
  if ((recentCount ?? 0) >= MAX_USER_MESSAGES_PER_MINUTE) {
    return { status: 429, body: { reply: BUSY_REPLY } };
  }

  await supabase
    .from("chat_messages")
    .insert({ conversation_id: conversationId, role: "user", message: text });

  const { data: history } = await supabase
    .from("chat_messages")
    .select("role, message, created_at")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(HISTORY_MESSAGES);

  let apiMessages = toApiMessages((history ?? []).reverse());
  let response = await callAnthropic(apiKey, apiMessages);

  for (let round = 0; round < MAX_TOOL_ROUNDS; round++) {
    if (response.stop_reason !== "tool_use") break;

    const toolUseBlocks = response.content.filter((b) => b.type === "tool_use");
    for (const block of toolUseBlocks) {
      const value = typeof block.input?.name === "string"
        ? block.input.name
        : typeof block.input?.email === "string"
        ? block.input.email
        : "";
      const clean = value.trim().slice(0, 200);
      if (!clean) continue;
      if (block.name === "save_lead_name") {
        await supabase.from("chat_conversations").update({ lead_name: clean }).eq("id", conversationId);
      } else if (block.name === "save_lead_email") {
        await supabase.from("chat_conversations").update({ lead_email: clean }).eq("id", conversationId);
      }
    }

    apiMessages = [
      ...apiMessages,
      { role: "assistant", content: response.content },
      {
        role: "user",
        content: toolUseBlocks.map((block) => ({
          type: "tool_result",
          tool_use_id: block.id,
          content: "saved",
        })),
      },
    ];
    response = await callAnthropic(apiKey, apiMessages);
  }

  const reply = extractText(response.content) || "Sorry, I didn't catch that. Could you try again?";
  await supabase
    .from("chat_messages")
    .insert({ conversation_id: conversationId, role: "assistant", message: reply });

  return { status: 200, body: { reply } };
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
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") return json(400, { error: "bad_request" });

    const { action, sessionId } = body as Record<string, unknown>;
    if (!isSessionId(sessionId)) return json(400, { error: "bad_request" });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    if (action === "start") {
      const result = await startConversation(supabase, sessionId);
      return json(result.status, result.body);
    }

    if (action === "message") {
      const { conversationId, message } = body as Record<string, unknown>;
      if (!isUuid(conversationId) || typeof message !== "string") {
        return json(400, { error: "bad_request" });
      }
      const text = message.trim();
      if (!text || text.length > MAX_MESSAGE_CHARS) {
        return json(400, { error: "message_length", max: MAX_MESSAGE_CHARS });
      }

      const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
      if (!apiKey) {
        return json(200, {
          reply:
            "I'm not fully set up yet, please reach out via the contact form below and Owen will get back to you.",
        });
      }

      const result = await handleMessage(supabase, apiKey, conversationId, sessionId, text);
      return json(result.status, result.body);
    }

    return json(400, { error: "bad_request" });
  } catch (err) {
    console.error("chat function error", err);
    return json(200, { reply: ERROR_REPLY });
  }
});
