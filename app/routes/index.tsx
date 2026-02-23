import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Languages } from "lucide-react";
import { MapView } from "~/components/Map/MapView";
import { TimelineSlider } from "~/components/Timeline/TimelineSlider";
import { DetailPanel } from "~/components/Detail/DetailPanel";
import { defaultEpoch } from "~/data/config";
import { filterByYear, filterEventsByYear } from "~/lib/dataUtils";
import type { SelectedItem } from "~/types/history";
import { useState } from "react";

import citiesData from "~/data/antiquity/cities.json";
import regionsData from "~/data/antiquity/regions.geojson";
import eventsData from "~/data/antiquity/events.json";
import type { City, HistoricalEvent } from "~/types/history";
import type { FeatureCollection } from "geojson";

const cities = citiesData as unknown as City[];
const regions = regionsData as FeatureCollection;
const events = eventsData as unknown as HistoricalEvent[];

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = Number(search.year);
    return { year: isNaN(raw) ? 0 : raw };
  },
  component: HomePage,
});

function HomePage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("de") ? "de" : "en";
  const navigate = useNavigate({ from: "/" });

  const { year: urlYear } = Route.useSearch();
  const epoch = defaultEpoch;
  const currentYear = Math.max(epoch.startYear, Math.min(epoch.endYear, urlYear));

  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  const handleYearChange = useCallback((year: number) => {
    navigate({ search: { year }, replace: true });
  }, [navigate]);

  const filteredCities = useMemo(
    () => filterByYear(cities, currentYear),
    [currentYear]
  );

  const filteredEvents = useMemo(
    () => filterEventsByYear(events, currentYear, 50),
    [currentYear]
  );

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(lang === "de" ? "en" : "de");
  }, [lang, i18n]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen Map */}
      <div className="absolute inset-0">
        <MapView
          cities={filteredCities}
          regionsGeoJSON={regions}
          events={filteredEvents}
          currentYear={currentYear}
          onSelectItem={setSelectedItem}
          lang={lang}
        />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-stone-950/80 to-transparent pointer-events-none">
        <div className="flex items-center gap-2 pointer-events-auto">
          <Globe className="text-amber-400" size={22} />
          <span className="text-stone-100 font-bold text-lg tracking-tight">
            {t("app.title")}
          </span>
          <span className="text-stone-500 text-sm hidden sm:inline">
            {t("app.subtitle")}
          </span>
        </div>
        <button
          onClick={toggleLanguage}
          className="pointer-events-auto flex items-center gap-1.5 bg-stone-800/90 hover:bg-stone-700 border border-stone-600 text-stone-300 hover:text-stone-100 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors"
        >
          <Languages size={14} />
          {t("language.switch")}
        </button>
      </header>

      {/* Bottom: Timeline */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4">
        <TimelineSlider
          currentYear={currentYear}
          epoch={epoch}
          onYearChange={handleYearChange}
          lang={lang}
        />
      </div>

      {/* Detail Panel (bottom-left) */}
      {selectedItem && (
        <DetailPanel
          item={selectedItem}
          onClose={() => setSelectedItem(null)}
          lang={lang}
        />
      )}
    </div>
  );
}
