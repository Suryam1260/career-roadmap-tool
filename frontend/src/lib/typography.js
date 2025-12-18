/**
 * Typography Utility Classes
 * Fern-inspired design system for consistent typography
 * Based on DESIGN_SYSTEM.md specifications
 */

export const typography = {
  // ===== HEADINGS =====
  h1: "text-4xl md:text-5xl font-bold tracking-tight text-slate-900",
  h2: "text-2xl md:text-3xl font-semibold text-slate-900",
  h3: "text-xl md:text-2xl font-semibold text-slate-900",
  h4: "text-lg font-semibold text-slate-900",
  h5: "text-base font-semibold text-slate-900",
  h6: "text-sm font-semibold text-slate-900",

  // ===== BODY TEXT =====
  bodyLg: "text-lg text-slate-700 leading-relaxed",
  body: "text-base text-slate-600 leading-relaxed",
  bodySm: "text-sm text-slate-500 leading-relaxed",
  caption: "text-xs text-slate-400",

  // ===== SPECIAL TEXT =====
  overline: "text-xs font-bold uppercase tracking-wider text-slate-500",
  code: "px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded font-mono text-sm",
  link: "text-primary hover:text-primary/80 underline transition-colors",

  // ===== LABELS & METADATA =====
  label: "text-sm font-medium text-slate-700",
  helperText: "text-sm text-slate-500 italic",
  error: "text-sm text-red-600",
  success: "text-sm text-green-600",

  // ===== SECTION ELEMENTS (Fern-inspired) =====
  sectionOverline: "text-xs font-bold uppercase tracking-wider text-slate-500 mb-4",
  sectionTitle: "text-2xl md:text-3xl font-semibold text-slate-900 mb-2",
  sectionSubtitle: "text-base text-slate-600 max-w-3xl",

  // ===== CARD ELEMENTS =====
  cardTitle: "text-lg font-semibold text-slate-900",
  cardDescription: "text-sm text-slate-600 leading-relaxed",

  // ===== STEP/NUMBERED ELEMENTS =====
  stepTitle: "text-xl font-semibold text-slate-900",
  stepDescription: "text-base text-slate-600",

  // ===== UTILITY FUNCTION =====
  /**
   * Combine multiple typography classes
   * @param {...string} classes - Class names to combine
   * @returns {string} Combined class string
   */
  combine: (...classes) => classes.filter(Boolean).join(' '),
};

/**
 * Example usage:
 *
 * import { typography } from '@/lib/typography';
 *
 * // Simple usage
 * <h1 className={typography.h1}>Page Title</h1>
 *
 * // Combined with custom classes
 * <h2 className={typography.combine(typography.h2, "mb-8")}>
 *   Section Title
 * </h2>
 *
 * // Section pattern (Fern-style)
 * <div>
 *   <p className={typography.sectionOverline}>GET STARTED</p>
 *   <h2 className={typography.sectionTitle}>Skills Analysis</h2>
 *   <p className={typography.sectionSubtitle}>
 *     Compare your current skills with what's needed
 *   </p>
 * </div>
 */

export default typography;
