import type { Epoch, Perspective } from "~/types/history";

export const epochs: Epoch[] = [
  {
    id: "antiquity",
    startYear: -500,
    endYear: 500,
    granularity: "century",
    labels: {
      de: "Antike",
      en: "Antiquity",
    },
  },
];

export const perspectives: Perspective[] = [
  {
    id: "roman",
    labels: { de: "Römisch", en: "Roman" },
    highlightedSpheres: ["roman", "mediterranean", "latin"],
    defaultCenter: [12.5, 41.9],
    defaultZoom: 4,
  },
  {
    id: "persian",
    labels: { de: "Persisch", en: "Persian" },
    highlightedSpheres: ["persian", "iranian", "mesopotamian"],
    defaultCenter: [53.7, 32.4],
    defaultZoom: 4,
  },
  {
    id: "greek",
    labels: { de: "Griechisch", en: "Greek" },
    highlightedSpheres: ["greek", "hellenistic", "mediterranean"],
    defaultCenter: [23.7, 38.0],
    defaultZoom: 5,
  },
  {
    id: "chinese",
    labels: { de: "Chinesisch", en: "Chinese" },
    highlightedSpheres: ["chinese", "han", "east-asian"],
    defaultCenter: [113.0, 34.0],
    defaultZoom: 4,
  },
  {
    id: "global",
    labels: { de: "Global", en: "Global" },
    highlightedSpheres: [],
    defaultCenter: [20.0, 30.0],
    defaultZoom: 2,
  },
];

export const defaultEpoch = epochs[0]!;
export const defaultPerspective = perspectives[4]!;
