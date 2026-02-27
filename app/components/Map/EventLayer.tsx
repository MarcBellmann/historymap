import { Marker } from "react-map-gl/maplibre";
import { Swords, Landmark, Scale, Palette, Waves } from "lucide-react";
import type { HistoricalEvent } from "~/types/history";
import { getLabel } from "~/lib/dataUtils";

const EVENT_ICONS: Record<HistoricalEvent["type"], React.ComponentType<{ size?: number; className?: string }>> = {
  battle: Swords,
  foundation: Landmark,
  political: Scale,
  cultural: Palette,
  natural: Waves,
};

interface EventLayerProps {
  events: HistoricalEvent[];
  onEventClick: (event: HistoricalEvent) => void;
  lang: string;
}

export function EventLayer({ events, onEventClick, lang }: EventLayerProps) {
  return (
    <>
      {events.map((event) => {
        const Icon = EVENT_ICONS[event.type as keyof typeof EVENT_ICONS];
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
              title={getLabel(event.labels, lang)}
              style={{
                cursor: "pointer",
                width: 24,
                height: 24,
                borderRadius: "50%",
                background: "#ffffff",
                border: "1.5px solid #9ca3af",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                userSelect: "none",
              }}
            >
              {Icon && <Icon size={14} className="text-gray-500" />}
            </div>
          </Marker>
        );
      })}
    </>
  );
}
