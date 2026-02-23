import { useTranslation } from "react-i18next";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "~/lib/cn";
import { formatYear } from "~/lib/timeUtils";

interface TimelineSliderProps {
  currentYear: number;
  startYear: number;
  endYear: number;
  onYearChange: (year: number) => void;
  lang: string;
}

function stepBtn(
  label: string,
  onClick: () => void,
  disabled: boolean
) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "px-2 py-1 rounded text-xs font-mono tabular-nums transition-colors",
        disabled
          ? "text-stone-600 cursor-not-allowed"
          : "text-stone-300 bg-stone-800 hover:bg-stone-700 hover:text-stone-100"
      )}
    >
      {label}
    </button>
  );
}

export function TimelineSlider({
  currentYear,
  startYear,
  endYear,
  onYearChange,
  lang,
}: TimelineSliderProps) {
  const { t } = useTranslation();

  const centuryStart = Math.floor(currentYear / 100) * 100;

  const clamp = (v: number) => Math.max(startYear, Math.min(endYear, v));

  return (
    <div className="bg-stone-900/90 backdrop-blur-sm border border-stone-700 rounded-xl px-5 py-4 shadow-xl space-y-3">

      {/* Epoch row: ±100 */}
      <div className="flex items-center gap-3">
        <span className="text-stone-400 text-xs font-medium w-20 shrink-0">
          {t("timeline.epoch")}
        </span>
        <div className="flex items-center gap-2 grow justify-between">
          <button
            onClick={() => onYearChange(clamp(centuryStart - 100))}
            disabled={centuryStart <= startYear}
            className={cn(
              "p-1 rounded-lg transition-colors",
              centuryStart > startYear
                ? "text-stone-300 hover:bg-stone-700 hover:text-stone-100"
                : "text-stone-600 cursor-not-allowed"
            )}
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-amber-300 text-sm font-bold tabular-nums min-w-28 text-center">
            {formatYear(centuryStart, lang)}
          </span>
          <button
            onClick={() => onYearChange(clamp(centuryStart + 100))}
            disabled={centuryStart >= endYear}
            className={cn(
              "p-1 rounded-lg transition-colors",
              centuryStart < endYear
                ? "text-stone-300 hover:bg-stone-700 hover:text-stone-100"
                : "text-stone-600 cursor-not-allowed"
            )}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="w-full h-px bg-stone-800" />

      {/* Year row: ±1, ±10, ±100 */}
      <div className="flex items-center gap-3">
        <span className="text-stone-400 text-xs font-medium w-20 shrink-0">
          {t("timeline.year")}
        </span>
        <div className="flex items-center gap-1.5 grow justify-between">
          <div className="flex gap-1">
            {stepBtn("−100", () => onYearChange(clamp(currentYear - 100)), currentYear - 100 < startYear)}
            {stepBtn("−10",  () => onYearChange(clamp(currentYear - 10)),  currentYear - 10  < startYear)}
            {stepBtn("−1",   () => onYearChange(clamp(currentYear - 1)),   currentYear - 1   < startYear)}
          </div>
          <span className="text-amber-300 text-sm font-bold tabular-nums min-w-28 text-center">
            {formatYear(currentYear, lang)}
          </span>
          <div className="flex gap-1">
            {stepBtn("+1",   () => onYearChange(clamp(currentYear + 1)),   currentYear + 1   > endYear)}
            {stepBtn("+10",  () => onYearChange(clamp(currentYear + 10)),  currentYear + 10  > endYear)}
            {stepBtn("+100", () => onYearChange(clamp(currentYear + 100)), currentYear + 100 > endYear)}
          </div>
        </div>
      </div>

    </div>
  );
}
