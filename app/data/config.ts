import type { Epoch } from "~/types/history";

export const epochs: Epoch[] = [
  {
    id: "world",
    startYear: -1000,
    endYear: 1900,
    granularity: "decade",
    labels: {
      de: "Weltgeschichte",
      en: "World History",
    },
  },
];

export const defaultEpoch = epochs[0]!;
