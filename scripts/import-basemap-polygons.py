#!/usr/bin/env python3
"""
Import polygons from aourednik/historical-basemaps into regions.json.

For each region, finds the best matching polygon from the basemap snapshot
closest to the region's peak period and writes the geometry into regions.json.

Usage:
  python3 scripts/import-basemap-polygons.py
"""

import json
import glob
import os
import sys

BASEMAP_DIR = "/tmp"
REGIONS_FILE = "app/data/antiquity/regions.json"

# Manual mapping: our region EN label -> basemap NAME
# Only include confident matches!
MANUAL_MAP = {
    # Exact matches are handled automatically, these are variations:
    "Alaouite Morocco": "Morocco",
    "Almoravid Empire": "Almoravid dynasty",
    "Assyria (Heartland)": "Assyria",
    "Austria-Hungary": "Austria Hungary",
    "Ayutthaya Kingdom": "Ayutthaya",
    "Babylonia (Satrapy)": "Babylonia",
    "Bactria (Kushan)": "Bactria",
    "Buyid Dynasty": "Buyid Emirate",
    "Chola Empire": "Chola",
    "Classic Maya": "Maya",
    "Classical Athens": "Greek city-states",
    "Congress Poland": "Poland",
    "Crown of Aragon": "Aragon",
    "Crown of Castile": "Castile",
    "Dacian Kingdom": "Dacia",
    "Dai Viet": "Dai Viet",
    "Eastern Zhou Dynasty": "Zhou states",
    "Egypt (Late Period)": "Egypt",
    "Egypt (Satrapy)": "Egypt",
    "Egypt (Third Intermediate Period)": "Egypt",
    "Egypt under Muhammad Ali": "Egypt",
    "Frankish Empire": "Frankish Empire",
    "Gaekwad (Maratha)": "Maratha Confederacy",
    "Gandhara (Kushan)": "Gandhāra",
    "Ghana Empire": "Empire of Ghana",
    "Goguryeo": "Koguryo",
    "Grand Duchy of Lithuania": "Lithuania",
    "Grand Duchy of Moscow": "Grand Duchy of Moscow",
    "Greek city-states": "Greek city-states",
    "Goryeo Dynasty": "Koryŏ",
    "Han Dynasty": "Han Empire",
    "Holkar (Maratha)": "Maratha Confederacy",
    "Hunnic Empire": "Huns",
    "Ilkhanate": "Ilkhanate",
    "Inca Empire": "Inca Empire",
    "Jin Dynasty (265-420)": "Jin",
    "Joseon Dynasty": "Korea",
    "Kanem-Bornu Empire": "Kanem-Bornu",
    "Khmer Empire": "Khmer Empire",
    "Kingdom of Aksum": "Axum",
    "Kingdom of France": "France",
    "Kingdom of Georgia": "Georgia",
    "Kingdom of Hungary": "Hungary",
    "Kingdom of Italy": "Italy",
    "Kingdom of Kongo": "Kingdom of Kongo",
    "Kingdom of Naples": "Kingdom of Naples",
    "Kingdom of Poland": "Poland",
    "Kingdom of Portugal": "Portugal",
    "Kingdom of Prussia": "Prussia",
    "Kingdom of Sardinia": "Kingdom of Sardinia",
    "Kingdom of Scotland": "Scotland",
    "Kingdom of Serbia": "Serbia",
    "Kingdom of Sicily": "Sicily",
    "Kush": "Kush",
    "Liao Dynasty": "Liao",
    "Mali Empire": "Mali",
    "Maratha Empire": "Maratha Confederacy",
    "Maurya Empire": "Mauryan Empire",
    "Media (Satrapy)": "Media",
    "Ming Dynasty": "Ming Chinese Empire",
    "Moche Culture": "Moche",
    "Mongol Empire": "Mongol Empire",
    "Mughal Empire": "Mughal Empire",
    "Nazca Culture": "Nazca",
    "Neustria": "Neustria",
    "Nanda Empire": "Nanda",
    "Olmec Civilization": "Olmec",
    "Ottoman Empire": "Ottoman Empire",
    "Pallava Dynasty": "Pallava",
    "Pandya Dynasty": "Pandya state",
    "Parthian Empire": "Parthia",
    "Peshwa (Maratha)": "Maratha Confederacy",
    "Ptolemaic Egypt": "Ptolemaic Kingdom",
    "Qin Dynasty": "Qin",
    "Qing Dynasty": "Qing Empire",
    "Rashidun Caliphate": "Rashidun Caliphate",
    "Roman Britain": "Roman Empire",
    "Roman Egypt": "Roman Empire",
    "Roman Empire": "Roman Empire",
    "Roman Gaul": "Roman Empire",
    "Roman Hispania": "Roman Empire",
    "Roman Republic": "Roman Republic",
    "Russian Empire": "Russian Empire",
    "Safavid Empire": "Safavid Empire",
    "Samanid Empire": "Samanid Empire",
    "Sasanian Empire": "Persia",
    "Satavahana Dynasty": "Satavahana",
    "Seleucid Empire": "Seleucid Kingdom",
    "Silla": "Silla",
    "Scindia (Maratha)": "Maratha Confederacy",
    "Song Dynasty": "Song Empire",
    "Songhai Empire": "Songhai",
    "Spanish Empire": "Spain",
    "Srivijaya Empire": "Srivijaya Empire",
    "Sui Dynasty": "Sui Empire",
    "Sultanate of Delhi": "Sultanate of Delhi",
    "Tang Dynasty": "Tang Empire",
    "Tiwanaku Empire": "Tiahuanaco Empire",
    "Tokugawa Shogunate": "Tokugawa Shogunate",
    "Umayyad Caliphate": "Umayyad Caliphate",
    "Vijayanagara Empire": "Vijayanagara",
    "Wari Empire": "Huari Empire",
    "Western Xia": "Western Xia",
    "Yuan Dynasty": "Mongol Empire",
    "Zapotec Civilization": "Zapotec",
    "Baekje": "Paekche",
    "Balhae": "Balhae",
    "Bengal (Mughal)": "Bengal",
    "Byzantine Greece": "Byzantine Empire",
    "Byzantine Italy": "Byzantine Empire",
    "Chavin Culture": "Chavin",
    "Chimu Empire": "Chimú Empire",
    "Commagene": "Commagene",
    "Deccan (Maurya)": "Mauryan Empire",
    "Deccan (Mughal)": "Mughal Empire",
    "Eastern Wu": "Wu",
    "Gaul (Celtic)": "Gaul",
    "Golden Horde": "Golden Horde",
    "Gupta Empire": "Gupta Empire",
    "Holy Roman Empire": "Holy Roman Empire",
    "Iberia (Roman)": "Roman Republic",
    "Jin Dynasty (1115-1234)": "Jin",
    "Joseon Korea": "Korea",
    "Kara-Khanid Khanate": "Karakhanids",
    "Khwarezmian Empire": "Khwarezm",
    "Kingdom of England": "England",
    "Kingdom of Jerusalem": "Kingdom of Jerusalem",
    "Latin Empire": "Latin Empire",
    "Majapahit Empire": "Majapahit Empire",
    "Merina Kingdom": "Expansionist Kingdom of Merina",
    "Mixtec Kingdoms": "Mixtec Empire",
    "Nara Period Japan": "Japan",
    "Nazca": "Nazca",
    "Norman Sicily": "Sicily",
    "Numidian Kingdom": "Numidia",
    "Oyo Empire": "Oyo",
    "Pagan Kingdom": "Kingdom of Pagan",
    "Papal States": "Papal States",
    "Republic of Venice": "Venice",
    "Shu Han": "Shu-Han",
    "Siam": "Siam",
    "Sukhothai Kingdom": "Sukhothai",
    "Swedish Empire": "Sweden",
    "Teotihuacan": "Teotihuacán",
    "Toltec Empire": "Toltec Empire",
    "Umayyad Córdoba": "Umayyad Caliphate",
    "Western Roman Empire": "Western Roman Empire",
    "Xiongnu": "Xiongnu",
    "Zulu Kingdom": "Zulu",
    "Aksumite Empire": "Axum",
    "Afsharid Dynasty": "Persia",
    "Ashikaga Shogunate": "Japan",
    "Kamakura Shogunate": "Japan",
    "Heian Period Japan": "Japan",
    "Mughal Bengal": "Bengal",
    "Mughal Deccan": "Mughal Empire",
    "Antisuyu (Inca)": "Inca Empire",
    "Chinchaysuyu (Inca)": "Inca Empire",
    "Collasuyu (Inca)": "Inca Empire",
    "Cuntisuyu (Inca)": "Inca Empire",
    "Andong Protectorate (Tang)": "Tang Empire",
    "Anxi Protectorate (Tang)": "Tang Empire",
    "Archduchy of Austria": "Austrian Empire",
    "Ayyubid Sultanate": "Ayyubid Dynasty",
    "Bahmani Sultanate": "Bahmani Kingdom",
    "Celtic Europe": "Celts",
    "Ashanti Empire": "Ashanti Confederacy",
    "Armenian Kingdom of Cilicia": "Armenia",
    "Chalukya Dynasty": "Chalukya Empire",
    "Confederation of the Rhine": "Confederation of the Rhine",
    "County of Edessa": "Crusader States",
    "County of Tripoli": "Crusader States",
    "Principality of Antioch": "Crusader States",
    "Delhi Sultanate": "Sultanate of Delhi",
    "Durrani Empire": "Durrani Empire",
    "Eastern Han Dynasty": "Han Empire",
    "Eastern Jin Dynasty": "Jin",
    "Eastern Roman Empire": "Byzantine Empire",
    "Fatimid Egypt": "Fatimid Caliphate",
    "Gaelic Ireland": "Ireland",
    "Ghurid Dynasty": "Ghurids",
    "Great Seljuk Empire": "Seljuk Empire",
    "Hoysala Empire": "Hoysala",
    "Kakatiya Dynasty": "Kakatiya",
    "Khwarezmian Dynasty": "Khwarezm",
    "Kingdom of Bohemia": "Bohemia",
    "Kingdom of Denmark": "Denmark",
    "Kingdom of Navarre": "Navarre",
    "Kingdom of Norway": "Norway",
    "Kushan Empire": "Kushan Empire",
    "Liu Song Dynasty": "Song",
    "Lombard Kingdom": "Lombard principalities",
    "Lydian Kingdom": "Lydian Kingdom",
    "Macedon": "Macedonia",
    "Majapahit": "Majapahit Empire",
    "Mamluk Sultanate": "Mamluke Sultanate",
    "Meroitic Kingdom": "Meroe",
    "Oyo Empire": "Oyo",
    "Republic of Novgorod": "Novgorod",
    "Teutonic Order": "Teutonic Knights",
    "Numidian Kingdom": "Numidia",
    "Spartan League": "Sparta",
    "Dai Viet": "Annam",
    "Ghaznavid Empire": "Ghaznavid Emirate",
    "Austrasia": "East Francia",
    "Gaelic Ireland": "Kingdom of Ireland",
    "Mughal India": "Mughal Empire",
    "Northern Wei Dynasty": "Toba Wei",
    "Cao Wei": "Wei",
    "Wei (Kingdom)": "Wei",
    "Ostrogothic Kingdom": "Ostrogoths",
    "Pala Empire": "Palas",
    "Pontic Kingdom": "Pontic Kingdom",
    "Rashtrakuta Dynasty": "Rashtrakuta",
    "Republic of Genoa": "Genoa",
    "Republic of Novgorod": "Novgorod",
    "Samanid Dynasty": "Samanid Empire",
    "Seljuk Sultanate of Rum": "Seljuk Caliphate",
    "Great Seljuk Empire": "Seljuk Empire",
    "Shu (Kingdom)": "Shu-Han",
    "Silla (Unified)": "Silla",
    "Songhai": "Songhai Empire",
    "Spartan League": "Sparta",
    "Sri Lanka (Ancient)": "Simhala",
    "Sui China": "Sui Empire",
    "Teutonic Order": "Teutonic Order",
    "Three Kingdoms (Korea)": "Silla",
    "Timurid Empire": "Timurid Empire",
    "Vandal Kingdom": "Vandals",
    "Visigothic Kingdom": "Visigoths",
    "Wei (Kingdom)": "Wei",
    "Western Han Dynasty": "Han Empire",
    "Western Jin Dynasty": "Jin",
    "Wu (Kingdom)": "Wu",
    "Xianbei": "Xianbei",
    "Zapotec": "Zapotec",
}


