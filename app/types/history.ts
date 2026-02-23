export interface City {
  id: string;
  coordinates: [number, number]; // [lng, lat]
  startYear: number; // negative = BC
  endYear: number | null;
  importance: 1 | 2 | 3; // 1=global, 2=regional, 3=local
  culturalSphere: string[];
  labels: Record<string, string>;
  description: Record<string, string>;
}

export interface RegionProperties {
  id: string;
  startYear: number;
  endYear: number | null;
  culturalSphere: string;
  color: string;
  opacity: number;
  labels: Record<string, string>;
  description: Record<string, string>;
}

export interface HistoricalEvent {
  id: string;
  coordinates: [number, number];
  year: number;
  type: "battle" | "foundation" | "political" | "cultural" | "natural";
  culturalSphere: string[];
  labels: Record<string, string>;
  description: Record<string, string>;
}

export interface Epoch {
  id: string;
  startYear: number;
  endYear: number;
  granularity: "century" | "decade";
  labels: Record<string, string>;
}

export type Granularity = "epoch" | "century" | "decade";

export type SelectedItem =
  | { type: "city"; data: City }
  | { type: "region"; data: RegionProperties }
  | { type: "event"; data: HistoricalEvent }
  | null;
