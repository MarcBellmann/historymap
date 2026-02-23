import { useTranslation } from "react-i18next";
import * as SliderPrimitive from "@radix-ui/react-slider";
import { cn } from "~/lib/cn";
import { formatYear } from "~/lib/timeUtils";

interface TimelineSliderProps {
  currentYear: number;
  startYear: number;
  endYear: number;
  onYearChange: (year: number) => void;
  lang: string;
}

function Slider({
  value,
  min,
  max,
  step,
  onChange,
}: {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  // Radix Slider requires min < max
  if (min >= max) return (
    <div className="relative flex items-center w-full h-5">
      <div className="bg-stone-700 relative grow rounded-full h-1.5" />
    </div>
  );

  return (
    <SliderPrimitive.Root
      value={[Math.max(min, Math.min(max, value))]}
      min={min}
      max={max}
      step={step}
      onValueChange={([v]) => v !== undefined && onChange(v)}
      className="relative flex items-center select-none touch-none w-full h-5"
    >
      <SliderPrimitive.Track className="bg-stone-700 relative grow rounded-full h-1.5">
        <SliderPrimitive.Range className="absolute bg-amber-500 rounded-full h-full" />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb
        className={cn(
          "block w-4 h-4 bg-amber-400 rounded-full border-2 border-amber-600 shadow-lg",
          "focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-1 focus:ring-offset-stone-900",
          "hover:bg-amber-300 transition-colors cursor-grab active:cursor-grabbing"
        )}
      />
    </SliderPrimitive.Root>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onChange,
  lang,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  lang: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-stone-400 text-xs w-24 shrink-0 font-medium">{label}</span>
      <span className="text-stone-500 text-[10px] tabular-nums w-16 text-right shrink-0">
        {formatYear(min, lang)}
      </span>
      <div className="grow">
        <Slider value={value} min={min} max={max} step={step} onChange={onChange} />
      </div>
      <span className="text-stone-500 text-[10px] tabular-nums w-16 shrink-0">
        {formatYear(max, lang)}
      </span>
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

  // Derived positions in the hierarchy
  const centuryStart = Math.floor(currentYear / 100) * 100;
  const centuryEnd = centuryStart + 100;
  const decadeStart = Math.floor(currentYear / 10) * 10;
  const decadeEnd = decadeStart + 10;

  // Clamp ranges to epoch bounds
  const epochMin = startYear;
  const epochMax = endYear;
  const centuryMin = Math.max(centuryStart, startYear);
  const centuryMax = Math.min(centuryEnd, endYear);
  const decadeMin = Math.max(decadeStart, startYear);
  const decadeMax = Math.min(decadeEnd, endYear);

  // Each slider snaps currentYear to its granularity on change
  const handleEpochChange = (v: number) => onYearChange(v);
  const handleCenturyChange = (v: number) => onYearChange(v);
  const handleDecadeChange = (v: number) => onYearChange(v);

  return (
    <div className="bg-stone-900/90 backdrop-blur-sm border border-stone-700 rounded-xl px-5 py-4 shadow-xl space-y-3">
      {/* Current year display */}
      <div className="flex items-center justify-between">
        <span className="text-stone-400 text-xs font-medium uppercase tracking-wider">
          {t("timeline.label")}
        </span>
        <span className="text-amber-300 text-xl font-bold tabular-nums">
          {formatYear(currentYear, lang)}
        </span>
      </div>

      <div className="w-full h-px bg-stone-700" />

      {/* Epoch slider: step 100, full epoch range */}
      <SliderRow
        label={t("timeline.epoch")}
        value={centuryStart}
        min={epochMin}
        max={epochMax}
        step={100}
        onChange={handleEpochChange}
        lang={lang}
      />

      {/* Century slider: step 10, within current century */}
      <SliderRow
        label={t("timeline.century")}
        value={decadeStart}
        min={centuryMin}
        max={centuryMax}
        step={10}
        onChange={handleCenturyChange}
        lang={lang}
      />

      {/* Decade slider: step 1, within current decade */}
      <SliderRow
        label={t("timeline.decade")}
        value={currentYear}
        min={decadeMin}
        max={decadeMax}
        step={1}
        onChange={handleDecadeChange}
        lang={lang}
      />
    </div>
  );
}
