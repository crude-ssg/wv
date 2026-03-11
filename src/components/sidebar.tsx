import { BookOpen, Compass, LayoutDashboard, Settings2, X } from "lucide-react";
import { GlowDot } from "@/components/primary/glow-dot";
import { NavItem } from "@/components/primary/nav-item";
import { Pill } from "@/components/primary/pill";
import { CreditsCard } from "@/components/credits-card";
import { cn, inverseLerp } from "@/lib/utils";
import { useAuth } from "@/lib/use-auth";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export function Sidebar({ isOpen, onClose, className }: SidebarProps) {

  const { user } = useAuth()

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 w-64 shrink-0 flex flex-col p-6 border-r bg-bg-alt border-border/12 z-50 transition-transform duration-300 lg:static lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        <div className="mb-10 px-1 flex items-center justify-between">
          <Pill variant="default"><GlowDot />BabeGen</Pill>
          <button
            onClick={onClose}
            className="lg:hidden p-2 text-muted hover:text-brand transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <NavItem icon={<Compass size={18} />} label="Explore" />
          <NavItem icon={<BookOpen size={18} />} label="My Library" />
          <NavItem icon={<Settings2 size={18} />} label="Settings" />
        </nav>

        <Pill variant="accent"><GlowDot />@{user.username}</Pill>
        <CreditsCard used={inverseLerp(0, 10000, user.tokens) * 100} total={user.tokens} />
      </aside>
    </>
  );
}