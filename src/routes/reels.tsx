import { createFileRoute } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Briefcase,
  Check,
  Download,
  Flame,
  GraduationCap,
  HeartPulse,
  Music4,
  Plane,
  Play,
  Salad,
  Share2,
  Shirt,
  Sparkles,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { GlassCard, PageHeader } from "@/components/app-shell";
import { imageStyles, languages, reelCategories, suggestedPrompts, voices } from "@/lib/mock";

export const Route = createFileRoute("/reels")({
  head: () => ({
    meta: [
      { title: "AI Reel Generator — Content Studio" },
      {
        name: "description",
        content:
          "Category to prompt to preview: generate AI reels with script, captions, voiceover, visuals and background music.",
      },
      { property: "og:title", content: "AI Reel Generator" },
      {
        property: "og:description",
        content: "Generate complete AI reels with voiceover, visuals and music.",
      },
    ],
  }),
  component: ReelsPage,
});

const icons: Record<string, typeof Flame> = {
  HeartPulse,
  Shirt,
  GraduationCap,
  Salad,
  Flame,
  BookOpen,
  Plane,
  Briefcase,
};

const steps = ["Category", "Prompt", "Customize", "Generate", "Preview"];
const durations = ["15 seconds", "30 seconds", "45 seconds", "60 seconds"];
const ratios = ["9:16 (Reels)", "1:1 (Feed)", "16:9 (YouTube)"];
const musicMoods = ["Upbeat", "Cinematic", "Lo-fi", "Corporate", "Emotional"];

