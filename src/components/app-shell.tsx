import { Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import {
  BarChart3,
  Heart,
  Image as ImageIcon,
  LayoutDashboard,
  Music4,
  PenLine,
  Clapperboard,
  ShoppingBag,
  Sparkles,
  Menu,
  X,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/social", label: "Social Posts", icon: PenLine },
  { to: "/product", label: "Product Promo", icon: ShoppingBag },
  { to: "/images", label: "Image Studio", icon: ImageIcon },
  { to: "/stories", label: "Story Maker", icon: Sparkles },
  { to: "/reels", label: "Reel Generator", icon: Clapperboard },
  { to: "/music", label: "Music Match", icon: Music4 },
  { to: "/favorites", label: "Favorites", icon: Heart },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
] as const;

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {nav.map((item) => (
        <Link
          key={item.to}
          to={item.to}
          onClick={onNavigate}
          activeOptions={{ exact: item.to === "/" }}
          className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          activeProps={{
            className:
              "gradient-brand text-brand-foreground shadow-glow hover:text-brand-foreground",
          }}
        >
          <item.icon className="size-4 shrink-0" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

function Brand() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <span className="gradient-brand grid size-10 place-items-center rounded-2xl text-brand-foreground">
        <Sparkles className="size-5" />
      </span>
      <span className="leading-tight">
        <span className="block font-display text-sm font-semibold">Content Studio</span>
        <span className="block text-xs text-muted-foreground">AI Creator Suite</span>
      </span>
    </Link>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="aurora -left-40 top-[-10rem] size-[34rem] bg-primary/40" />
        <div className="aurora right-[-12rem] top-40 size-[28rem] bg-brand-2/40" />
        <div className="aurora bottom-[-14rem] left-1/3 size-[30rem] bg-accent/60" />
      </div>

      <div className="mx-auto flex w-full max-w-[1600px] gap-6 p-4 lg:p-6">
        <aside className="glass sticky top-6 hidden h-[calc(100vh-3rem)] w-64 shrink-0 flex-col rounded-3xl p-4 lg:flex">
          <Brand />
          <div className="mt-8 flex-1 overflow-y-auto">
            <NavLinks />
          </div>
          <div className="gradient-soft mt-4 rounded-2xl border border-glass-border p-4">
            <p className="font-display text-sm font-semibold">Upgrade to Pro</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Unlimited generations, HD exports and priority rendering.
            </p>
            <button className="gradient-brand mt-3 w-full rounded-xl px-3 py-2 text-xs font-semibold text-brand-foreground transition-transform hover:scale-[1.02]">
              Upgrade now
            </button>
          </div>
        </aside>

        <div className="min-w-0 flex-1">
          <header className="glass sticky top-4 z-30 mb-6 flex items-center justify-between gap-3 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
                className="grid size-10 place-items-center rounded-xl border border-glass-border lg:hidden"
              >
                <Menu className="size-4" />
              </button>
              <div className="lg:hidden">
                <Brand />
              </div>
              <div className="hidden items-center gap-2 rounded-full border border-glass-border px-3 py-1.5 text-xs text-muted-foreground lg:flex">
                <Sparkles className="size-3.5 text-primary" />
                1,250 credits remaining
              </div>
            </div>
            <div className="flex items-center gap-3">
              <ThemeToggle />
              <div className="flex items-center gap-2 rounded-full border border-glass-border py-1 pl-1 pr-3">
                <span className="gradient-brand grid size-8 place-items-center rounded-full text-xs font-semibold text-brand-foreground">
                  JA
                </span>
                <span className="hidden text-xs font-medium sm:block">John Abraham</span>
              </div>
            </div>
          </header>

          <motion.main
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="pb-10"
          >
            {children}
          </motion.main>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/70 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <motion.div
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            className={cn("glass absolute inset-y-0 left-0 w-72 rounded-r-3xl p-4")}
          >
            <div className="flex items-center justify-between">
              <Brand />
              <button
                aria-label="Close menu"
                onClick={() => setOpen(false)}
                className="grid size-9 place-items-center rounded-xl border border-glass-border"
              >
                <X className="size-4" />
              </button>
            </div>
            <div className="mt-8">
              <NavLinks onNavigate={() => setOpen(false)} />
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl font-bold sm:text-3xl">
          <span className="gradient-text">{title}</span>
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {action}
    </div>
  );
}

export function GlassCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={cn("glass rounded-3xl p-5", className)}>{children}</div>;
}
