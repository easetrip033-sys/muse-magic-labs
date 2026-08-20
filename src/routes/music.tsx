import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { AudioLines, ImagePlus, Play } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, PageHeader } from "@/components/app-shell";
import { spotifyTracks } from "@/lib/mock";

export const Route = createFileRoute("/music")({
  head: () => ({
    meta: [
      { title: "AI Music Suggestions — Content Studio" },
      {
        name: "description",
        content:
          "Analyze a generated image and get Spotify track recommendations that match its mood and pacing.",
      },
      { property: "og:title", content: "AI Music Suggestions" },
      {
        property: "og:description",
        content: "Spotify tracks matched to the mood of your visuals.",
      },
    ],
  }),
  component: MusicPage,
});

function MusicPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [loading, setLoading] = useState(false);

  const analyze = () => {
    setLoading(true);
    // API placeholder: POST /api/analyze/image -> Spotify recommendations
    setTimeout(() => {
      setLoading(false);
      setAnalyzed(true);
      toast.success("5 matching tracks found");
    }, 1000);
  };

  return (
    <div>
      <PageHeader
        title="AI Music Match"
        subtitle="We read the mood, colour and energy of your visual, then recommend Spotify tracks that fit."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <GlassCard className="space-y-4">
          <label className="grid aspect-[4/5] cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-glass-border bg-background/30 text-center">
            {preview ? (
              <img src={preview} alt="Visual to analyze" className="size-full object-cover" />
            ) : (
              <span className="px-6 text-sm text-muted-foreground">
                <ImagePlus className="mx-auto mb-3 size-8 text-primary" />
                Upload or pick a generated image
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setPreview(URL.createObjectURL(f));
              }}
            />
          </label>
          <button
            onClick={analyze}
            disabled={loading}
            className="gradient-brand flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            <AudioLines className={`size-4 ${loading ? "animate-pulse" : ""}`} />
            {loading ? "Analyzing mood…" : "Suggest music"}
          </button>
        </GlassCard>

        <GlassCard>
          <p className="font-display font-semibold">Recommended tracks</p>
          <p className="text-xs text-muted-foreground">Powered by the Spotify catalogue</p>
          <div className="mt-4 space-y-3">
            {spotifyTracks.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: analyzed ? 1 : 0.45, x: 0 }}
                transition={{ delay: i * 0.06 }}
                className="flex items-center gap-4 rounded-2xl border border-glass-border bg-background/30 p-3"
              >
                <button
                  onClick={() => toast("Preview playing", { description: t.title })}
                  aria-label={`Play ${t.title}`}
                  className="gradient-brand grid size-11 shrink-0 place-items-center rounded-xl text-brand-foreground"
                >
                  <Play className="size-4" />
                </button>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{t.title}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {t.artist} · {t.mood}
                  </p>
                </div>
                <span className="rounded-full bg-success/15 px-2.5 py-1 text-xs font-semibold text-success">
                  {t.match}%
                </span>
              </motion.div>
            ))}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
