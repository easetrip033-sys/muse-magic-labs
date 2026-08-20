import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { ImagePlus, Search, Sparkles, Tag, Wand2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, PageHeader } from "@/components/app-shell";
import { languages, tones } from "@/lib/mock";

export const Route = createFileRoute("/product")({
  head: () => ({
    meta: [
      { title: "Promotional Product Generator — Content Studio" },
      {
        name: "description",
        content:
          "Upload a product photo and get an AI-written description, call-to-action variants and SEO keywords instantly.",
      },
      { property: "og:title", content: "Promotional Product Generator" },
      {
        property: "og:description",
        content: "AI product descriptions, CTAs and SEO keywords from a single photo.",
      },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const [preview, setPreview] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [tone, setTone] = useState(tones[6]!);
  const [language, setLanguage] = useState(languages[0]!);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const onFile = (file?: File) => {
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    // API placeholder: POST /api/uploads (image storage)
  };

  const generate = () => {
    setLoading(true);
    // API placeholder: POST /api/generate/product-copy
    setTimeout(() => {
      setLoading(false);
      setDone(true);
      toast.success("Product copy generated");
    }, 900);
  };

  const productName = name || "Your product";

  return (
    <div>
      <PageHeader
        title="Promotional Product Generator"
        subtitle="Drop in a product shot — get a conversion-ready description, CTAs and SEO keywords."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <GlassCard className="space-y-5">
          <label className="grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-glass-border bg-background/30 text-center">
            {preview ? (
              <img src={preview} alt="Uploaded product" className="size-full object-cover" />
            ) : (
              <span className="px-6 text-sm text-muted-foreground">
                <ImagePlus className="mx-auto mb-3 size-8 text-primary" />
                Click to upload a product image
                <span className="mt-1 block text-xs">PNG or JPG up to 10MB</span>
              </span>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </label>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product name"
            className="w-full rounded-xl border border-glass-border bg-background/40 px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />

          <div className="grid gap-4 sm:grid-cols-2">
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="rounded-xl border border-glass-border bg-background/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {tones.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="rounded-xl border border-glass-border bg-background/40 px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            >
              {languages.map((l) => (
                <option key={l}>{l}</option>
              ))}
            </select>
          </div>

          <button
            onClick={generate}
            disabled={loading}
            className="gradient-brand flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.01] disabled:opacity-60"
          >
            <Wand2 className={`size-4 ${loading ? "animate-pulse" : ""}`} />
            {loading ? "Analyzing image…" : "Generate marketing copy"}
          </button>
        </GlassCard>

        <div className="space-y-4">
          {!done ? (
            <GlassCard className="grid h-full min-h-72 place-items-center text-center text-sm text-muted-foreground">
              Your product description, CTAs and SEO keywords will appear here.
            </GlassCard>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <GlassCard>
                <p className="flex items-center gap-2 font-display font-semibold">
                  <Sparkles className="size-4 text-primary" /> Product description
                </p>
                <p className="mt-3 text-sm text-muted-foreground">
                  {productName} is built for people who refuse to compromise. A {tone.toLowerCase()}{" "}
                  finish, thoughtfully engineered materials and a design that looks as good on your
                  shelf as it performs in your hands. Written in {language}, optimised for
                  marketplaces and social storefronts alike.
                </p>
                <ul className="mt-4 space-y-2 text-sm">
                  {[
                    "Premium materials with a 2-year guarantee",
                    "Designed for everyday use, built to last",
                    "Ships carbon-neutral in 48 hours",
                  ].map((b) => (
                    <li key={b} className="flex gap-2 text-muted-foreground">
                      <span className="text-primary">•</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </GlassCard>

              <GlassCard>
                <p className="flex items-center gap-2 font-display font-semibold">
                  <Tag className="size-4 text-primary" /> Call-to-action variants
                </p>
                <div className="mt-3 space-y-2">
                  {[
                    `Shop ${productName} — free shipping today`,
                    "Claim 20% off your first order →",
                    "Only 12 left in stock. Get yours now.",
                  ].map((c) => (
                    <div
                      key={c}
                      className="rounded-xl border border-glass-border bg-background/40 px-4 py-3 text-sm"
                    >
                      {c}
                    </div>
                  ))}
                </div>
              </GlassCard>

              <GlassCard>
                <p className="flex items-center gap-2 font-display font-semibold">
                  <Search className="size-4 text-primary" /> SEO keywords
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {[
                    "premium product",
                    "buy online",
                    "best 2026",
                    "sustainable design",
                    "free shipping",
                    "gift ideas",
                    "top rated",
                  ].map((k) => (
                    <span
                      key={k}
                      className="rounded-full border border-glass-border px-3 py-1 text-xs text-primary"
                    >
                      {k}
                    </span>
                  ))}
                </div>
              </GlassCard>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
