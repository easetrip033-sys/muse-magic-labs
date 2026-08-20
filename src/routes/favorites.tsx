import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Download, Heart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { GlassCard, PageHeader } from "@/components/app-shell";
import { libraryItems } from "@/lib/mock";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "Favorites & Library — Content Studio" },
      {
        name: "description",
        content:
          "Your personal library of saved AI posts, images, reels and stories with likes and quick downloads.",
      },
      { property: "og:title", content: "Favorites & Personal Library" },
      {
        property: "og:description",
        content: "Everything you generated, saved and liked in one library.",
      },
    ],
  }),
  component: FavoritesPage,
});

const filters = ["All", "Post", "Image", "Reel", "Story", "Product"] as const;

function FavoritesPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [items, setItems] = useState(libraryItems);

  const shown = items.filter((i) => filter === "All" || i.type === filter);

  const toggle = (id: string) => {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, liked: !i.liked } : i)));
  };

  return (
    <div>
      <PageHeader
        title="Favorites & Library"
        subtitle="Everything you've generated, saved and liked — ready to reuse or re-export."
        action={
          <span className="glass rounded-full px-4 py-2 text-xs font-semibold">
            {items.filter((i) => i.liked).length} liked · {items.length} saved
          </span>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-4 py-2 text-xs font-semibold transition-all ${
              f === filter
                ? "gradient-brand text-brand-foreground"
                : "border border-glass-border text-muted-foreground hover:bg-accent"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {shown.map((item, i) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <GlassCard className="p-3">
              <div className={`aspect-[4/3] rounded-2xl bg-gradient-to-br ${item.gradient}`} />
              <div className="flex items-start justify-between gap-3 p-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} · {item.platform} · {item.createdAt}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => toggle(item.id)}
                    aria-label="Toggle like"
                    className="grid size-9 place-items-center rounded-xl border border-glass-border hover:bg-accent"
                  >
                    <Heart
                      className={`size-4 ${item.liked ? "fill-primary text-primary" : ""}`}
                    />
                  </button>
                  <button
                    onClick={() => toast.success("Download started")}
                    aria-label="Download"
                    className="grid size-9 place-items-center rounded-xl border border-glass-border hover:bg-accent"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
