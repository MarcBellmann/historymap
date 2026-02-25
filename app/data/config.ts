import type { Epoch } from "~/types/history";

// Sub-epochs used for labeling the timeline
export const epochs: Epoch[] = [
  {
    id: "early-antiquity",
    startYear: -1000,
    endYear: -501,
    granularity: "decade",
    labels: { de: "Frühe Antike", en: "Early Antiquity" },
  },
  {
    id: "antiquity",
    startYear: -500,
    endYear: 499,
    granularity: "decade",
    labels: { de: "Klassische Antike", en: "Classical Antiquity" },
  },
  {
    id: "medieval",
    startYear: 500,
    endYear: 1499,
    granularity: "decade",
    labels: { de: "Mittelalter", en: "Middle Ages" },
  },
  {
    id: "early-modern",
    startYear: 1500,
    endYear: 1900,
    granularity: "decade",
    labels: { de: "Frühe Neuzeit", en: "Early Modern" },
  },
];

// Full navigation range spanning all epochs
export const defaultEpoch: Epoch = {
  id: "world",
  startYear: -1000,
  endYear: 1900,
  granularity: "decade",
  labels: { de: "Weltgeschichte", en: "World History" },
};
