import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

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
Conversation approach, in priority order:
1. If you do not know the visitor's name yet, ask for it naturally within your first reply or two. Do not interrogate, just ask once, warmly, and let them answer in their own time if they ignore it and ask something else first.
2. Answer their questions helpfully using only the information above.
3. If the visitor shows real buying interest, asking about pricing, next steps, wanting to get started, or wanting to book a call, ask for their email so Owen can follow up personally. Explain briefly that it is so Owen can reach out, nothing else.
4. Once you have their name and email and they seem ready, point them to the Book a Discovery Call button on the page, or let them know Owen will be in touch.
You have two tools: save_lead_name and save_lead_email. Call save_lead_name the moment the visitor tells you their name, and save_lead_email the moment they give you their email, even if both are given in the same message. After a tool call resolves, continue the conversation naturally, never mention the tool call itself to the visitor.`;

const TOOLS = [
  {
    name: "save_lead_name",
    description: "Save the visitor's name to the lead record.",
    input_schema: {
      type: "object",
      properties: {
        name: { type: "string" },
      },
      required: ["name"],
    },
  },
  {
    name: "save_lead_email",
    description: "Save the visitor's email to the lead record.",
    input_schema: {
      type: "object",
      properties: {
        email: { type: "string" },
      },
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

async function callAnthropic(
  apiKey: string,
  messages: Array<Record<string, unknown>>,
): Promise<AnthropicResponse> {
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
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Anthropic API error ${res.status}: ${text}`);
  }

  return (await res.json()) as AnthropicResponse;
}

function extractText(content: ContentBlock[]): string {
  return content
    .filter((b) => b.type === "text" && b.text)
    .map((b) => b.text!)
    .join("");
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const { conversationId, messages } = await req.json();

    const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
    if (!apiKey) {
      return new Response(
        JSON.stringify({
          reply:
            "I'm not fully set up yet, please reach out via the contact form below and Owen will get back to you.",
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    let apiMessages = [...messages];
    let response = await callAnthropic(apiKey, apiMessages);

    for (let round = 0; round < 3; round++) {
      if (response.stop_reason !== "tool_use") break;

      const toolUseBlocks = response.content.filter((b) => b.type === "tool_use");

      for (const block of toolUseBlocks) {
        if (block.name === "save_lead_name" && block.input) {
          const name = block.input.name as string;
          if (name) {
            await supabase
              .from("chat_conversations")
              .update({ lead_name: name })
              .eq("id", conversationId);
          }
        } else if (block.name === "save_lead_email" && block.input) {
          const email = block.input.email as string;
          if (email) {
            await supabase
              .from("chat_conversations")
              .update({ lead_email: email })
              .eq("id", conversationId);
          }
        }
      }

      const toolResults = toolUseBlocks.map((block) => ({
        type: "tool_result",
        tool_use_id: block.id,
        content: "saved",
      }));

      apiMessages = [
        ...apiMessages,
        { role: "assistant", content: response.content },
        { role: "user", content: toolResults },
      ];

      response = await callAnthropic(apiKey, apiMessages);
    }

    const reply = extractText(response.content);
    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({
        reply:
          "Sorry, I had trouble connecting just now. Could you try again, or reach out via the contact form below?",
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
