import { useTranslation } from "react-i18next";
import { cn } from "~/lib/cn";
import { formatYear } from "~/lib/timeUtils";

interface TimelineSliderProps {
  currentYear: number;
  startYear: number;
  endYear: number;
  onYearChange: (year: number) => void;
  lang: string;
}

function shortYear(year: number, lang: string): string {
  if (year === 0) return "0";
  if (lang === "de") return year < 0 ? `${Math.abs(year)}v` : `${year}n`;
  return year < 0 ? `${Math.abs(year)}BC` : `${year}AD`;
}

function PaginationRow({
  label,
  values,
  activeValue,
  onSelect,
  lang,
}: {
  label: string;
  values: number[];
  activeValue: number;
  onSelect: (v: number) => void;
  lang: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span className="text-stone-400 text-xs font-medium w-24 shrink-0">{label}</span>
      <div className="flex gap-1 flex-wrap">
        {values.map((v) => (
          <button
            key={v}
            onClick={() => onSelect(v)}
            className={cn(
              "px-2 py-1 rounded text-xs font-mono tabular-nums transition-colors",
              v === activeValue
                ? "bg-amber-500 text-stone-950 font-bold"
                : v < 0
                ? "bg-stone-800 text-stone-400 hover:bg-stone-700 hover:text-stone-200"
                : "bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-stone-100"
            )}
          >
            {shortYear(v, lang)}
          </button>
        ))}
      </div>
    </div>
  );
}

function range(min: number, max: number, step: number): number[] {
  const result: number[] = [];
  for (let v = min; v <= max; v += step) result.push(v);
  return result;
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

  const epochValues = range(startYear, endYear, 100);
  const centuryValues = range(centuryStart, Math.min(centuryStart + 100, endYear), 10);
  const decadeValues = range(decadeStart, Math.min(decadeStart + 10, endYear), 1);

  return (
    <div className="bg-stone-900/90 backdrop-blur-sm border border-stone-700 rounded-xl px-5 py-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-stone-400 text-xs font-medium uppercase tracking-wider">
          {t("timeline.label")}
        </span>
        <span className="text-amber-300 text-xl font-bold tabular-nums">
          {formatYear(currentYear, lang)}
        </span>
      </div>

      <div className="w-full h-px bg-stone-700" />

      <PaginationRow
        label={t("timeline.epoch")}
        values={epochValues}
        activeValue={centuryStart}
        onSelect={onYearChange}
        lang={lang}
      />
      <PaginationRow
        label={t("timeline.century")}
        values={centuryValues}
        activeValue={decadeStart}
        onSelect={onYearChange}
        lang={lang}
      />
      <PaginationRow
        label={t("timeline.decade")}
        values={decadeValues}
        activeValue={currentYear}
        onSelect={onYearChange}
        lang={lang}
      />
    </div>
  );
}
