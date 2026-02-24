import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "~/lib/cn";
import { formatYear } from "~/lib/timeUtils";
import { getLabel, getDescription } from "~/lib/dataUtils";
import type { SelectedItem } from "~/types/history";

interface DetailPanelProps {
  item: SelectedItem;
  onClose: () => void;
  lang: string;
}

const EVENT_TYPE_ICONS: Record<string, string> = {
  battle: "⚔️",
  foundation: "🏛️",
  political: "⚖️",
  cultural: "🎭",
  natural: "🌊",
};

export function DetailPanel({ item, onClose, lang }: DetailPanelProps) {
  const { t } = useTranslation();

  if (!item) return null;

  const renderContent = () => {
    switch (item.type) {
      case "city": {
        const { data } = item;
        const label = getLabel(data.labels, lang);
        const desc = getDescription(data.description, lang);
        return (
          <>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="text-xs text-amber-400 font-medium uppercase tracking-wider mb-1">
                  {t("layers.cities")}
                </div>
                <h2 className="text-stone-100 text-xl font-bold">{label}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-200 transition-colors shrink-0 mt-1"
                aria-label={t("detail.close")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex gap-3">
                <span className="text-stone-500">{t("detail.founded")}:</span>
                <span className="text-stone-300">{formatYear(data.startYear, lang)}</span>
              </div>
              {data.endYear !== null && (
                <div className="flex gap-3">
                  <span className="text-stone-500">{t("detail.destroyed")}:</span>
                  <span className="text-stone-300">{formatYear(data.endYear, lang)}</span>
                </div>
              )}
              {data.endYear === null && (
                <div className="flex gap-3">
                  <span className="text-stone-500">{t("detail.destroyed")}:</span>
                  <span className="text-stone-300">{t("detail.present")}</span>
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                <span className="text-stone-500">{t("detail.culturalSphere")}:</span>
                <div className="flex flex-wrap gap-1">
                  {data.culturalSphere.map((sphere) => (
                    <span
                      key={sphere}
                      className="bg-stone-700 text-stone-300 px-1.5 py-0.5 rounded text-xs"
                    >
                      {sphere}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
          </>
        );
      }

      case "region": {
        const { data } = item;
        const label = getLabel(data.labels, lang);
        const desc = getDescription(data.description, lang);
        return (
          <>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div
                  className="text-xs font-medium uppercase tracking-wider mb-1"
                  style={{ color: data.color }}
                >
                  {t("layers.regions")}
                </div>
                <h2 className="text-stone-100 text-xl font-bold">{label}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-200 transition-colors shrink-0 mt-1"
                aria-label={t("detail.close")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex gap-3">
                <span className="text-stone-500">{t("detail.founded")}:</span>
                <span className="text-stone-300">{formatYear(data.startYear, lang)}</span>
              </div>
              <div className="flex gap-3">
                <span className="text-stone-500">{t("detail.destroyed")}:</span>
                <span className="text-stone-300">
                  {data.endYear !== null ? formatYear(data.endYear, lang) : t("detail.present")}
                </span>
              </div>
              {(data.peakStartYear !== undefined || data.peakEndYear !== undefined) &&
                (data.peakStartYear !== data.startYear || data.peakEndYear !== data.endYear) && (
                <div className="flex gap-3">
                  <span className="text-stone-500">{t("detail.peakPeriod")}:</span>
                  <span className="text-stone-300">
                    {formatYear(data.peakStartYear ?? data.startYear, lang)}
                    {" – "}
                    {data.peakEndYear !== null && data.peakEndYear !== undefined
                      ? formatYear(data.peakEndYear, lang)
                      : t("detail.present")}
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <span className="text-stone-500">{t("detail.culturalSphere")}:</span>
                <span className="bg-stone-700 text-stone-300 px-1.5 py-0.5 rounded text-xs">
                  {data.culturalSphere}
                </span>
              </div>
            </div>

            <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
          </>
        );
      }

      case "event": {
        const { data } = item;
        const label = getLabel(data.labels, lang);
        const desc = getDescription(data.description, lang);
        const icon = EVENT_TYPE_ICONS[data.type] ?? "📌";
        return (
          <>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="text-xs text-amber-400 font-medium uppercase tracking-wider mb-1">
                  {icon} {t(`eventTypes.${data.type}`)}
                </div>
                <h2 className="text-stone-100 text-xl font-bold">{label}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-stone-400 hover:text-stone-200 transition-colors shrink-0 mt-1"
                aria-label={t("detail.close")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex gap-3">
                <span className="text-stone-500">{t("detail.year")}:</span>
                <span className="text-stone-300">{formatYear(data.year, lang)}</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="text-stone-500">{t("detail.culturalSphere")}:</span>
                <div className="flex flex-wrap gap-1">
                  {data.culturalSphere.map((sphere) => (
                    <span
                      key={sphere}
                      className="bg-stone-700 text-stone-300 px-1.5 py-0.5 rounded text-xs"
                    >
                      {sphere}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
          </>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      className={cn(
        "absolute bottom-4 left-4 z-20 w-80 max-w-[calc(100vw-2rem)]",
        "bg-stone-900/95 backdrop-blur-sm border border-stone-700 rounded-xl p-4 shadow-2xl",
        "transition-all duration-200"
      )}
    >
      {renderContent()}
    </div>
  );
}
