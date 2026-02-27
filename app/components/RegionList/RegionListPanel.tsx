import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { List, Search, ChevronRight, X } from "lucide-react";
import { cn } from "~/lib/cn";
import { getLabel } from "~/lib/dataUtils";
import { formatYear } from "~/lib/timeUtils";
import type { RegionProperties } from "~/types/history";
import regionIndexRaw from "~/data/antiquity/region-index.json";

const regionIndex = regionIndexRaw as unknown as RegionProperties[];

interface RegionListPanelProps {
  lang: string;
  onSelectRegion: (region: RegionProperties, year: number) => void;
  visible: boolean;
}

interface RegionGroup {
  parent: RegionProperties;
  children: RegionProperties[];
}

export function RegionListPanel({ lang, onSelectRegion, visible }: RegionListPanelProps) {
  const { t } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());

  // Build parent-child groups + standalone regions
  const { groups, standalone } = useMemo(() => {
    const childrenByParent = new Map<string, RegionProperties[]>();
    const parentIds = new Set<string>();

    // Collect all children
    for (const r of regionIndex) {
      if (r.parentId) {
        const list = childrenByParent.get(r.parentId) ?? [];
        list.push(r);
        childrenByParent.set(r.parentId, list);
        parentIds.add(r.parentId);
      }
    }

    const groups: RegionGroup[] = [];
    const standalone: RegionProperties[] = [];

    for (const r of regionIndex) {
      if (r.parentId) continue; // handled as child
      if (childrenByParent.has(r.id)) {
        groups.push({
          parent: r,
          children: childrenByParent.get(r.id)!.sort((a, b) =>
            getLabel(a.labels, lang).localeCompare(getLabel(b.labels, lang))
          ),
        });
      } else {
        standalone.push(r);
      }
    }

    groups.sort((a, b) =>
      getLabel(a.parent.labels, lang).localeCompare(getLabel(b.parent.labels, lang))
    );
    standalone.sort((a, b) =>
      getLabel(a.labels, lang).localeCompare(getLabel(b.labels, lang))
    );

    return { groups, standalone };
  }, [lang]);

  // Filter by search
  const filtered = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return { groups, standalone };

    const matchesSearch = (r: RegionProperties) =>
      getLabel(r.labels, lang).toLowerCase().includes(q);

    const filteredGroups: RegionGroup[] = [];
    for (const g of groups) {
      const parentMatch = matchesSearch(g.parent);
      const matchingChildren = g.children.filter(matchesSearch);
      if (parentMatch || matchingChildren.length > 0) {
        filteredGroups.push({
          parent: g.parent,
          children: parentMatch ? g.children : matchingChildren,
        });
      }
    }

    return {
      groups: filteredGroups,
      standalone: standalone.filter(matchesSearch),
    };
  }, [searchQuery, groups, standalone, lang]);

  const totalResults = filtered.groups.reduce((n, g) => n + 1 + g.children.length, 0) + filtered.standalone.length;

  const handleSelect = (region: RegionProperties) => {
    const year = region.peakStartYear ?? region.startYear;
    onSelectRegion(region, year);
    setIsExpanded(false);
    setSearchQuery("");
  };

  const toggleParent = (id: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!visible) return null;

  // Collapsed: small toggle button
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className={cn(
          "absolute bottom-4 left-4 z-10",
          "flex items-center gap-2 px-3 py-2",
          "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-md",
          "text-gray-500 hover:text-gray-900 text-sm font-medium transition-colors",
          "hover:bg-gray-50"
        )}
      >
        <List size={16} />
        {t("regionList.showList")}
      </button>
    );
  }

  // Expanded: full panel
  return (
    <div
      className={cn(
        "absolute bottom-4 left-4 z-20 w-80 max-w-[calc(100vw-2rem)]",
        "bg-white/95 backdrop-blur-sm border border-gray-200 rounded-xl shadow-lg",
        "flex flex-col max-h-[60vh]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <h2 className="text-gray-900 font-semibold text-sm">{t("regionList.title")}</h2>
        <button
          onClick={() => { setIsExpanded(false); setSearchQuery(""); }}
          className="text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={16} />
        </button>
      </div>

      {/* Search */}
      <div className="px-4 pb-2">
        <div className="relative">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("regionList.search")}
            className={cn(
              "w-full pl-8 pr-3 py-1.5 text-sm rounded-md",
              "bg-gray-50 border border-gray-200 text-gray-900 placeholder-gray-400",
              "focus:outline-none focus:border-gray-300"
            )}
          />
        </div>
      </div>

      {/* List */}
      <div className="overflow-y-auto px-2 pb-2 flex-1 min-h-0">
        {totalResults === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">{t("regionList.noResults")}</p>
        ) : (
          <div className="space-y-0.5">
            {/* Grouped regions (parent + children) */}
            {filtered.groups.map((g) => {
              const isOpen = expandedParents.has(g.parent.id) || searchQuery.trim().length > 0;
              return (
                <div key={g.parent.id}>
                  {/* Parent row */}
                  <div className="flex items-center">
                    <button
                      onClick={() => toggleParent(g.parent.id)}
                      className="p-1 text-gray-400 hover:text-gray-600 transition-colors shrink-0"
                    >
                      <ChevronRight
                        size={14}
                        className={cn("transition-transform", isOpen && "rotate-90")}
                      />
                    </button>
                    <button
                      onClick={() => handleSelect(g.parent)}
                      className="flex items-center gap-2 flex-1 min-w-0 px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: g.parent.color }}
                      />
                      <span className="text-gray-700 text-sm truncate">
                        {getLabel(g.parent.labels, lang)}
                      </span>
                      <span className="text-gray-400 text-xs ml-auto shrink-0">
                        {formatYear(g.parent.peakStartYear ?? g.parent.startYear, lang)}
                      </span>
                    </button>
                  </div>

                  {/* Children */}
                  {isOpen && (
                    <div className="ml-5">
                      {g.children.map((child) => (
                        <button
                          key={child.id}
                          onClick={() => handleSelect(child)}
                          className="flex items-center gap-2 w-full px-2 py-1 rounded-md hover:bg-gray-50 transition-colors text-left"
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0 opacity-60"
                            style={{ backgroundColor: child.color }}
                          />
                          <span className="text-gray-500 text-xs truncate">
                            {getLabel(child.labels, lang)}
                          </span>
                          <span className="text-gray-300 text-xs ml-auto shrink-0">
                            {formatYear(child.peakStartYear ?? child.startYear, lang)}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {/* Standalone regions */}
            {filtered.standalone.map((r) => (
              <button
                key={r.id}
                onClick={() => handleSelect(r)}
                className="flex items-center gap-2 w-full px-2 py-1.5 rounded-md hover:bg-gray-50 transition-colors text-left ml-5"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: r.color }}
                />
                <span className="text-gray-700 text-sm truncate">
                  {getLabel(r.labels, lang)}
                </span>
                <span className="text-gray-400 text-xs ml-auto shrink-0">
                  {formatYear(r.peakStartYear ?? r.startYear, lang)}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
