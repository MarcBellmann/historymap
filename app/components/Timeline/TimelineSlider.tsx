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

function NavRow({
  label,
  displayYear,
  onPrev,
  onNext,
  canPrev,
  canNext,
  lang,
}: {
  label: string;
  displayYear: number;
  onPrev: () => void;
  onNext: () => void;
  canPrev: boolean;
  canNext: boolean;
  lang: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-stone-400 text-xs font-medium w-24 shrink-0">{label}</span>
      <div className="flex items-center gap-2 grow justify-between">
        <button
          onClick={onPrev}
          disabled={!canPrev}
          className={cn(
            "p-1 rounded-lg transition-colors",
            canPrev
              ? "text-stone-300 hover:bg-stone-700 hover:text-stone-100"
              : "text-stone-600 cursor-not-allowed"
          )}
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-amber-300 text-sm font-bold tabular-nums min-w-28 text-center">
          {formatYear(displayYear, lang)}
        </span>
        <button
          onClick={onNext}
          disabled={!canNext}
          className={cn(
            "p-1 rounded-lg transition-colors",
            canNext
              ? "text-stone-300 hover:bg-stone-700 hover:text-stone-100"
              : "text-stone-600 cursor-not-allowed"
          )}
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
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
  const decadeStart = Math.floor(currentYear / 10) * 10;

  return (
    <div className="bg-stone-900/90 backdrop-blur-sm border border-stone-700 rounded-xl px-5 py-4 shadow-xl space-y-2">
      {/* Epoch: ±100 years */}
      <NavRow
        label={t("timeline.epoch")}
        displayYear={centuryStart}
        onPrev={() => onYearChange(Math.max(centuryStart - 100, startYear))}
        onNext={() => onYearChange(Math.min(centuryStart + 100, endYear))}
        canPrev={centuryStart > startYear}
        canNext={centuryStart < endYear - 100}
        lang={lang}
      />

      <div className="w-full h-px bg-stone-800" />

      {/* Century: ±10 years */}
      <NavRow
        label={t("timeline.century")}
        displayYear={decadeStart}
        onPrev={() => onYearChange(Math.max(decadeStart - 10, startYear))}
        onNext={() => onYearChange(Math.min(decadeStart + 10, endYear))}
        canPrev={decadeStart > startYear}
        canNext={decadeStart < endYear - 10}
        lang={lang}
      />

      <div className="w-full h-px bg-stone-800" />

      {/* Decade: ±1 year */}
      <NavRow
        label={t("timeline.decade")}
        displayYear={currentYear}
        onPrev={() => onYearChange(Math.max(currentYear - 1, startYear))}
        onNext={() => onYearChange(Math.min(currentYear + 1, endYear))}
        canPrev={currentYear > startYear}
        canNext={currentYear < endYear}
        lang={lang}
      />
    </div>
  );
}
