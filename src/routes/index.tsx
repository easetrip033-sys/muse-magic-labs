import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  ArrowRight,
  BarChart3,
  Clapperboard,
  Download,
  Heart,
  Image as ImageIcon,
  Music4,
  PenLine,
  ShoppingBag,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { GlassCard, PageHeader } from "@/components/app-shell";
import { libraryItems } from "@/lib/mock";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "AI Content Creator Studio — Dashboard" },
      {
        name: "description",
        content:
          "Generate social posts, product promos, AI images, stories and reels from one premium AI content studio dashboard.",
      },
      { property: "og:title", content: "AI Content Creator Studio — Dashboard" },
      {
        property: "og:description",
        content: "One AI studio for posts, images, stories, reels and analytics.",
      },
    ],
  }),
  component: Dashboard,
});

const stats = [
  { label: "Generated posts", value: "1,284", change: "+18%", icon: PenLine },
  { label: "Downloads", value: "612", change: "+9%", icon: Download },
  { label: "Favorites", value: "238", change: "+24%", icon: Heart },
  { label: "Predicted reach", value: "94K", change: "+31%", icon: TrendingUp },
];

const tools = [
  {
    to: "/social",
    title: "Social Post Generator",
    desc: "Captions, emojis and hashtags for every platform.",
    icon: PenLine,
  },
  {
    to: "/product",
    title: "Product Promo",
    desc: "Upload a product, get descriptions, CTAs and SEO.",
    icon: ShoppingBag,
  },
  {
    to: "/images",
    title: "AI Image Studio",
    desc: "Posts and story visuals in 8 signature styles.",
    icon: ImageIcon,
  },
  {
    to: "/stories",
    title: "Story Maker",
    desc: "Templates, overlays and AI backgrounds.",
    icon: Sparkles,
  },
  {
    to: "/reels",
    title: "Reel Generator",
    desc: "Script, voiceover, visuals and music in one flow.",
    icon: Clapperboard,
  },
  {
    to: "/music",
    title: "Music Match",
    desc: "Spotify tracks matched to your visuals.",
    icon: Music4,
  },
] as const;

function Dashboard() {
  return (
    <div>
      <PageHeader
        title="Welcome back, John"
        subtitle="Your AI studio is warmed up. Pick a tool and ship today's content in minutes."
        action={
          <Link
            to="/reels"
            className="gradient-brand inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-brand-foreground transition-transform hover:scale-[1.03]"
          >
            <Sparkles className="size-4" /> New generation
          </Link>
        }
      />

      <GlassCard className="gradient-soft mb-6 overflow-hidden p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              New functionality
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold leading-tight">
              Turn a single prompt into a <span className="gradient-text">complete AI reel</span>
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Category → prompt → style → voice → music. Preview and download in 9:16, 1:1 or 16:9.
            </p>
            <Link
              to="/reels"
              className="mt-5 inline-flex items-center gap-2 rounded-xl border border-glass-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-accent"
            >
              Try reel generator <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="glass grid aspect-[9/16] w-40 place-items-center rounded-3xl">
            <span className="gradient-brand grid size-14 place-items-center rounded-full text-brand-foreground">
              <Clapperboard className="size-6" />
            </span>
          </div>
        </div>
      </GlassCard>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
          >
            <GlassCard>
              <div className="flex items-start justify-between">
                <span className="grid size-10 place-items-center rounded-xl bg-accent text-accent-foreground">
                  <s.icon className="size-4" />
                </span>
                <span className="rounded-full bg-success/15 px-2 py-1 text-xs font-semibold text-success">
                  {s.change}
                </span>
              </div>
              <p className="mt-4 font-display text-2xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <h2 className="mb-3 font-display text-lg font-semibold">Studio tools</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {tools.map((t) => (
              <Link key={t.to} to={t.to} className="group">
                <GlassCard className="h-full transition-transform group-hover:-translate-y-1">
                  <span className="gradient-brand grid size-10 place-items-center rounded-xl text-brand-foreground">
                    <t.icon className="size-4" />
                  </span>
                  <p className="mt-4 font-display font-semibold">{t.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
                </GlassCard>
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h2 className="mb-3 font-display text-lg font-semibold">Recent activity</h2>
          <GlassCard className="space-y-3">
            {libraryItems.slice(0, 6).map((item) => (
              <div key={item.id} className="flex items-center gap-3">
                <span
                  className={`size-10 shrink-0 rounded-xl bg-gradient-to-br ${item.gradient}`}
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.type} · {item.createdAt}
                  </p>
                </div>
                {item.liked && <Heart className="size-4 fill-primary text-primary" />}
              </div>
            ))}
            <Link
              to="/analytics"
              className="flex items-center justify-center gap-2 rounded-xl border border-glass-border px-3 py-2 text-xs font-semibold transition-colors hover:bg-accent"
            >
              <BarChart3 className="size-3.5" /> View analytics
            </Link>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
