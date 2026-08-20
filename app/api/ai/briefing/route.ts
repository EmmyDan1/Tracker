import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { createServerSupabaseClient } from "@/lib/supabase-server";



export async function POST(request: NextRequest) {
  try {
    const groq = new Groq({
      apiKey: process.env.GROQ_API_KEY,
    });

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing");
      return NextResponse.json(
        { error: "Server configuration error" },
        { status: 500 },
      );
    }

    const supabase = await createServerSupabaseClient();

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayISO = today.toISOString();

    const [
      { count: todayCount },
      { count: pendingCount },
      { count: inTransitCount },
      { count: deliveredCount },
      { data: topAgents },
    ] = await Promise.all([
      supabase
        .from("deliveries")
        .select("*", { count: "exact", head: true })
        .gte("created_at", todayISO),
      supabase
        .from("deliveries")
        .select("*", { count: "exact", head: true })
        .eq("status", "pending"),
      supabase
        .from("deliveries")
        .select("*", { count: "exact", head: true })
        .in("status", ["picked_up", "in_transit"]),
      supabase
        .from("deliveries")
        .select("*", { count: "exact", head: true })
        .eq("status", "delivered")
        .gte("created_at", todayISO),
      supabase
        .from("riders")
        .select("name, deliveries(count)")
        .eq("is_active", true)
        .limit(3),
    ]);

    const topAgentsList =
      topAgents
        ?.map((a) => `${a.name} (${a.deliveries?.[0]?.count || 0} deliveries)`)
        .join(", ") || "None";

const completion = await groq.chat.completions.create({
  model: 'groq/compound',
  max_tokens: 200,
  messages: [
    {
      role: "user",
      content: `You are a logistics operations manager giving a brief daily update to your boss. Write naturally and conversationally.

Today's data:
- ${todayCount ?? 0} new deliveries today
- ${deliveredCount ?? 0} delivered today
- ${inTransitCount ?? 0} in transit
- ${pendingCount ?? 0} pending pickup
- Today is ${today.toLocaleDateString("en-NG", { weekday: "long" })}
${topAgentsList ? `- Top agents: ${topAgentsList}` : ''}

Write a 2-3 sentence update that:
- Sounds like a real person talking (not AI-generated)
- Mentions the most important numbers first
- Adds context (e.g., "slow day", "busy day", "steady")
- If numbers are low, suggest a quick action
- Professional but warm tone - like a manager chatting with their boss
- No emojis, no markdown, plain text only

Example format:
"Morning boss. ${(inTransitCount ?? 0) > 0 ? `We've got ${inTransitCount ?? 0} shipment${(inTransitCount ?? 0) > 1 ? 's' : ''} in transit` : 'No shipments in transit'} and ${(todayCount ?? 0) > 0 ? `${todayCount ?? 0} new order${(todayCount ?? 0) > 1 ? 's' : ''} today` : 'no new orders today'}. ${(todayCount ?? 0) === 0 ? 'Might want to check with sales on this slow start.' : 'Everythings on track.'}"`,
    },
  ],
});

    const briefing =
      completion.choices[0]?.message?.content ?? "Unable to generate briefing";

    return NextResponse.json({ briefing });
  } catch (err) {
    console.error("Briefing error:", err);
    return NextResponse.json(
      { error: "Failed to generate briefing" },
      { status: 500 },
    );
  }
}