def load_basemap_snapshots():
    """Load all basemap GeoJSON files, keyed by year."""
    snapshots = {}
    for fp in glob.glob(os.path.join(BASEMAP_DIR, "world_*.geojson")):
        fname = os.path.basename(fp).replace("world_", "").replace(".geojson", "")
        if fname.startswith("bc"):
            year = -int(fname.replace("bc", ""))
        else:
            year = int(fname)

        with open(fp) as f:
            data = json.load(f)

        # Index features by name
        by_name = {}
        for feat in data["features"]:
            name = feat["properties"].get("NAME")
            if name:
                by_name[name] = feat
        snapshots[year] = by_name

    return snapshots


def find_closest_year(target, available_years):
    """Find the available year closest to the target."""
    return min(available_years, key=lambda y: abs(y - target))


def simplify_coords(coords, max_points=50):
    """Very basic simplification: keep every Nth point to stay under max_points."""
    if isinstance(coords[0][0], (int, float)):
        # Simple ring
        if len(coords) <= max_points:
            return coords
        step = max(1, len(coords) // max_points)
        simplified = coords[::step]
        # Ensure ring is closed
        if simplified[0] != simplified[-1]:
            simplified.append(simplified[0])
        return simplified
    else:
        return [simplify_coords(c, max_points) for c in coords]


def count_coords(geometry):
    """Count total coordinate points in a geometry."""
    total = 0
    def _count(obj):
        nonlocal total
        if isinstance(obj, list):
            if len(obj) > 0 and isinstance(obj[0], (int, float)):
                total += 1
            else:
                for item in obj:
                    _count(item)
    _count(geometry["coordinates"])
    return total


def main():
    print("Loading basemap snapshots...")
    snapshots = load_basemap_snapshots()
    available_years = sorted(snapshots.keys())
    print(f"  Loaded {len(snapshots)} snapshots: {available_years[0]} to {available_years[-1]}")

    # Build lookup: lowercase basemap name -> original name
    all_basemap_names = set()
    for year_data in snapshots.values():
        all_basemap_names.update(year_data.keys())
    basemap_lower = {n.lower(): n for n in all_basemap_names}

    print(f"  {len(all_basemap_names)} unique entity names in basemap\n")

    # Load our regions
    with open(REGIONS_FILE) as f:
        regions = json.load(f)

    print(f"Our regions: {len(regions)}")
    already_has_geom = sum(1 for r in regions if r.get("geometry") is not None)
    print(f"  Already have geometry: {already_has_geom}\n")

    matched = 0
    skipped = 0
    failed = 0

    for r in regions:
        en = r["labels"].get("en", "")
        rid = r["id"]

        # Skip if already has geometry
        if r.get("geometry") is not None:
            skipped += 1
            continue

        # Find basemap name
        basemap_name = None

        # 1. Manual mapping
        if en in MANUAL_MAP:
            basemap_name = MANUAL_MAP[en]
        # 2. Exact match (case-insensitive)
        elif en.lower() in basemap_lower:
            basemap_name = basemap_lower[en.lower()]

        if not basemap_name:
            failed += 1
            continue

        # Find the best year snapshot
        peak_start = r.get("peakStartYear") or r.get("startYear", 0)
        peak_end = r.get("peakEndYear") or r.get("endYear") or peak_start
        target_year = (peak_start + peak_end) // 2 if peak_end else peak_start
        best_year = find_closest_year(target_year, available_years)

        # Look for the feature in the closest year, then expand search
        feature = None
        search_years = sorted(available_years, key=lambda y: abs(y - target_year))
        for try_year in search_years:
            if basemap_name in snapshots[try_year]:
                feature = snapshots[try_year][basemap_name]
                best_year = try_year
                break

        if not feature:
            print(f"  MISS: {en:45s} -> '{basemap_name}' not found in any snapshot")
            failed += 1
            continue

        # Extract and optionally simplify geometry
        geom = feature["geometry"]
        n_coords = count_coords(geom)

        if n_coords > 200:
            simplified_geom = {
                "type": geom["type"],
                "coordinates": simplify_coords(geom["coordinates"], max_points=80),
            }
            n_after = count_coords(simplified_geom)
            geom = simplified_geom
        else:
            n_after = n_coords

        r["geometry"] = geom
        matched += 1
        print(f"  OK:   {en:45s} <- {basemap_name} (year {best_year}, {n_coords}->{n_after} pts)")

    print(f"\n=== RESULTS ===")
    print(f"Matched:  {matched}")
    print(f"Skipped:  {skipped} (already had geometry)")
    print(f"Failed:   {failed}")
    print(f"Total:    {len(regions)}")

    # Write back
    with open(REGIONS_FILE, "w") as f:
        json.dump(regions, f, indent=2, ensure_ascii=False)
    print(f"\nWrote {REGIONS_FILE}")


if __name__ == "__main__":
    main()
