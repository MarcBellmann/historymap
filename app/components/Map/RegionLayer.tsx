import { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FeatureCollection } from "geojson";
import type { RegionProperties } from "~/types/history";

interface RegionLayerProps {
  geojson: FeatureCollection;
  currentYear: number;
}

export function RegionLayer({ geojson, currentYear }: RegionLayerProps) {
  const filteredGeoJSON = useMemo<FeatureCollection>(() => ({
    type: "FeatureCollection",
    features: geojson.features.filter((f) => {
      const props = f.properties as RegionProperties;
      return (
        props.startYear <= currentYear &&
        (props.endYear === null || props.endYear >= currentYear)
      );
    }),
  }), [geojson, currentYear]);

  const fillLayer = {
    id: "regions-fill",
    type: "fill" as const,
    paint: {
      "fill-color": ["get", "color"] as any,
      "fill-opacity": ["get", "opacity"] as any,
    },
  };

  const outlineLayer = {
    id: "regions-outline",
    type: "line" as const,
    paint: {
      "line-color": ["get", "color"] as any,
      "line-width": 1.5,
      "line-opacity": 0.6,
    },
  };

  return (
    <Source id="regions" type="geojson" data={filteredGeoJSON}>
      <Layer {...fillLayer} />
      <Layer {...outlineLayer} />
    </Source>
  );
}
