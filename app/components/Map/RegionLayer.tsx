import { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FeatureCollection } from "geojson";
import type { RegionProperties } from "~/types/history";
import { getHighlightOpacity } from "~/lib/dataUtils";

interface RegionLayerProps {
  geojson: FeatureCollection;
  currentYear: number;
  perspectiveId: string;
  highlightedSpheres: string[];
}

export function RegionLayer({
  geojson,
  currentYear,
  perspectiveId,
  highlightedSpheres,
}: RegionLayerProps) {
  const filteredGeoJSON = useMemo<FeatureCollection>(() => ({
    type: "FeatureCollection",
    features: geojson.features
      .filter((f) => {
        const props = f.properties as RegionProperties;
        return (
          props.startYear <= currentYear &&
          (props.endYear === null || props.endYear >= currentYear)
        );
      })
      .map((f) => {
        const props = f.properties as RegionProperties;
        const highlight = getHighlightOpacity(
          [props.culturalSphere],
          highlightedSpheres,
          perspectiveId
        );
        return {
          ...f,
          properties: {
            ...props,
            computedOpacity: (props.opacity ?? 0.3) * highlight,
          },
        };
      }),
  }), [geojson, currentYear, perspectiveId, highlightedSpheres]);

  const fillLayer = {
    id: "regions-fill",
    type: "fill" as const,
    paint: {
      "fill-color": ["get", "color"] as any,
      "fill-opacity": ["get", "computedOpacity"] as any,
    },
  };

  const outlineLayer = {
    id: "regions-outline",
    type: "line" as const,
    paint: {
      "line-color": ["get", "color"] as any,
      "line-width": 1.5,
      "line-opacity": ["*", ["get", "computedOpacity"], 2] as any,
    },
  };

  return (
    <Source id="regions" type="geojson" data={filteredGeoJSON}>
      <Layer {...fillLayer} />
      <Layer {...outlineLayer} />
    </Source>
  );
}
