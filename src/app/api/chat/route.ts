// ─────────────────────────────────────────────
// PathWise — AI Agent Chat Route
//
// POST /api/chat
//
// Edge-compatible streaming endpoint.
// Pipeline:
//  1. Auth check (JWT cookie)
//  2. Run agent tool runner (intent → tools → context)
//  3. Call Claude Haiku with grounded system prompt
//  4. Stream SSE back to the frontend
// ─────────────────────────────────────────────

import Anthropic from "@anthropic-ai/sdk";
import { verifySession } from "@/lib/auth/session";
import { runAgent } from "@/lib/agent/runner";
import { checkRateLimit, LIMITS } from "@/lib/rate-limit";
import type { ChatApiMessage } from "@/lib/agent/types";


const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY ?? "",
});

// ── Request body type ─────────────────────────
interface ChatRequestBody {
  messages: ChatApiMessage[];
  userId?: string; // optional override; falls back to session userId
}

// ── Auth helper ───────────────────────────────
// Reads the JWT from the cookie header (edge-compatible).
async function getAuthSession(request: Request) {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const token = cookieHeader
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("pathwise_session="))
    ?.split("=")
    .slice(1)
    .join("=");

  if (!token) return null;
  return verifySession(token);
}

// ── Route handler ─────────────────────────────
export async function POST(request: Request): Promise<Response> {
  // 1. Authenticate
  const session = await getAuthSession(request);
  if (!session) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // 2. Rate limit
  const rl = checkRateLimit(session.userId, LIMITS.chat.limit, LIMITS.chat.windowMs);
  if (!rl.allowed) {
    return new Response(
      JSON.stringify({ error: `Too many messages. Try again in ${rl.resetInSeconds}s.` }),
      { status: 429, headers: { "Content-Type": "application/json", "Retry-After": String(rl.resetInSeconds) } }
    );
  }

  // 3. Parse body
  let body: ChatRequestBody;
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { messages } = body;

  if (!Array.isArray(messages) || messages.length === 0) {
    return new Response(JSON.stringify({ error: "messages array is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Sanitise messages — keep the last 40 turns, clip content length
  const sanitised: ChatApiMessage[] = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-40)
    .map((m) => ({
      role: m.role,
      content: String(m.content).slice(0, 4000),
    }));

  // The latest user message drives intent detection
  const latestUserMessage =
    sanitised.filter((m) => m.role === "user").at(-1)?.content ?? "";

  const userId = body.userId ?? session.userId;

  // 4. Run the agent tool pipeline
  // This detects intent, fetches relevant platform data, and builds the system prompt.
  let systemPrompt: string;
  try {
    const { systemPrompt: sp } = await runAgent(
      userId,
      latestUserMessage,
      sanitised.slice(0, -1) // history without the latest message
    );
    systemPrompt = sp;
  } catch (err) {
    // If the tool runner fails, fall back to a lightweight system prompt
    console.error("[PathWise Agent] Tool runner error:", err);
    systemPrompt = `You are PathWise Advisor — a career guidance counsellor for students, graduates, and professionals across all fields. Give practical, grounded advice. Note: platform data could not be loaded for this request, so give general guidance and label it as such.`;
  }

  // 4. Build the Anthropic messages array
  // The system prompt already contains all tool context.
  const anthropicMessages = sanitised.map((m) => ({
    role: m.role,
    content: m.content,
  }));

  // 5. Stream Claude's response
  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    async start(controller) {
      try {
        const stream = client.messages.stream({
          model: "claude-haiku-4-5-20251001",
          max_tokens: 1500,
          system: systemPrompt,
          messages: anthropicMessages,
        });

        for await (const chunk of stream) {
          if (
            chunk.type === "content_block_delta" &&
            chunk.delta.type === "text_delta"
          ) {
            const text = chunk.delta.text;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ text })}\n\n`)
            );
          }
        }

        controller.enqueue(encoder.encode("data: [DONE]\n\n"));
        controller.close();
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Streaming error occurred";
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ error: message })}\n\n`)
        );
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
