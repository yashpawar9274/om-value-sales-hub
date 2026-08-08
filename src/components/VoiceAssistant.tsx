import { useCallback, useEffect, useRef, useState } from "react";
import { Mic, Square, Loader2 } from "lucide-react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";

import { askVoiceAssistant } from "@/lib/assistant.functions";
import { blobToBase64, startRecording, type Recorder } from "@/lib/recorder";
import { cn } from "@/lib/utils";

type State = "idle" | "listening" | "thinking" | "speaking";

const LABEL: Record<State, string> = {
  idle: "Tap to talk to your AI sales coach",
  listening: "Listening… tap to stop",
  thinking: "Thinking…",
  speaking: "Speaking… tap to stop",
};

export function VoiceAssistant() {
  const ask = useServerFn(askVoiceAssistant);
  const [state, setState] = useState<State>("idle");
  const recorderRef = useRef<Recorder | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    return () => {
      recorderRef.current?.cancel();
      audioRef.current?.pause();
    };
  }, []);

  const play = useCallback((base64: string) => {
    const audio = new Audio(`data:audio/mpeg;base64,${base64}`);
    audioRef.current = audio;
    audio.onended = () => setState("idle");
    audio.onerror = () => setState("idle");
    setState("speaking");
    void audio.play().catch(() => setState("idle"));
  }, []);

  const handleTap = useCallback(async () => {
    if (state === "thinking") return;

    if (state === "speaking") {
      audioRef.current?.pause();
      setState("idle");
      return;
    }

    if (state === "listening") {
      const recorder = recorderRef.current;
      recorderRef.current = null;
      if (!recorder) return setState("idle");
      setState("thinking");
      try {
        const blob = await recorder.stop();
        if (blob.size < 4096) {
          setState("idle");
          toast.error("Kuch sunai nahi diya — dubara boliye");
          return;
        }
        const audioBase64 = await blobToBase64(blob);
        const result = await ask({ data: { audioBase64 } });
        play(result.audioBase64);
      } catch (error) {
        setState("idle");
        toast.error(error instanceof Error ? error.message : "Voice assistant failed");
      }
      return;
    }

    try {
      recorderRef.current = await startRecording();
      setState("listening");
    } catch {
      toast.error("Microphone access chahiye — permission allow kijiye");
    }
  }, [ask, play, state]);

  const busy = state === "thinking";

  return (
    <div className="no-print fixed bottom-24 right-4 z-40 flex flex-col items-end gap-2 lg:bottom-6">
      <span
        className={cn(
          "rounded-full bg-card/95 px-3 py-1.5 text-[11px] font-medium shadow-[var(--shadow-card)] backdrop-blur",
          state === "idle" ? "text-muted-foreground" : "text-primary",
        )}
      >
        {LABEL[state]}
      </span>
      <button
        type="button"
        onClick={handleTap}
        aria-label="AI voice assistant"
        className={cn(
          "flex size-14 items-center justify-center rounded-full text-primary-foreground shadow-[var(--shadow-card)] transition-transform active:scale-95",
          state === "listening" ? "animate-pulse bg-destructive" : "gradient-hero",
        )}
      >
        {busy ? (
          <Loader2 className="size-6 animate-spin" />
        ) : state === "listening" || state === "speaking" ? (
          <Square className="size-5 fill-current" />
        ) : (
          <Mic className="size-6" />
        )}
      </button>
    </div>
  );
}
