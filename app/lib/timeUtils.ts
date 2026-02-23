/**
 * Format a year integer to a human-readable string.
 * Negative years = BC, positive = AD.
 */
export function formatYear(year: number, lang: string = "en"): string {
  if (lang === "de") {
    return year < 0 ? `${Math.abs(year)} v. Chr.` : `${year} n. Chr.`;
  }
  return year < 0 ? `${Math.abs(year)} BC` : `${year} AD`;
}

/**
 * Get step size for the timeline slider based on granularity.
 */
export function getStepSize(granularity: "epoch" | "century" | "decade"): number {
  switch (granularity) {
    case "epoch":
      return 100;
    case "century":
      return 100;
    case "decade":
      return 10;
    default:
      return 100;
  }
}

/**
 * Snap a year value to the nearest step.
 */
export function snapToStep(year: number, step: number): number {
  return Math.round(year / step) * step;
}

/**
 * Generate tick marks for the timeline slider.
 */
export function generateTicks(
  startYear: number,
  endYear: number,
  granularity: "epoch" | "century" | "decade"
): number[] {
  const step = getStepSize(granularity);
  const ticks: number[] = [];
  let current = Math.ceil(startYear / step) * step;
  while (current <= endYear) {
    ticks.push(current);
    current += step;
  }
  return ticks;
}
