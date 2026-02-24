import type { Epoch } from "~/types/history";

export const epochs: Epoch[] = [
  {
    id: "antiquity",
    startYear: -500,
    endYear: 500,
    granularity: "decade",
    labels: {
      de: "Antike",
      en: "Antiquity",
    },
  },
];

export const defaultEpoch = epochs[0]!;
