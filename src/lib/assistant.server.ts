import { streamText } from "ai";

import { GATEWAY_BASE_URL, createResponsesProvider, requireLovableApiKey } from "./ai-gateway.server";

type AnySupabase = {
  from: (table: string) => any;
};

export function base64ToBytes(base64: string) {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

export async function transcribeAudio(audioBase64: string) {
  const key = requireLovableApiKey();
  const bytes = base64ToBytes(audioBase64);
  if (bytes.byteLength < 2048) {
    throw new Error("Recording too short. Please hold the mic and speak again.");
  }

  const form = new FormData();
  form.append("model", "openai/gpt-4o-transcribe");
  form.append("file", new Blob([bytes as unknown as BlobPart], { type: "audio/wav" }), "recording.wav");

  const res = await fetch(`${GATEWAY_BASE_URL}/audio/transcriptions`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}` },
    body: form,
  });
  if (!res.ok) {
    throw new Error(`Transcription failed (${res.status}): ${await res.text().catch(() => "")}`);
  }
  const json = (await res.json()) as { text?: string };
  return (json.text ?? "").trim();
}

function fmt(value: string | null | undefined) {
  if (!value) return "-";
  return new Date(value).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function buildCrmContext(supabase: AnySupabase) {
  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  const end = new Date(now);
  end.setHours(23, 59, 59, 999);
  const weekEnd = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [leads, followups, visits, bookings] = await Promise.all([
    supabase
      .from("leads")
      .select("customer_name, mobile, status, priority, budget, location, created_at")
      .order("created_at", { ascending: false })
      .limit(40),
    supabase
      .from("follow_ups")
      .select("due_at, status, notes, leads(customer_name, mobile)")
      .order("due_at", { ascending: true })
      .limit(60),
    supabase
      .from("site_visits")
      .select("visit_at, status, project_name, location, leads(customer_name, mobile)")
      .order("visit_at", { ascending: true })
      .limit(40),
    supabase
      .from("bookings")
      .select("booking_date, booking_amount, received_amount, payment_status, project_name, leads(customer_name)")
      .order("booking_date", { ascending: false })
      .limit(20),
  ]);

  const leadRows = (leads.data ?? []) as any[];
  const followRows = (followups.data ?? []) as any[];
  const visitRows = (visits.data ?? []) as any[];
  const bookingRows = (bookings.data ?? []) as any[];

  const pending = followRows.filter((f) => f.status === "pending");
  const overdue = pending.filter((f) => new Date(f.due_at) < start);
  const today = pending.filter((f) => new Date(f.due_at) >= start && new Date(f.due_at) <= end);
  const upcoming = pending.filter((f) => new Date(f.due_at) > end && new Date(f.due_at) <= weekEnd);
  const todayVisits = visitRows.filter(
    (v) => v.status === "scheduled" && new Date(v.visit_at) >= start && new Date(v.visit_at) <= weekEnd,
  );

  const line = (f: any) => `${f.leads?.customer_name ?? "Lead"} (${f.leads?.mobile ?? "-"}) at ${fmt(f.due_at)}${f.notes ? ` — ${f.notes}` : ""}`;

  return [
    `Current date and time: ${now.toLocaleString("en-IN")}`,
    `Total leads visible: ${leadRows.length}`,
    `OVERDUE / MISSED FOLLOW-UPS (${overdue.length}):`,
    ...overdue.slice(0, 12).map((f) => `- ${line(f)}`),
    `TODAY'S FOLLOW-UPS (${today.length}):`,
    ...today.slice(0, 12).map((f) => `- ${line(f)}`),
    `UPCOMING FOLLOW-UPS THIS WEEK (${upcoming.length}):`,
    ...upcoming.slice(0, 12).map((f) => `- ${line(f)}`),
    `SCHEDULED SITE VISITS NEXT 7 DAYS (${todayVisits.length}):`,
    ...todayVisits
      .slice(0, 12)
      .map((v) => `- ${v.leads?.customer_name ?? "Lead"} (${v.leads?.mobile ?? "-"}) at ${fmt(v.visit_at)} · ${v.project_name ?? "project"} ${v.location ?? ""}`),
    `HOT LEADS (high priority, not booked/lost):`,
    ...leadRows
      .filter((l) => l.priority === "high" && !["booked", "lost"].includes(l.status))
      .slice(0, 12)
      .map((l) => `- ${l.customer_name} (${l.mobile}) · ${l.status} · budget ${l.budget ?? "-"} · ${l.location ?? "-"}`),
    `RECENT LEADS:`,
    ...leadRows.slice(0, 12).map((l) => `- ${l.customer_name} (${l.mobile}) · ${l.status} · added ${fmt(l.created_at)}`),
    `BOOKINGS (${bookingRows.length}):`,
    ...bookingRows
      .slice(0, 10)
      .map((b) => `- ${b.leads?.customer_name ?? "Customer"} · ${b.project_name ?? "-"} · ₹${b.booking_amount} (received ₹${b.received_amount}) · ${b.payment_status}`),
  ].join("\n");
}

export async function answerWithAi(question: string, crmContext: string, userName: string) {
  const key = requireLovableApiKey();
  const provider = createResponsesProvider(key);

  const result = streamText({
    model: provider.responses("openai/gpt-5.6-sol"),
    system: [
      "You are the voice sales coach inside OM Value Homes CRM, an Indian real-estate sales CRM.",
      `You are speaking with ${userName}, a sales team member.`,
      "You only advise and inform — you never change data in the CRM. If asked to create or update something, explain where in the app they can do it.",
      "Answer in the same language the user speaks (usually Hindi, Hinglish or English). Reply in plain conversational sentences, no markdown, no bullet symbols, no emojis — the answer is read aloud.",
      "Be concrete: name the customers, phone numbers and times from the CRM data. Prioritise overdue follow-ups first, then today's work.",
      "Keep the answer under 90 words unless the user explicitly asks for a long list.",
      "If the data does not contain the answer, say so briefly.",
      "\nCRM DATA:\n" + crmContext,
    ].join("\n"),
    prompt: question,
    providerOptions: {
      openai: {
        forceReasoning: true,
        reasoningEffort: "low",
        reasoningSummary: "auto",
        store: false,
      },
    },
  });

  const text = (await result.text).trim();
  return text || "Mujhe abhi koi jaankari nahi mili. Thoda dubara poochiye.";
}

export async function speak(text: string) {
  const key = requireLovableApiKey();
  const res = await fetch(`${GATEWAY_BASE_URL}/audio/speech`, {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "openai/gpt-4o-mini-tts",
      input: text.slice(0, 3000),
      voice: "alloy",
      response_format: "mp3",
      instructions: "Warm, clear and energetic Indian sales coach. Speak at a natural pace.",
    }),
  });
  if (!res.ok) {
    throw new Error(`Speech failed (${res.status}): ${await res.text().catch(() => "")}`);
  }
  return bytesToBase64(new Uint8Array(await res.arrayBuffer()));
}
