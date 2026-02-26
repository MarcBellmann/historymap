import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useState } from "react";
import { useTranslation } from "react-i18next";
import { Globe, Languages } from "lucide-react";
import { MapView } from "~/components/Map/MapView";
import { TimelineSlider } from "~/components/Timeline/TimelineSlider";
import { DetailPanel } from "~/components/Detail/DetailPanel";
import { RegionListPanel } from "~/components/RegionList/RegionListPanel";
import { epochs, defaultEpoch } from "~/data/config";
import { yearToDecade } from "~/lib/decadeUtils";
import type { SelectedItem, City, HistoricalEvent, RegionProperties } from "~/types/history";
import type { FeatureCollection } from "geojson";

const regionGlob = import.meta.glob<{ default: FeatureCollection }>(
  "../data/antiquity/regions/*.geojson"
);
const cityGlob = import.meta.glob<{ default: City[] }>(
  "../data/antiquity/cities/*.json"
);
const eventGlob = import.meta.glob<{ default: HistoricalEvent[] }>(
  "../data/antiquity/events/*.json"
);

const EMPTY_FC: FeatureCollection = { type: "FeatureCollection", features: [] };
const EVENT_OFFSETS = [-50, -40, -30, -20, -10, 0, 10, 20, 30, 40, 50];

export const Route = createFileRoute("/")({
  validateSearch: (search: Record<string, unknown>) => {
    const raw = Number(search.year);
    return { year: isNaN(raw) ? 0 : raw };
  },
  loaderDeps: ({ search: { year } }) => ({
    decade: yearToDecade(
      Math.max(defaultEpoch.startYear, Math.min(defaultEpoch.endYear, year || 0))
    ),
  }),
  loader: async ({ deps: { decade } }) => {
    const [regionsResult, citiesResult, ...eventResults] = await Promise.all([
      regionGlob[`../data/antiquity/regions/${decade}.geojson`]?.() ??
        Promise.resolve({ default: EMPTY_FC }),
      cityGlob[`../data/antiquity/cities/${decade}.json`]?.() ??
        Promise.resolve({ default: [] as City[] }),
      ...EVENT_OFFSETS.map(
        (d) =>
          eventGlob[`../data/antiquity/events/${decade + d}.json`]?.() ??
          Promise.resolve({ default: [] as HistoricalEvent[] })
      ),
    ]);
    return {
      regions: regionsResult.default,
      cities: citiesResult.default,
      events: eventResults.flatMap((r) => r.default),
    };
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

  const { regions, cities, events } = Route.useLoaderData();
  const [selectedItem, setSelectedItem] = useState<SelectedItem>(null);

  const currentEpoch =
    epochs.find((e) => currentYear >= e.startYear && currentYear <= e.endYear) ??
    epochs[epochs.length - 1]!;
  const sliderEpoch = { ...defaultEpoch, labels: currentEpoch.labels };

  const handleYearChange = useCallback(
    (year: number) => {
      navigate({ search: { year }, replace: true });
    },
    [navigate]
  );

  const handleRegionFromList = useCallback(
    (region: RegionProperties, year: number) => {
      navigate({ search: { year }, replace: true });
      setSelectedItem({ type: "region", data: region });
    },
    [navigate]
  );

  const toggleLanguage = useCallback(() => {
    i18n.changeLanguage(lang === "de" ? "en" : "de");
  }, [lang, i18n]);

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      {/* Full-screen Map */}
      <div className="absolute inset-0">
        <MapView
          cities={cities}
          regionsGeoJSON={regions}
          events={events}
          currentYear={currentYear}
          onSelectItem={setSelectedItem}
          lang={lang}
        />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-2.5 backdrop-blur-md bg-stone-950/40 border-b border-white/5">
        <div className="flex items-center gap-2">
          <Globe className="text-amber-400 shrink-0" size={18} />
          <span className="text-stone-100 font-semibold text-sm tracking-wide">
            {t("app.title")}
          </span>
        </div>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-1.5 text-stone-400 hover:text-stone-100 text-xs font-medium transition-colors px-2 py-1 rounded hover:bg-white/5"
        >
          <Languages size={13} />
          {t("language.switch")}
        </button>
      </header>

      {/* Bottom: Timeline */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-full max-w-xl px-4">
        <TimelineSlider
          currentYear={currentYear}
          epoch={sliderEpoch}
          onYearChange={handleYearChange}
          lang={lang}
        />
      </div>

      {/* Region List Panel (bottom-left, hidden when DetailPanel is open) */}
      <RegionListPanel
        lang={lang}
        onSelectRegion={handleRegionFromList}
        visible={selectedItem === null}
      />

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
