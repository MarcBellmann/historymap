import { Source, Layer } from "react-map-gl/maplibre";
import type { FeatureCollection } from "geojson";

interface RegionLayerProps {
  geojson: FeatureCollection;
}

export function RegionLayer({ geojson }: RegionLayerProps) {

  const parentFillLayer = {
    id: "regions-fill-parent",
    type: "fill" as const,
    filter: ["!", ["has", "parentId"]] as any,
    paint: {
      "fill-color": ["get", "color"] as any,
      "fill-opacity": ["get", "opacity"] as any,
    },
  };

  const parentOutlineLayer = {
    id: "regions-outline-parent",
    type: "line" as const,
    filter: ["!", ["has", "parentId"]] as any,
    paint: {
      "line-color": ["get", "color"] as any,
      "line-width": 1.5,
      "line-opacity": 0.6,
    },
  };

  const childFillLayer = {
    id: "regions-fill-child",
    type: "fill" as const,
    filter: ["has", "parentId"] as any,
    paint: {
      "fill-color": ["get", "color"] as any,
      "fill-opacity": ["*", ["get", "opacity"], 0.6] as any,
    },
  };

  const childOutlineLayer = {
    id: "regions-outline-child",
    type: "line" as const,
    filter: ["has", "parentId"] as any,
    paint: {
      "line-color": ["get", "color"] as any,
      "line-width": 0.8,
      "line-opacity": 0.6,
    },
  };

  return (
    <Source id="regions" type="geojson" data={geojson}>
      <Layer {...parentFillLayer} />
      <Layer {...parentOutlineLayer} />
      <Layer {...childFillLayer} />
      <Layer {...childOutlineLayer} />
    </Source>
  );
}
