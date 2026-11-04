import {
  House, CarFront, Wrench, Flame, Sun, Hammer,
  Thermometer, CookingPot, FileSearch, ChartNoAxesColumn,
  Calculator, TriangleAlert, ShieldCheck, FileText,
  CheckCircle2, Info, BookOpen, Search, Tag,
  Bike, Truck, Zap, Wifi, Package, Building2,
  Stethoscope, PawPrint, Scissors, ShoppingCart,
  Receipt, FileCheck, Scale, Tv, Smartphone,
  WashingMachine, Wind, Briefcase, Home,
} from "lucide-react";
import type { LucideIcon, LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Explizite Zuordnung aller 30 Kategorien ──────────────────────────────
const CATEGORY_ICONS: Record<string, LucideIcon> = {
  // Familie A – Immobilien, Wohnen & Energie
  House,
  Hammer,
  Thermometer,
  Sun,
  Wind,
  CookingPot,
  Home,
  Building2,
  Flame,
  Zap,

  // Familie B – Fahrzeuge & Mobilität
  CarFront,
  Wrench,
  Bike,
  Truck,
  Briefcase,

  // Familie C – Technik & Alltag
  Tv,
  Smartphone,
  WashingMachine,
  Package,
  ShoppingCart,
  Wifi,

  // Familie D – Verträge & Dienstleistungen
  ShieldCheck,
  Receipt,
  FileCheck,
  Scale,
  Stethoscope,
  PawPrint,
  Scissors,

  // Allgemein / Fallback
  FileSearch,
  ChartNoAxesColumn,
  Calculator,
  TriangleAlert,
  FileText,
  CheckCircle2,
  Info,
  BookOpen,
  Search,
  Tag,
};

function getIcon(name: string): LucideIcon {
  return CATEGORY_ICONS[name] ?? Tag;
}

// ── Varianten ────────────────────────────────────────────────────────────
type IconVariant = "default" | "subtle" | "solid" | "ghost";

const variantStyles: Record<IconVariant, string> = {
  default: "bg-[#F0F5ED] text-[#14532D]",
  subtle:  "bg-[#F8F7F2] text-[#647067]",
  solid:   "bg-[#14532D] text-white",
  ghost:   "bg-transparent text-[#14532D]",
};

// ── Größen ───────────────────────────────────────────────────────────────
type IconSize = "sm" | "md" | "lg";

const sizeStyles: Record<IconSize, { container: string; icon: string }> = {
  sm: { container: "h-9 w-9 rounded-xl",  icon: "h-4 w-4" },
  md: { container: "h-11 w-11 rounded-xl", icon: "h-5 w-5" },
  lg: { container: "h-14 w-14 rounded-2xl", icon: "h-7 w-7" },
};

// ── Haupt-Komponente ─────────────────────────────────────────────────────
interface CategoryIconProps {
  name: string;
  size?: IconSize;
  variant?: IconVariant;
  className?: string;
  iconClassName?: string;
}

export function CategoryIcon({
  name,
  size = "md",
  variant = "default",
  className,
  iconClassName,
}: CategoryIconProps) {
  const Icon = getIcon(name);
  const { container, icon } = sizeStyles[size];

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-center",
        container,
        variantStyles[variant],
        className
      )}
    >
      <Icon
        className={cn(icon, iconClassName)}
        strokeWidth={1.75}
        aria-hidden="true"
      />
    </div>
  );
}

// ── Roh-Icon ohne Container ──────────────────────────────────────────────
interface RawIconProps extends Omit<LucideProps, "ref"> {
  name: string;
}

export function RawIcon({ name, ...props }: RawIconProps) {
  const Icon = getIcon(name);
  return <Icon strokeWidth={1.75} aria-hidden="true" {...props} />;
}
