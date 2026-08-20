import { createFileRoute } from "@tanstack/react-router";
import { Download, Heart, PenLine, TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { GlassCard, PageHeader } from "@/components/app-shell";
import { analyticsSeries, engagementByPlatform } from "@/lib/mock";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics Dashboard — Content Studio" },
      {
        name: "description",
        content:
          "Track generated posts, downloads, favorites and predicted engagement across every platform.",
      },
      { property: "og:title", content: "Content Studio Analytics" },
      {
        property: "og:description",
        content: "Posts, downloads, favorites and engagement predictions in one dashboard.",
      },
    ],
  }),
  component: AnalyticsPage,
});

const kpis = [
  { label: "Generated posts", value: "496", icon: PenLine },
  { label: "Downloads", value: "356", icon: Download },
  { label: "Favorites", value: "224", icon: Heart },
  { label: "Predicted engagement", value: "7.8%", icon: TrendingUp },
];

function AnalyticsPage() {
  return (
    <div>
      <PageHeader
        title="Analytics"
        subtitle="How much you create, how much you export, and how it is likely to perform."
      />

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {kpis.map((k) => (
          <GlassCard key={k.label}>
            <span className="gradient-brand grid size-10 place-items-center rounded-xl text-brand-foreground">
              <k.icon className="size-4" />
            </span>
            <p className="mt-4 font-display text-2xl font-bold">{k.value}</p>
            <p className="text-xs text-muted-foreground">{k.label}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <GlassCard>
          <p className="mb-4 font-display font-semibold">Creation trend</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analyticsSeries}>
                <defs>
                  <linearGradient id="gPosts" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-1)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="var(--color-chart-1)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gDown" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-chart-2)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="var(--color-chart-2)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="posts"
                  stroke="var(--color-chart-1)"
                  fill="url(#gPosts)"
                  strokeWidth={2}
                />
                <Area
                  type="monotone"
                  dataKey="downloads"
                  stroke="var(--color-chart-2)"
                  fill="url(#gDown)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>

        <GlassCard>
          <p className="mb-4 font-display font-semibold">Predicted engagement</p>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={engagementByPlatform}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="platform" stroke="var(--color-muted-foreground)" fontSize={12} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={12} />
                <Tooltip
                  cursor={{ fill: "var(--color-accent)" }}
                  contentStyle={{
                    background: "var(--color-popover)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 12,
                    color: "var(--color-popover-foreground)",
                  }}
                />
                <Bar dataKey="score" radius={[10, 10, 0, 0]} fill="var(--color-chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </GlassCard>
      </div>

      <GlassCard className="mt-6">
        <p className="mb-4 font-display font-semibold">Favorites growth</p>
        <div className="space-y-3">
          {analyticsSeries.map((row) => (
            <div key={row.month} className="flex items-center gap-4">
              <span className="w-10 text-xs text-muted-foreground">{row.month}</span>
              <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                <div
                  className="gradient-brand h-full rounded-full"
                  style={{ width: `${(row.favorites / 70) * 100}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs font-semibold">{row.favorites}</span>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
