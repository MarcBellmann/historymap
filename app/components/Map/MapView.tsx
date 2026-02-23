import { useRef, useCallback } from "react";
import Map, { NavigationControl, AttributionControl } from "react-map-gl/maplibre";
import type { MapRef, MapLayerMouseEvent } from "react-map-gl/maplibre";
import type { City, HistoricalEvent, RegionProperties, SelectedItem } from "~/types/history";
import { CityLayer } from "./CityLayer";
import { RegionLayer } from "./RegionLayer";
import { EventLayer } from "./EventLayer";
import type { FeatureCollection } from "geojson";

interface MapViewProps {
  cities: City[];
  regionsGeoJSON: FeatureCollection;
  events: HistoricalEvent[];
  currentYear: number;
  perspectiveId: string;
  highlightedSpheres: string[];
  defaultCenter: [number, number];
  defaultZoom: number;
  onSelectItem: (item: SelectedItem) => void;
  lang: string;
}

export function MapView({
  cities,
  regionsGeoJSON,
  events,
  currentYear,
  perspectiveId,
  highlightedSpheres,
  defaultCenter,
  defaultZoom,
  onSelectItem,
  lang,
}: MapViewProps) {
  const mapRef = useRef<MapRef>(null);

  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      const features = e.features;
      if (!features || features.length === 0) return;

      const feature = features[0];
      if (!feature) return;

      const layerId = feature.layer?.id;

      if (layerId === "cities-circle") {
        const cityId = feature.properties?.id as string;
        const city = cities.find((c) => c.id === cityId);
        if (city) onSelectItem({ type: "city", data: city });
      } else if (layerId === "regions-fill") {
        onSelectItem({ type: "region", data: feature.properties as RegionProperties });
      }
    },
    [cities, onSelectItem]
  );

  const handleMouseEnter = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = "pointer";
  }, []);

  const handleMouseLeave = useCallback(() => {
    const canvas = mapRef.current?.getCanvas();
    if (canvas) canvas.style.cursor = "";
  }, []);

  return (
    <Map
      ref={mapRef}
      initialViewState={{
        longitude: defaultCenter[0],
        latitude: defaultCenter[1],
        zoom: defaultZoom,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="/map-style.json"
      attributionControl={false}
      interactiveLayerIds={["cities-circle", "regions-fill"]}
      onClick={handleMapClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavigationControl position="top-right" />
      <AttributionControl position="bottom-right" compact />

      <RegionLayer
        geojson={regionsGeoJSON}
        currentYear={currentYear}
        perspectiveId={perspectiveId}
        highlightedSpheres={highlightedSpheres}
      />

      <CityLayer
        cities={cities}
        currentYear={currentYear}
        perspectiveId={perspectiveId}
        highlightedSpheres={highlightedSpheres}
        lang={lang}
      />

      <EventLayer
        events={events}
        currentYear={currentYear}
        perspectiveId={perspectiveId}
        highlightedSpheres={highlightedSpheres}
        onEventClick={(event) => onSelectItem({ type: "event", data: event })}
        lang={lang}
      />
    </Map>
  );
}
