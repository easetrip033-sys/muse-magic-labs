import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Download, Heart, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, PageHeader } from "@/components/app-shell";
import { imageStyles } from "@/lib/mock";

export const Route = createFileRoute("/images")({
  head: () => ({
    meta: [
      { title: "AI Image Studio — Content Studio" },
      {
        name: "description",
        content:
          "Generate post and story images in eight visual styles, pick an aspect ratio and download in HD.",
      },
      { property: "og:title", content: "AI Image Studio" },
      {
        property: "og:description",
        content: "Post and story visuals in multiple styles, downloadable in HD.",
      },
    ],
  }),
  component: ImagesPage,
});

const sizes = ["1024×1024", "1024×1792", "1792×1024", "1080×1920"];

const swatches = [
  "from-fuchsia-500 to-violet-600",
  "from-indigo-500 to-sky-500",
  "from-amber-400 to-rose-500",
  "from-emerald-400 to-teal-500",
  "from-violet-600 to-blue-600",
  "from-pink-500 to-purple-600",
];

function ImagesPage() {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState(imageStyles[0]!);
  const [size, setSize] = useState(sizes[0]!);
  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState<string | null>(null);
  const [isFinal, setIsFinal] = useState(false);

  const generate = async () => {
    if (!prompt.trim()) {
      toast.error("Describe the image you want first");
      return;
    }
    setLoading(true);
    setIsFinal(false);
    setImage(null);
    try {
      await streamImage(
        "/api/generate-image",
        `${prompt}. Visual style: ${style}. Aspect/size target: ${size} pixels.`,
        (dataUrl, final) => {
          setImage(dataUrl);
          if (final) setIsFinal(true);
        },
      );
      toast.success("Image ready");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Image generation failed");
    } finally {
      setLoading(false);
    }
  };

  const download = () => {
    if (!image) return;
    const a = document.createElement("a");
    a.href = image;
    a.download = `ai-image-${Date.now()}.png`;
    a.click();
  };

  return (
    <div>
      <PageHeader
        title="AI Image Studio"
        subtitle="Describe the visual, choose a style and export an HD asset for posts or stories."
      />

      <div className="grid gap-6 lg:grid-cols-[380px_1fr]">
        <GlassCard className="space-y-5">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={5}
            placeholder="Highly detailed portrait, cinematic lighting, warm gradient background…"
            className="w-full resize-none rounded-2xl border border-glass-border bg-background/40 p-4 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          <div>
            <p className="mb-2 text-sm font-semibold">Image style</p>
            <div className="grid grid-cols-2 gap-2">
              {imageStyles.map((s) => (
                <button
                  key={s}
                  onClick={() => setStyle(s)}
                  className={`rounded-xl border px-3 py-2 text-xs font-medium transition-all ${
                    s === style
                      ? "gradient-brand border-transparent text-brand-foreground"
                      : "border-glass-border hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold">Image size</p>
            <div className="flex flex-wrap gap-2">
              {sizes.map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`rounded-full border px-3 py-1.5 text-xs transition-all ${
                    s === size
                      ? "border-primary text-primary"
                      : "border-glass-border text-muted-foreground hover:bg-accent"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="gradient-soft flex items-center gap-3 rounded-2xl border border-glass-border p-3 text-sm">
            <Sparkles className="size-4 text-primary" />
            5,102 images left this month
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="gradient-brand w-full rounded-xl px-4 py-3 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            {loading ? "Generating…" : "Generate image"}
          </button>
        </GlassCard>

        <div className="grid gap-4 sm:grid-cols-2">
          {(generated.length ? generated : swatches).map((g, i) => (
            <motion.div
              key={g + i}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass group relative overflow-hidden rounded-3xl p-2"
            >
              <div
                className={`aspect-[4/5] rounded-2xl bg-gradient-to-br ${g} ${
                  loading ? "animate-pulse" : ""
                }`}
              />
              <div className="absolute inset-x-4 bottom-4 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
                <span className="glass rounded-full px-3 py-1 text-xs">{style}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => toast.success("Added to favorites")}
                    aria-label="Favorite"
                    className="glass grid size-9 place-items-center rounded-full"
                  >
                    <Heart className="size-4" />
                  </button>
                  <button
                    onClick={() => toast.success("Downloading HD image")}
                    aria-label="Download HD"
                    className="glass grid size-9 place-items-center rounded-full"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
