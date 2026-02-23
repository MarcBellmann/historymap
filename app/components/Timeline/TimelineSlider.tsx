import { useTranslation } from "react-i18next";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/cn";
import { formatYear, generateTicks, getStepSize } from "~/lib/timeUtils";
import type { Granularity } from "~/types/history";

interface TimelineSliderProps {
  currentYear: number;
  startYear: number;
  endYear: number;
  granularity: Granularity;
  onYearChange: (year: number) => void;
  onGranularityChange: (g: Granularity) => void;
  lang: string;
}

const GRANULARITIES: Granularity[] = ["epoch", "century", "decade"];

export function TimelineSlider({
  currentYear,
  startYear,
  endYear,
  granularity,
  onYearChange,
  onGranularityChange,
  lang,
}: TimelineSliderProps) {
  const { t } = useTranslation();
  const step = getStepSize(granularity);
  const ticks = generateTicks(startYear, endYear, "century");

  return (
    <div className="bg-stone-900/90 backdrop-blur-sm border border-stone-700 rounded-xl p-4 shadow-xl">
      {/* Year display */}
      <div className="flex items-center justify-between mb-3">
        <span className="text-stone-400 text-xs font-medium uppercase tracking-wider">
          {t("timeline.label")}
        </span>
        <span className="text-amber-300 text-lg font-bold tabular-nums">
          {formatYear(currentYear, lang)}
        </span>
      </div>

      {/* Slider */}
      <div className="relative mb-4">
        <SliderPrimitive.Root
          value={[currentYear]}
          min={startYear}
          max={endYear}
          step={step}
          onValueChange={([v]) => v !== undefined && onYearChange(v)}
          className="relative flex items-center select-none touch-none w-full h-5"
        >
          <SliderPrimitive.Track className="bg-stone-700 relative grow rounded-full h-1.5">
            <SliderPrimitive.Range className="absolute bg-amber-500 rounded-full h-full" />
          </SliderPrimitive.Track>
          <SliderPrimitive.Thumb
            className={cn(
              "block w-5 h-5 bg-amber-400 rounded-full border-2 border-amber-600 shadow-lg",
              "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 focus:ring-offset-stone-900",
              "hover:bg-amber-300 transition-colors cursor-grab active:cursor-grabbing"
            )}
          />
        </SliderPrimitive.Root>

        {/* Tick marks */}
        <div className="relative mt-1 w-full">
          <div className="relative" style={{ height: 16 }}>
            {ticks.map((tick) => {
              const pct = ((tick - startYear) / (endYear - startYear)) * 100;
              return (
                <div
                  key={tick}
                  className="absolute flex flex-col items-center"
                  style={{ left: `${pct}%`, transform: "translateX(-50%)" }}
                >
                  <div className="w-px h-1.5 bg-stone-600" />
                  <span className="text-stone-500 text-[9px] tabular-nums mt-0.5">
                    {tick === 0 ? "0" : tick < 0 ? `${Math.abs(tick)}` : `${tick}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Granularity buttons */}
      <div className="flex items-center gap-1">
        <span className="text-stone-500 text-xs mr-1">{t("timeline.granularity")}:</span>
        {GRANULARITIES.map((g) => (
          <button
            key={g}
            onClick={() => onGranularityChange(g)}
            className={cn(
              "px-2 py-0.5 rounded text-xs font-medium transition-colors",
              granularity === g
                ? "bg-amber-600 text-white"
                : "bg-stone-700 text-stone-400 hover:bg-stone-600 hover:text-stone-200"
            )}
          >
            {t(`timeline.${g}`)}
          </button>
        ))}
      </div>
    </div>
  );
}
