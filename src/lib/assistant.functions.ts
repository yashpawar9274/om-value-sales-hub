import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const AskInput = z.object({ audioBase64: z.string().min(1) });

export const askVoiceAssistant = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => AskInput.parse(input))
  .handler(async ({ data, context }) => {
    const { answerWithAi, buildCrmContext, speak, transcribeAudio } = await import("@/lib/assistant.server");

    const question = await transcribeAudio(data.audioBase64);
    if (!question) {
      throw new Error("Kuch sunai nahi diya. Dubara boliye.");
    }

    const { data: profile } = await context.supabase
      .from("profiles")
      .select("full_name")
      .eq("id", context.userId)
      .maybeSingle();

    const crmContext = await buildCrmContext(context.supabase as never);
    const answer = await answerWithAi(question, crmContext, profile?.full_name || "the sales executive");
    const audioBase64 = await speak(answer);

    return { question, answer, audioBase64 };
  });
