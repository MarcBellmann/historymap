import { useCallback, useMemo } from "react";
import { Marker } from "react-map-gl/maplibre";
import type { HistoricalEvent } from "~/types/history";
import { filterEventsByYear, getHighlightOpacity, getLabel } from "~/lib/dataUtils";

const EVENT_ICONS: Record<HistoricalEvent["type"], string> = {
  battle: "⚔️",
  foundation: "🏛️",
  political: "⚖️",
  cultural: "🎭",
  natural: "🌊",
};

interface EventLayerProps {
  events: HistoricalEvent[];
  currentYear: number;
  perspectiveId: string;
  highlightedSpheres: string[];
  onEventClick: (event: HistoricalEvent) => void;
  lang: string;
}

export function EventLayer({
  events,
  currentYear,
  perspectiveId,
  highlightedSpheres,
  onEventClick,
  lang,
}: EventLayerProps) {
  const filteredEvents = useMemo(
    () => filterEventsByYear(events, currentYear, 50),
    [events, currentYear]
  );

  return (
    <>
      {filteredEvents.map((event) => {
        const opacity = getHighlightOpacity(
          event.culturalSphere,
          highlightedSpheres,
          perspectiveId
        );
        const label = getLabel(event.labels, lang);

        return (
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
              className="event-marker"
              style={{
                opacity,
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                userSelect: "none",
              }}
              title={label}
            >
              <div
                style={{
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
                }}
              >
                {EVENT_ICONS[event.type]}
              </div>
            </div>
          </Marker>
        );
      })}
    </>
  );
}
