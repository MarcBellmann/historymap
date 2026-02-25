import { mkdirSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dataDir = join(__dirname, "../app/data/antiquity");

// Read existing data
const cities = JSON.parse(readFileSync(join(dataDir, "cities.json"), "utf-8"));
const events = JSON.parse(readFileSync(join(dataDir, "events.json"), "utf-8"));
const regions = JSON.parse(readFileSync(join(dataDir, "regions.geojson"), "utf-8"));

// Create directories
mkdirSync(join(dataDir, "regions"), { recursive: true });
mkdirSync(join(dataDir, "cities"), { recursive: true });
mkdirSync(join(dataDir, "events"), { recursive: true });

let regionFiles = 0, cityFiles = 0, eventFiles = 0;

for (let decade = -1000; decade <= 1900; decade += 10) {
  // Regions: features where startYear <= decade && (endYear === null || endYear >= decade)
  const filteredRegions = {
    type: "FeatureCollection",
    features: regions.features.filter((f: any) => {
      const props = f.properties;
      const displayStart = props.peakStartYear ?? props.startYear;
      const displayEnd = props.peakEndYear !== undefined ? props.peakEndYear : props.endYear;
      return displayStart <= decade && (displayEnd === null || displayEnd >= decade);
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

console.log(`Done! Generated ${regionFiles} region files, ${cityFiles} city files, ${eventFiles} event files.`);
