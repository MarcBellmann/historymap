import { useTranslation } from "react-i18next";
import { cn } from "~/lib/cn";
import type { Perspective } from "~/types/history";
import { getLabel } from "~/lib/dataUtils";

interface PerspectiveSelectorProps {
  perspectives: Perspective[];
  activePerspectiveId: string;
  onPerspectiveChange: (id: string) => void;
  lang: string;
}

const PERSPECTIVE_COLORS: Record<string, string> = {
  roman: "#CC3333",
  persian: "#3366CC",
  greek: "#3399AA",
  chinese: "#CC9900",
  global: "#666666",
};

export function PerspectiveSelector({
  perspectives,
  activePerspectiveId,
  onPerspectiveChange,
  lang,
}: PerspectiveSelectorProps) {
  const { t } = useTranslation();

  return (
    <div className="bg-stone-900/90 backdrop-blur-sm border border-stone-700 rounded-xl p-3 shadow-xl">
      <div className="text-stone-400 text-xs font-medium uppercase tracking-wider mb-2">
        {t("perspective.label")}
      </div>
      <div className="flex flex-col gap-1">
        {perspectives.map((p) => {
          const isActive = p.id === activePerspectiveId;
          const color = PERSPECTIVE_COLORS[p.id] ?? "#666";
          const label = getLabel(p.labels, lang);

          return (
            <button
              key={p.id}
              onClick={() => onPerspectiveChange(p.id)}
              className={cn(
                "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-stone-700 text-stone-100"
                  : "text-stone-400 hover:bg-stone-800 hover:text-stone-200"
              )}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0 transition-all"
                style={{
                  background: color,
                  opacity: isActive ? 1 : 0.5,
                  boxShadow: isActive ? `0 0 6px ${color}` : "none",
                }}
              />
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
