import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, "../app/data/antiquity");

// Read existing data
const cities = JSON.parse(readFileSync(join(dataDir, "cities.json"), "utf-8"));
const events = JSON.parse(readFileSync(join(dataDir, "events.json"), "utf-8"));
const regions = JSON.parse(readFileSync(join(dataDir, "regions.json"), "utf-8"));

// Create directories
mkdirSync(join(dataDir, "regions"), { recursive: true });
mkdirSync(join(dataDir, "cities"), { recursive: true });
mkdirSync(join(dataDir, "events"), { recursive: true });

let regionFiles = 0, cityFiles = 0, eventFiles = 0;

for (let decade = -1000; decade <= 1900; decade += 10) {
  // Regions: filter by visibility window, then wrap back into GeoJSON FeatureCollection
  const filtered = regions.filter((r: any) => {
    const displayStart = r.peakStartYear ?? r.startYear;
    const displayEnd = r.peakEndYear !== undefined ? r.peakEndYear : r.endYear;
    return displayStart <= decade && (displayEnd === null || displayEnd >= decade);
  });
  const filteredRegions = {
    type: "FeatureCollection",
    features: filtered.map((r: any) => {
      const { geometry, ...properties } = r;
      return { type: "Feature", geometry, properties };
    }),
  };
  writeFileSync(
    join(dataDir, "regions", `${decade}.geojson`),
    JSON.stringify(filteredRegions, null, 2)
  );
  regionFiles++;

  // Cities: startYear <= decade && (endYear === null || endYear >= decade)
  const filteredCities = cities.filter((c: any) => {
    return c.startYear <= decade && (c.endYear === null || c.endYear >= decade);
  });
  writeFileSync(
    join(dataDir, "cities", `${decade}.json`),
    JSON.stringify(filteredCities, null, 2)
  );
  cityFiles++;

  // Events: year >= decade && year < decade + 10
  const filteredEvents = events.filter((e: any) => {
    return e.year >= decade && e.year < decade + 10;
  });
  writeFileSync(
    join(dataDir, "events", `${decade}.json`),
    JSON.stringify(filteredEvents, null, 2)
  );
  eventFiles++;
}

// Generate region-index.json (all regions, no geometry — for the region list panel)
const regionIndex = regions.map((r: any) => {
  const { geometry, ...properties } = r;
  return properties;
});
writeFileSync(
  join(dataDir, "region-index.json"),
  JSON.stringify(regionIndex, null, 2)
);

console.log(`Done! Generated ${regionFiles} region files, ${cityFiles} city files, ${eventFiles} event files, plus region-index.json (${regionIndex.length} regions).`);
