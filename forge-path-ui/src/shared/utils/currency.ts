/**
 * currency.ts
 *
 * Centralized currency formatting utility for FORGE-PATH.
 * Supports INR (default) with Indian numbering system, plus USD, EUR, GBP, JPY, AED, SGD.
 * The active workspace currency is read from useWorkspaceStore.
 *
 * Usage:
 *   formatCurrency(342000)            → "₹3,42,000"
 *   formatCurrency(342000, "USD")     → "₹3,42,000"
 *   formatCompact(1250000)            → "₹12.5L"
 *   formatCompact(10000000)           → "₹1Cr"
 */

export type SupportedCurrency = "INR" | "USD" | "EUR" | "GBP" | "JPY" | "AED" | "SGD";

/** Symbol for each supported currency */
export const CURRENCY_SYMBOLS: Record<SupportedCurrency, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  JPY: "¥",
  AED: "د.إ",
  SGD: "S$",
};

/** Locale to use per currency for correct number grouping */
const CURRENCY_LOCALE: Record<SupportedCurrency, string> = {
  INR: "en-IN",
  USD: "en-IN",
  EUR: "de-DE",
  GBP: "en-GB",
  JPY: "ja-JP",
  AED: "en-AE",
  SGD: "en-SG",
};

/**
 * Format a numeric amount as a full currency string.
 *
 * INR uses the Indian numbering system (en-IN locale):
 *   formatCurrency(1250000) → "₹12,50,000"
 *   formatCurrency(47500)   → "₹47,500"
 */
export function formatCurrency(
  amount: number,
  currency: SupportedCurrency | string = "INR"
): string {
  const cur = currency as SupportedCurrency;
  const locale = CURRENCY_LOCALE[cur] ?? "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a numeric amount with up to 2 decimal places.
 * Useful for showing precise invoice values.
 */
export function formatCurrencyPrecise(
  amount: number,
  currency: SupportedCurrency | string = "INR"
): string {
  const cur = currency as SupportedCurrency;
  const locale = CURRENCY_LOCALE[cur] ?? "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Compact formatter — uses Indian scale labels for INR, standard notation for others.
 *
 * INR:
 *   1,000        → "₹1K"
 *   1,00,000     → "₹1L"
 *   12,50,000    → "₹12.5L"
 *   1,00,00,000  → "₹1Cr"
 *   12,50,00,000 → "₹12.5Cr"
 *
 * USD/EUR/etc.: standard Intl compact (₹1M, $1B, etc.)
 */
export function formatCompact(
  amount: number,
  currency: SupportedCurrency | string = "INR"
): string {
  const cur = currency as SupportedCurrency;
  const symbol = CURRENCY_SYMBOLS[cur] ?? cur;

  if (cur === "INR") {
    const abs = Math.abs(amount);
    const sign = amount < 0 ? "-" : "";

    if (abs >= 1_00_00_000) {
      // Crore (10 million)
      const cr = abs / 1_00_00_000;
      return `${sign}${symbol}${cr % 1 === 0 ? cr.toFixed(0) : cr.toFixed(1)}Cr`;
    }
    if (abs >= 1_00_000) {
      // Lakh (100 thousand)
      const l = abs / 1_00_000;
      return `${sign}${symbol}${l % 1 === 0 ? l.toFixed(0) : l.toFixed(1)}L`;
    }
    if (abs >= 1_000) {
      const k = abs / 1_000;
      return `${sign}${symbol}${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}K`;
    }
    return `${sign}${symbol}${abs}`;
  }

  // Standard compact for non-INR currencies
  const locale = CURRENCY_LOCALE[cur] ?? "en-IN";
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: cur,
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/**
 * Get just the currency symbol for a given currency code.
 */
export function getCurrencySymbol(currency: SupportedCurrency | string = "INR"): string {
  return CURRENCY_SYMBOLS[currency as SupportedCurrency] ?? currency;
}
