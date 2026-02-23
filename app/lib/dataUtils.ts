import type { City, HistoricalEvent, RegionProperties } from "~/types/history";

/**
 * Filter items that exist at the given year.
 */
export function filterByYear<T extends { startYear: number; endYear: number | null }>(
  items: T[],
  year: number
): T[] {
  return items.filter(
    (item) => item.startYear <= year && (item.endYear === null || item.endYear >= year)
  );
}

/**
 * Filter events that occur within a window around the given year.
 */
export function filterEventsByYear(events: HistoricalEvent[], year: number, windowSize: number = 50): HistoricalEvent[] {
  return events.filter((e) => Math.abs(e.year - year) <= windowSize);
}

/**
 * Get highlight opacity for a feature based on perspective.
 */
export function getHighlightOpacity(
  spheres: string[],
  highlightedSpheres: string[],
  perspectiveId: string
): number {
  if (perspectiveId === "global" || highlightedSpheres.length === 0) return 1.0;
  const isHighlighted = spheres.some((s) => highlightedSpheres.includes(s));
  return isHighlighted ? 1.0 : 0.3;
}

/**
 * Get localized label from a labels record, falling back to English.
 */
export function getLabel(labels: Record<string, string>, lang: string): string {
  return labels[lang] ?? labels["en"] ?? Object.values(labels)[0] ?? "";
}

/**
 * Get localized description from a descriptions record, falling back to English.
 */
export function getDescription(descriptions: Record<string, string>, lang: string): string {
  return descriptions[lang] ?? descriptions["en"] ?? Object.values(descriptions)[0] ?? "";
}
