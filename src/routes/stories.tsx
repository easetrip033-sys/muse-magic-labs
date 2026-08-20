import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Download, Layers, Type } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, PageHeader } from "@/components/app-shell";
import { imageStyles, storyTemplates } from "@/lib/mock";

export const Route = createFileRoute("/stories")({
  head: () => ({
    meta: [
      { title: "AI Story Generator — Content Studio" },
      {
        name: "description",
        content:
          "Build Instagram stories from templates with text overlays and AI-generated backgrounds.",
      },
      { property: "og:title", content: "AI Story Generator" },
      {
        property: "og:description",
        content: "Instagram story templates, overlays and AI backgrounds.",
      },
    ],
  }),
  component: StoriesPage,
});

function StoriesPage() {
  const [template, setTemplate] = useState(storyTemplates[0]!);
  const [headline, setHeadline] = useState("Weekend Sale");
  const [sub, setSub] = useState("Up to 40% off — today only");
  const [bg, setBg] = useState(imageStyles[3]!);

  return (
    <div>
      <PageHeader
        title="AI Story Generator"
        subtitle="Pick a 9:16 template, edit your overlays and let AI paint the background."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <GlassCard>
          <p className="mb-4 flex items-center gap-2 font-display font-semibold">
            <Layers className="size-4 text-primary" /> Templates
          </p>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {storyTemplates.map((t) => (
              <button
                key={t.name}
                onClick={() => setTemplate(t)}
                className={`overflow-hidden rounded-2xl border p-1.5 text-left transition-transform hover:-translate-y-1 ${
                  t.name === template.name ? "border-primary glow" : "border-glass-border"
                }`}
              >
                <div
                  className={`grid aspect-[9/16] place-items-end rounded-xl bg-gradient-to-br p-3 ${t.accent}`}
                >
                  <span className="text-xs font-semibold text-white/90">{t.name}</span>
                </div>
              </button>
            ))}
          </div>
        </GlassCard>

        <div className="space-y-4">
          <GlassCard className="space-y-4">
            <p className="flex items-center gap-2 font-display font-semibold">
              <Type className="size-4 text-primary" /> Text overlays
            </p>
            <input
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full rounded-xl border border-glass-border bg-background/40 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Headline"
            />
            <input
              value={sub}
              onChange={(e) => setSub(e.target.value)}
              className="w-full rounded-xl border border-glass-border bg-background/40 px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
              placeholder="Subtext"
            />
            <select
              value={bg}
              onChange={(e) => setBg(e.target.value)}
              className="w-full rounded-xl border border-glass-border bg-background/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {imageStyles.map((s) => (
                <option key={s}>{s} background</option>
              ))}
            </select>
            <button
              onClick={() => toast.success("Story exported in 1080×1920")}
              className="gradient-brand flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.01]"
            >
              <Download className="size-4" /> Export story
            </button>
          </GlassCard>

          <GlassCard>
            <p className="mb-3 font-display font-semibold">Live preview</p>
            <motion.div
              key={template.name + headline + sub}
              initial={{ opacity: 0.4, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className={`mx-auto flex aspect-[9/16] w-56 flex-col justify-end rounded-3xl bg-gradient-to-br p-5 ${template.accent}`}
            >
              <p className="font-display text-2xl font-bold leading-tight text-white">{headline}</p>
              <p className="mt-2 text-sm text-white/80">{sub}</p>
              <span className="mt-4 w-fit rounded-full bg-white/20 px-3 py-1 text-[10px] text-white backdrop-blur">
                {bg} background
              </span>
            </motion.div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
