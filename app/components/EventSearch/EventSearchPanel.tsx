import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { CalendarSearch, Search, X, Swords, Landmark, Scale, Palette, Waves } from "lucide-react";
import { cn } from "~/lib/cn";
import { getLabel } from "~/lib/dataUtils";
import { formatYear } from "~/lib/timeUtils";
import type { HistoricalEvent } from "~/types/history";
import eventIndexRaw from "~/data/antiquity/event-index.json";

const eventIndex = eventIndexRaw as unknown as HistoricalEvent[];

const EVENT_TYPES = ["battle", "foundation", "political", "cultural", "natural"] as const;

const EVENT_TYPE_ICONS: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  battle: Swords,
  foundation: Landmark,
  political: Scale,
  cultural: Palette,
  natural: Waves,
};

interface EventSearchPanelProps {
  lang: string;
  onSelectEvent: (event: HistoricalEvent, year: number) => void;
  visible: boolean;
}

export function EventSearchPanel({ lang, onSelectEvent, visible }: EventSearchPanelProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeType, setActiveType] = useState<string | null>(null);

  // Sort all events by year
  const sortedEvents = useMemo(
    () => [...eventIndex].sort((a, b) => a.year - b.year),
    []
  );

  // Filter by search + type
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return sortedEvents.filter((e) => {
      if (activeType && e.type !== activeType) return false;
      if (q && !getLabel(e.labels, lang).toLowerCase().includes(q)) return false;
      return true;
    });
  }, [searchQuery, activeType, sortedEvents, lang]);

  const handleSelect = (event: HistoricalEvent) => {
    onSelectEvent(event, event.year);
    setIsExpanded(false);
    setSearchQuery("");
  };

  const toggleType = (type: string) => {
    setActiveType((prev) => (prev === type ? null : type));
  };

  if (!visible) return null;

  // Collapsed: small toggle button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={cn(
          "absolute bottom-4 right-4 z-10",
          "flex items-center gap-2 px-3 py-2",
          "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md",
          "text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors",
          "hover:bg-gray-50"
        )}
      >
        <CalendarSearch size={16} />
        {t("eventSearch.showSearch")}
      </button>
    );
  }

  // Expanded: full panel
  return (
    <div
      className={cn(
        "absolute bottom-4 right-4 z-20 w-80 max-w-[calc(100vw-2rem)]",
        "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg",
        "flex flex-col max-h-[60vh]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <h2 className="text-gray-900 font-semibold text-sm">{t("eventSearch.title")}</h2>
        <button
          onClick={() => { setIsExpanded(false); setSearchQuery(""); }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("eventSearch.search")}
            className={cn(
              "w-full pl-8 pr-3 py-1.5 text-sm rounded-md",
              "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400",
              "focus:outline-none focus:border-gray-300"
            )}
          />
        </div>
      </div>

      {/* Type filter chips */}
      <div className="px-4 pb-2 flex gap-1 flex-wrap">
        {EVENT_TYPES.map((type) => {
          const Icon = EVENT_TYPE_ICONS[type];
          const isActive = activeType === type;
          return (
            <button
              key={type}
              onClick={() => toggleType(type)}
              className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-md text-xs transition-colors",
                isActive
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700"
              )}
            >
              {Icon && <Icon size={11} />}
              {t(`eventTypes.${type}`)}
            </button>
          );
        })}
      </div>

      {/* Results count */}
      <div className="px-4 pb-1">
        <span className="text-gray-400 text-xs">{filtered.length} {t("eventSearch.results")}</span>
      </div>

      {/* List */}
      <div className="overflow-y-auto px-2 pb-2 flex-1 min-h-0">
        {filtered.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">{t("eventSearch.noResults")}</p>
        ) : (
          <div className="space-y-0.5">
            {filtered.map((event) => {
              const Icon = EVENT_TYPE_ICONS[event.type];
              return (
                <button
                  key={event.id}
                  onClick={() => handleSelect(event)}
                  className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left"
                >
                  <span className="w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center shrink-0">
                    {Icon && <Icon size={11} className="text-gray-400" />}
                  </span>
                  <span className="text-gray-700 text-sm truncate">
                    {getLabel(event.labels, lang)}
                  </span>
                  <span className="text-gray-400 text-xs ml-auto shrink-0">
                    {formatYear(event.year, lang)}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
