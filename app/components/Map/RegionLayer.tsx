import { Source, Layer } from "react-map-gl/maplibre";
import type { FeatureCollection } from "geojson";

interface RegionLayerProps {
  geojson: FeatureCollection;
}

export function RegionLayer({ geojson }: RegionLayerProps) {

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
    <Source id="regions" type="geojson" data={geojson}>
      <Layer {...fillLayer} />
      <Layer {...outlineLayer} />
    </Source>
  );
}
