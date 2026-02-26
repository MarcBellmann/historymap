import { Marker } from "react-map-gl/maplibre";
import type { HistoricalEvent } from "~/types/history";
import { getLabel } from "~/lib/dataUtils";

const EVENT_ICONS: Record<HistoricalEvent["type"], string> = {
  battle: "⚔️",
  foundation: "🏛️",
  political: "⚖️",
  cultural: "🎭",
  natural: "🌊",
};

interface EventLayerProps {
  events: HistoricalEvent[];
  onEventClick: (event: HistoricalEvent) => void;
  lang: string;
}

export function EventLayer({ events, onEventClick, lang }: EventLayerProps) {
  return (
    <>
      {events.map((event) => (
        <Marker
          key={event.id}
          longitude={event.coordinates[0]}
          latitude={event.coordinates[1]}
          anchor="center"
          onClick={(e) => {
            e.originalEvent.stopPropagation();
            onEventClick(event);
          }}
        >
          <div
            title={getLabel(event.labels, lang)}
            style={{
              cursor: "pointer",
              width: 28,
              height: 28,
              borderRadius: "50%",
              background: "rgba(255, 245, 225, 0.9)",
              border: "2px solid #8B4513",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 14,
              boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              userSelect: "none",
            }}
          >
            {EVENT_ICONS[event.type as keyof typeof EVENT_ICONS]}
          </div>
        </Marker>
      ))}
    </>
  );
}
