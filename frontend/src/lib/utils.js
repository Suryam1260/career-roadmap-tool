import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Utility function to merge Tailwind classes
 * Handles conditional classes and deduplicates conflicting utilities
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/**
 * Common layout patterns from DESIGN_SYSTEM.md
 */
export const layouts = {
  // Page container (max-width: 1200px, centered)
  container: "max-w-[1200px] mx-auto px-5",

  // Content area padding (from DESIGN_SYSTEM.md)
  contentArea: "pt-12 pb-24 pl-12",
  contentAreaMobile: "md:pt-12 md:pb-24 md:pl-12 pt-6 pb-12 px-5",

  // Section spacing (80px desktop, 48px mobile)
  sectionSpacing: "mb-20 md:mb-20 last:mb-0",

  // Sidebar
  sidebar: "w-80 pt-12 pr-8",

  // Step pattern
  stepContainer: "flex items-start gap-6 mb-12",
  stepNumber: "w-7 h-7 bg-slate-100 border border-slate-200 flex items-center justify-center text-sm font-bold flex-shrink-0",
  stepCard: "ml-[60px] md:ml-[60px] ml-0",
};

/**
 * Common card patterns (Fern-inspired)
 */
export const cards = {
  base: "bg-white border border-slate-200 shadow-sm rounded-none",
  hover: "transition-all duration-200 hover:shadow-md hover:-translate-y-0.5",
  clickable: "cursor-pointer transition-all duration-200 hover:border-primary hover:shadow-md",
};

/**
 * Button variant classes (matching your brand)
 */
export const buttons = {
  primary: "bg-primary text-white hover:bg-primary/90 rounded-none font-semibold px-6 py-3 transition-all duration-200 hover:-translate-y-0.5",
  secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-none font-semibold px-6 py-3 transition-all duration-200",
  outline: "border-2 border-primary text-primary hover:bg-primary/5 rounded-none font-semibold px-6 py-3 transition-all duration-200",
  ghost: "text-slate-700 hover:bg-slate-100 rounded-none font-medium px-4 py-2 transition-all duration-200",
};

/**
 * Badge/pill variants
 */
export const badges = {
  success: "bg-green-100 text-green-800 px-3 py-1 text-sm font-medium rounded-none",
  warning: "bg-yellow-100 text-yellow-800 px-3 py-1 text-sm font-medium rounded-none",
  error: "bg-red-100 text-red-800 px-3 py-1 text-sm font-medium rounded-none",
  info: "bg-blue-100 text-blue-800 px-3 py-1 text-sm font-medium rounded-none",
  primary: "bg-primary/10 text-primary px-3 py-1 text-sm font-medium rounded-none",
  pill: "bg-slate-100 text-slate-700 px-3 py-1 text-sm font-medium rounded-pill", // Only use for pills
};

/**
 * Priority-based colors (for skills, tasks, etc.)
 */
export const priority = {
  high: {
    bg: "bg-red-50",
    border: "border-red-200",
    text: "text-red-800",
  },
  medium: {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    text: "text-yellow-800",
  },
  low: {
    bg: "bg-slate-50",
    border: "border-slate-200",
    text: "text-slate-600",
  },
};
