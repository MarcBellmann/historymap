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
  onSelectItem: (item: SelectedItem) => void;
  lang: string;
}

export function MapView({
  cities,
  regionsGeoJSON,
  events,
  currentYear,
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
      } else if (layerId === "regions-fill-parent" || layerId === "regions-fill-child") {
        const props = feature.properties as any;
        const regionData: RegionProperties = {
          ...props,
          labels: typeof props.labels === "string" ? JSON.parse(props.labels) : props.labels,
          description: typeof props.description === "string" ? JSON.parse(props.description) : props.description,
        };
        onSelectItem({ type: "region", data: regionData });
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
        longitude: 40,
        latitude: 30,
        zoom: 2,
      }}
      style={{ width: "100%", height: "100%" }}
      mapStyle="/map-style.json"
      attributionControl={false}
      interactiveLayerIds={["cities-circle", "regions-fill-parent", "regions-fill-child"]}
      onClick={handleMapClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <NavigationControl position="top-right" />
      <AttributionControl position="bottom-right" compact />

      <RegionLayer geojson={regionsGeoJSON} />

      <CityLayer
        cities={cities}
        currentYear={currentYear}
        lang={lang}
      />

      <EventLayer
        events={events}
        currentYear={currentYear}
        onEventClick={(event) => onSelectItem({ type: "event", data: event })}
        lang={lang}
      />
    </Map>
  );
}
