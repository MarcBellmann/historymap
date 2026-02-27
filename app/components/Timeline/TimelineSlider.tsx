import { useTranslation } from "react-i18next";
import { ChevronsLeft, ChevronLeft, ChevronRight, ChevronsRight } from "lucide-react";

import { cn } from "~/lib/cn";
import { formatYear } from "~/lib/timeUtils";
import type { Epoch } from "~/types/history";

interface TimelineSliderProps {
  currentYear: number;
  epoch: Epoch;
  onYearChange: (year: number) => void;
  lang: string;
}

function NavBtn({
  onClick,
  disabled,
  children,
}: {
  onClick: () => void;
  disabled: boolean;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "p-1.5 rounded-lg transition-colors",
        disabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-500 hover:bg-gray-100 hover:text-gray-900"
      )}
    >
      {children}
    </button>
  );
}

export function TimelineSlider({
  currentYear,
  epoch,
  onYearChange,
  lang,
}: TimelineSliderProps) {
  const { i18n } = useTranslation();
  const epochLabel = epoch.labels[i18n.language.startsWith("de") ? "de" : "en"] ?? epoch.labels["en"];

  const clamp = (v: number) => Math.max(epoch.startYear, Math.min(epoch.endYear, v));

  const atStart = currentYear <= epoch.startYear;
  const atEnd = currentYear >= epoch.endYear;

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 shadow-lg">
      <div className="flex items-center gap-2">

        {/* Left buttons */}
        <div className="flex items-center gap-0.5">
          <NavBtn onClick={() => onYearChange(clamp(currentYear - 100))} disabled={atStart}>
            <ChevronsLeft size={18} />
          </NavBtn>
          <NavBtn onClick={() => onYearChange(clamp(currentYear - 10))} disabled={atStart}>
            <ChevronLeft size={18} />
          </NavBtn>
        </div>

        {/* Centered year + epoch */}
        <div className="flex flex-col items-center flex-1">
          <span className="text-gray-900 text-lg font-bold tabular-nums leading-tight">
            {formatYear(currentYear, lang)}
          </span>
          <span className="text-gray-400 text-xs leading-tight">{epochLabel}</span>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-0.5">
          <NavBtn onClick={() => onYearChange(clamp(currentYear + 10))} disabled={atEnd}>
            <ChevronRight size={18} />
          </NavBtn>
          <NavBtn onClick={() => onYearChange(clamp(currentYear + 100))} disabled={atEnd}>
            <ChevronsRight size={18} />
          </NavBtn>
        </div>

      </div>
    </div>
  );
}
