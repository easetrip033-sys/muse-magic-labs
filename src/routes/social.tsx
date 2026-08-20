import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Copy, Facebook, Heart, Instagram, Linkedin, Sparkles, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, PageHeader } from "@/components/app-shell";
import { generatedPostSample, languages, platforms, tones, type Platform } from "@/lib/mock";

export const Route = createFileRoute("/social")({
  head: () => ({
    meta: [
      { title: "AI Social Media Post Generator — Content Studio" },
      {
        name: "description",
        content:
          "Generate Instagram, Facebook, LinkedIn and Twitter posts with captions, emojis, hashtags, tone and language control.",
      },
      { property: "og:title", content: "AI Social Media Post Generator" },
      {
        property: "og:description",
        content: "Captions, emojis and hashtags for every platform in any language.",
      },
    ],
  }),
  component: SocialPage,
});

const platformIcon = {
  Instagram,
  Facebook,
  LinkedIn: Linkedin,
  Twitter,
} as const;

function SocialPage() {
  const [platform, setPlatform] = useState<Platform>("Instagram");
  const [tone, setTone] = useState(tones[0]!);
  const [language, setLanguage] = useState(languages[0]!);
  const [topic, setTopic] = useState("");
  const [result, setResult] = useState<ReturnType<typeof generatedPostSample> | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = () => {
    setLoading(true);
    // API placeholder: POST /api/generate/social-post
    setTimeout(() => {
      setResult(generatedPostSample(platform, topic, tone, language));
      setLoading(false);
      toast.success("Post generated");
    }, 900);
  };

  return (
    <div>
      <PageHeader
        title="Social Post Generator"
        subtitle="Write scroll-stopping posts with captions, emojis and hashtags — tuned per platform, tone and language."
      />

      <div className="grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <GlassCard className="space-y-6">
          <div>
            <p className="mb-3 text-sm font-semibold">1. Choose platform</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {platforms.map((p) => {
                const Icon = platformIcon[p];
                const active = p === platform;
                return (
                  <button
                    key={p}
                    onClick={() => setPlatform(p)}
                    className={`flex flex-col items-center gap-2 rounded-2xl border p-3 text-xs font-medium transition-all ${
                      active
                        ? "gradient-brand border-transparent text-brand-foreground glow"
                        : "border-glass-border hover:bg-accent"
                    }`}
                  >
                    <Icon className="size-4" />
                    {p}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="mb-3 text-sm font-semibold">2. Describe your idea</p>
            <textarea
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              maxLength={400}
              rows={4}
              placeholder="e.g. Launching our new organic skincare line for monsoon season"
              className="w-full resize-none rounded-2xl border border-glass-border bg-background/40 p-4 text-sm outline-none transition-shadow focus:ring-2 focus:ring-ring"
            />
            <p className="mt-1 text-right text-xs text-muted-foreground">{topic.length}/400</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-semibold">
              Tone
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="mt-2 w-full rounded-xl border border-glass-border bg-background/40 px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-ring"
              >
                {tones.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </label>
            <label className="text-sm font-semibold">
              Language
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="mt-2 w-full rounded-xl border border-glass-border bg-background/40 px-3 py-2.5 text-sm font-normal outline-none focus:ring-2 focus:ring-ring"
              >
                {languages.map((l) => (
                  <option key={l}>{l}</option>
                ))}
              </select>
            </label>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="gradient-brand flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            <Sparkles className={`size-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? "Generating…" : "Generate post"}
          </button>
        </GlassCard>

        <GlassCard className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-display font-semibold">Preview</p>
            <div className="flex gap-2">
              <button
                onClick={() => toast.success("Saved to favorites")}
                className="grid size-9 place-items-center rounded-xl border border-glass-border hover:bg-accent"
                aria-label="Save to favorites"
              >
                <Heart className="size-4" />
              </button>
              <button
                onClick={() => toast.success("Copied to clipboard")}
                className="grid size-9 place-items-center rounded-xl border border-glass-border hover:bg-accent"
                aria-label="Copy content"
              >
                <Copy className="size-4" />
              </button>
            </div>
          </div>

          {!result ? (
            <div className="grid h-72 place-items-center rounded-2xl border border-dashed border-glass-border text-center text-sm text-muted-foreground">
              Your generated post will appear here.
            </div>
          ) : (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
              <div className="rounded-2xl border border-glass-border bg-background/40 p-4">
                <p className="text-sm font-medium">{result.caption}</p>
                <div className="mt-3 space-y-2 text-sm text-muted-foreground">
                  {result.body.map((line) => (
                    <p key={line}>{line}</p>
                  ))}
                </div>
                <p className="mt-3 text-sm font-semibold text-primary">{result.cta}</p>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Emojis
                </p>
                <p className="mt-2 text-2xl">{result.emojis.join(" ")}</p>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Hashtags
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {result.hashtags.map((h) => (
                    <span
                      key={h}
                      className="rounded-full border border-glass-border px-3 py-1 text-xs text-primary"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </GlassCard>
      </div>
    </div>
  );
}
