import { useMemo } from "react";
import { Source, Layer } from "react-map-gl/maplibre";
import type { FeatureCollection, Point } from "geojson";
import type { City } from "~/types/history";
import { filterByYear, getHighlightOpacity, getLabel } from "~/lib/dataUtils";

interface CityLayerProps {
  cities: City[];
  currentYear: number;
  perspectiveId: string;
  highlightedSpheres: string[];
  lang: string;
}

export function CityLayer({
  cities,
  currentYear,
  perspectiveId,
  highlightedSpheres,
  lang,
}: CityLayerProps) {
  const filteredCities = useMemo(() => filterByYear(cities, currentYear), [cities, currentYear]);

  const geojson = useMemo<FeatureCollection<Point>>(() => ({
    type: "FeatureCollection",
    features: filteredCities.map((city) => {
      const opacity = getHighlightOpacity(city.culturalSphere, highlightedSpheres, perspectiveId);
      const size = city.importance === 1 ? 8 : city.importance === 2 ? 6 : 4;
      return {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: city.coordinates,
        },
        properties: {
          id: city.id,
          label: getLabel(city.labels, lang),
          importance: city.importance,
          opacity,
          circleRadius: size,
        },
      };
    }),
  }), [filteredCities, highlightedSpheres, perspectiveId, lang]);

  const circleLayer = {
    id: "cities-circle",
    type: "circle" as const,
    paint: {
      "circle-radius": ["get", "circleRadius"] as any,
      "circle-color": "#8B4513",
      "circle-stroke-width": 1.5,
      "circle-stroke-color": "#FFF5E1",
      "circle-opacity": ["get", "opacity"] as any,
      "circle-stroke-opacity": ["get", "opacity"] as any,
    },
  };

  const labelLayer = {
    id: "cities-label",
    type: "symbol" as const,
    layout: {
      "text-field": ["get", "label"] as any,
      "text-size": [
        "case",
        ["==", ["get", "importance"], 1], 13,
        ["==", ["get", "importance"], 2], 11,
        9,
      ] as any,
      "text-offset": [0, 1.2] as any,
      "text-anchor": "top" as const,
      "text-allow-overlap": false,
    },
    paint: {
      "text-color": "#3D1C02",
      "text-halo-color": "#FFF5E1",
      "text-halo-width": 1.5,
      "text-opacity": ["get", "opacity"] as any,
    },
  };

  return (
    <Source id="cities" type="geojson" data={geojson}>
      <Layer {...circleLayer} />
      <Layer {...labelLayer} />
    </Source>
  );
}
