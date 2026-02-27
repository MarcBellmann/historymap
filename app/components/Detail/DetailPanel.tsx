import { useTranslation } from "react-i18next";
import { X, Swords, Landmark, Scale, Palette, Waves } from "lucide-react";
import { cn } from "~/lib/cn";
import { formatYear } from "~/lib/timeUtils";
import { getLabel, getDescription } from "~/lib/dataUtils";
import type { SelectedItem } from "~/types/history";

interface DetailPanelProps {
  item: SelectedItem;
  onClose: () => void;
  lang: string;
}

const EVENT_TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  battle: Swords,
  foundation: Landmark,
  political: Scale,
  cultural: Palette,
  natural: Waves,
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
                <div className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  {t("layers.cities")}
                </div>
                <h2 className="text-gray-900 text-xl font-bold">{label}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-1"
                aria-label={t("detail.close")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex gap-3">
                <span className="text-gray-500">{t("detail.founded")}:</span>
                <span className="text-gray-700">{formatYear(data.startYear, lang)}</span>
              </div>
              {data.endYear !== null ? (
                <div className="flex gap-3">
                  <span className="text-gray-500">{t("detail.ended")}:</span>
                  <span className="text-gray-700">{formatYear(data.endYear, lang)}</span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <span className="text-gray-500 italic">{t("detail.stillExists")}</span>
                </div>
              )}
              <div className="flex gap-3 flex-wrap">
                <span className="text-gray-500">{t("detail.culturalSphere")}:</span>
                <div className="flex flex-wrap gap-1">
                  {data.culturalSphere.map((sphere) => (
                    <span
                      key={sphere}
                      className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs"
                    >
                      {sphere}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
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
                <h2 className="text-gray-900 text-xl font-bold">{label}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-1"
                aria-label={t("detail.close")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex gap-3">
                <span className="text-gray-500">{t("detail.founded")}:</span>
                <span className="text-gray-700">{formatYear(data.startYear, lang)}</span>
              </div>
              {data.endYear !== null ? (
                <div className="flex gap-3">
                  <span className="text-gray-500">{t("detail.ended")}:</span>
                  <span className="text-gray-700">{formatYear(data.endYear, lang)}</span>
                </div>
              ) : (
                <div className="flex gap-3">
                  <span className="text-gray-500 italic">{t("detail.stillExists")}</span>
                </div>
              )}
              {(data.peakStartYear !== undefined || data.peakEndYear !== undefined) &&
                (data.peakStartYear !== data.startYear || data.peakEndYear !== data.endYear) && (
                <div className="flex gap-3">
                  <span className="text-gray-500">{t("detail.peakPeriod")}:</span>
                  <span className="text-gray-700">
                    {formatYear(data.peakStartYear ?? data.startYear, lang)}
                    {" – "}
                    {data.peakEndYear !== null && data.peakEndYear !== undefined
                      ? formatYear(data.peakEndYear, lang)
                      : t("detail.stillExists")}
                  </span>
                </div>
              )}
              <div className="flex gap-3">
                <span className="text-gray-500">{t("detail.culturalSphere")}:</span>
                <span className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs">
                  {data.culturalSphere}
                </span>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
          </>
        );
      }

      case "event": {
        const { data } = item;
        const label = getLabel(data.labels, lang);
        const desc = getDescription(data.description, lang);
        const Icon = EVENT_TYPE_ICONS[data.type];
        return (
          <>
            <div className="flex items-start justify-between gap-2 mb-3">
              <div>
                <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
                  {Icon && <Icon size={12} className="text-gray-400" />}
                  {t(`eventTypes.${data.type}`)}
                </div>
                <h2 className="text-gray-900 text-xl font-bold">{label}</h2>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors shrink-0 mt-1"
                aria-label={t("detail.close")}
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2 text-sm mb-4">
              <div className="flex gap-3">
                <span className="text-gray-500">{t("detail.year")}:</span>
                <span className="text-gray-700">{formatYear(data.year, lang)}</span>
              </div>
              <div className="flex gap-3 flex-wrap">
                <span className="text-gray-500">{t("detail.culturalSphere")}:</span>
                <div className="flex flex-wrap gap-1">
                  {data.culturalSphere.map((sphere) => (
                    <span
                      key={sphere}
                      className="bg-gray-100 text-gray-700 px-1.5 py-0.5 rounded text-xs"
                    >
                      {sphere}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
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
        "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl p-4 shadow-lg",
        "transition-all duration-200"
      )}
    >
      {renderContent()}
    </div>
  );
}