function ReelsPage() {
  const [step, setStep] = useState(0);
  const [category, setCategory] = useState(reelCategories[0]!.name);
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(imageStyles[0]!);
  const [voice, setVoice] = useState(voices[0]!);
  const [language, setLanguage] = useState(languages[0]!);
  const [duration, setDuration] = useState(durations[1]!);
  const [music, setMusic] = useState(musicMoods[0]!);
  const [ratio, setRatio] = useState(ratios[0]!);
  const [progress, setProgress] = useState(0);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (step !== 3) return;
    let cancelled = false;
    setProgress(2);
    setVideoUrl(null);

    const run = async () => {
      try {
        const res = await fetch("/api/generate-video", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: `${prompt || category}. Visual style: ${style}. Mood/music: ${music}. Vertical social reel.`,
            durationSeconds: 8,
            aspectRatio: ratio.startsWith("16:9") ? "16:9" : "9:16",
          }),
        });
        const job = (await res.json()) as { id?: string; error?: string };
        if (!res.ok || !job.id) throw new Error(job.error ?? "Video generation failed");

        while (!cancelled) {
          await new Promise((r) => setTimeout(r, 6000));
          const poll = await fetch(`/api/generate-video?id=${job.id}`);
          const status = (await poll.json()) as {
            status?: string;
            progress?: number;
            error?: { message?: string };
          };
          if (typeof status.progress === "number") {
            setProgress(Math.max(2, Math.min(99, status.progress)));
          }
          if (status.status === "completed") {
            if (cancelled) return;
            setProgress(100);
            setVideoUrl(`/api/generate-video?id=${job.id}&content=1`);
            setStep(4);
            return;
          }
          if (status.status === "failed") {
            throw new Error(status.error?.message ?? "Video generation failed");
          }
        }
      } catch (e) {
        if (cancelled) return;
        toast.error(e instanceof Error ? e.message : "Video generation failed");
        setStep(2);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step]);

  const next = () => setStep((s) => Math.min(s + 1, 4));
  const back = () => setStep((s) => Math.max(s - 1, 0));

  return (
    <div>
      <PageHeader
        title="AI Reel Generator"
        subtitle="Category → prompt → customize → generate → preview. Script, voiceover, visuals and music included."
      />

      <GlassCard className="mb-6">
        <div className="flex flex-wrap items-center gap-3">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-3">
              <span
                className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors ${
                  i <= step
                    ? "gradient-brand text-brand-foreground"
                    : "border border-glass-border text-muted-foreground"
                }`}
              >
                {i < step ? <Check className="size-3" /> : <span>{i + 1}</span>}
                {s}
              </span>
              {i < steps.length - 1 && <span className="h-px w-6 bg-border" />}
            </div>
          ))}
        </div>
      </GlassCard>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.25 }}
        >
          {step === 0 && (
            <GlassCard>
              <p className="mb-4 font-display font-semibold">Select a category</p>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {reelCategories.map((c) => {
                  const Icon = icons[c.icon] ?? Sparkles;
                  const active = c.name === category;
                  return (
                    <button
                      key={c.name}
                      onClick={() => setCategory(c.name)}
                      className={`flex flex-col items-start gap-3 rounded-2xl border p-4 text-left text-sm font-medium transition-all hover:-translate-y-1 ${
                        active
                          ? "gradient-brand border-transparent text-brand-foreground glow"
                          : "border-glass-border"
                      }`}
                    >
                      <Icon className="size-5" />
                      {c.name}
                    </button>
                  );
                })}
              </div>
            </GlassCard>
          )}

          {step === 1 && (
            <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
              <GlassCard>
                <p className="mb-3 font-display font-semibold">Write your prompt</p>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={7}
                  maxLength={500}
                  placeholder="Describe the reel you want to create…"
                  className="w-full resize-none rounded-2xl border border-glass-border bg-background/40 p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
                />
                <p className="mt-1 text-right text-xs text-muted-foreground">{prompt.length}/500</p>
              </GlassCard>
              <GlassCard>
                <p className="mb-3 flex items-center gap-2 font-display font-semibold">
                  <Sparkles className="size-4 text-primary" /> Suggested prompts
                </p>
                <div className="space-y-2">
                  {(suggestedPrompts[category] ?? []).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPrompt(p)}
                      className="flex w-full items-center justify-between gap-3 rounded-xl border border-glass-border bg-background/30 px-4 py-3 text-left text-sm transition-colors hover:bg-accent"
                    >
                      {p}
                      <ArrowRight className="size-4 shrink-0 text-primary" />
                    </button>
                  ))}
                </div>
              </GlassCard>
            </div>
          )}

          {step === 2 && (
            <div className="grid gap-6 lg:grid-cols-2">
              <GlassCard>
                <p className="mb-4 font-display font-semibold">Visual style</p>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {imageStyles.map((s) => (
                    <button
                      key={s}
                      onClick={() => setStyle(s)}
                      className={`overflow-hidden rounded-2xl border p-1.5 text-xs transition-transform hover:-translate-y-1 ${
                        s === style ? "border-primary glow" : "border-glass-border"
                      }`}
                    >
                      <span className="gradient-soft mb-2 block aspect-[3/4] rounded-xl" />
                      {s}
                    </button>
                  ))}
                </div>
              </GlassCard>
              <GlassCard className="space-y-4">
                <p className="font-display font-semibold">Additional settings</p>
                {[
                  { label: "Voice", value: voice, set: setVoice, options: voices },
                  { label: "Language", value: language, set: setLanguage, options: languages },
                  { label: "Duration", value: duration, set: setDuration, options: durations },
                  { label: "Music mood", value: music, set: setMusic, options: musicMoods },
                  { label: "Aspect ratio", value: ratio, set: setRatio, options: ratios },
                ].map((f) => (
                  <label key={f.label} className="block text-sm font-semibold">
                    {f.label}
                    <select
                      value={f.value}
                      onChange={(e) => f.set(e.target.value)}
                      className="mt-2 w-full rounded-xl border border-glass-border bg-background/40 px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-ring"
                    >
                      {f.options.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                  </label>
                ))}
              </GlassCard>
            </div>
          )}

          {step === 3 && (
            <GlassCard className="grid place-items-center py-16 text-center">
              <div className="relative grid size-40 place-items-center">
                <svg viewBox="0 0 100 100" className="absolute size-40 -rotate-90">
                  <circle cx="50" cy="50" r="44" className="fill-none stroke-border" strokeWidth="8" />
                  <circle
                    cx="50"
                    cy="50"
                    r="44"
                    className="fill-none stroke-primary"
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={276}
                    strokeDashoffset={276 - (276 * progress) / 100}
                  />
                </svg>
                <span className="font-display text-2xl font-bold">{progress}%</span>
              </div>
              <p className="mt-6 font-display text-lg font-semibold">AI is creating your reel…</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Script · captions · voiceover · visuals · background music
              </p>
            </GlassCard>
          )}

          {step === 4 && (
            <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
              <GlassCard>
                <div className="gradient-brand relative grid aspect-[9/16] place-items-center overflow-hidden rounded-2xl">
                  {videoUrl ? (
                    <video
                      src={videoUrl}
                      controls
                      autoPlay
                      loop
                      playsInline
                      className="size-full rounded-2xl object-cover"
                    />
                  ) : (
                    <>
                      <span className="glass grid size-16 place-items-center rounded-full">
                        <Play className="size-6" />
                      </span>
                      <span className="glass absolute bottom-4 left-4 right-4 rounded-xl px-3 py-2 text-center text-xs">
                        {prompt || "Your generated reel"}
                      </span>
                    </>
                  )}
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <a
                    href={videoUrl ?? "#"}
                    download={`ai-reel-${Date.now()}.mp4`}
                    className={`gradient-brand flex items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-brand-foreground ${
                      videoUrl ? "" : "pointer-events-none opacity-40"
                    }`}
                  >
                    <Download className="size-4" /> Download
                  </a>
                  <button
                    onClick={() => toast.success("Share link copied")}
                    className="flex items-center justify-center gap-2 rounded-xl border border-glass-border px-3 py-2.5 text-sm font-semibold hover:bg-accent"
                  >
                    <Share2 className="size-4" /> Share
                  </button>
                </div>
              </GlassCard>

              <div className="space-y-4">
                <GlassCard>
                  <p className="font-display font-semibold">Generated script</p>
                  <div className="mt-3 space-y-3 text-sm text-muted-foreground">
                    <p>
                      <span className="text-primary">0:00</span> — Hook: “{prompt || category} — here's
                      what nobody tells you.”
                    </p>
                    <p>
                      <span className="text-primary">0:06</span> — Three quick points with on-screen
                      captions and {style.toLowerCase()} visuals.
                    </p>
                    <p>
                      <span className="text-primary">0:22</span> — Payoff plus CTA: “Follow for more.”
                    </p>
                  </div>
                </GlassCard>
                <div className="grid gap-4 sm:grid-cols-2">
                  <GlassCard>
                    <p className="flex items-center gap-2 text-sm font-semibold">
                      <Music4 className="size-4 text-primary" /> Background music
                    </p>
                    <p className="mt-2 text-sm text-muted-foreground">{music} · auto-ducked under voiceover</p>
                  </GlassCard>
                  <GlassCard>
                    <p className="text-sm font-semibold">Output settings</p>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {ratio} · {duration} · {voice} · {language}
                    </p>
                  </GlassCard>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {step !== 3 && (
        <div className="mt-6 flex justify-between gap-3">
          <button
            onClick={back}
            disabled={step === 0}
            className="flex items-center gap-2 rounded-xl border border-glass-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent disabled:opacity-40"
          >
            <ArrowLeft className="size-4" /> Back
          </button>
          <button
            onClick={() => (step === 4 ? setStep(0) : next())}
            className="gradient-brand flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.03]"
          >
            {step === 4 ? "Create another" : step === 2 ? "Generate reel" : "Next"}
            <ArrowRight className="size-4" />
          </button>
        </div>
      )}
    </div>
  );
}
