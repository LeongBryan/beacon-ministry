import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, ChevronUp, ChevronDown } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PersonChip from "@/components/PersonChip";
import {
  type Person, type Group, type GroupType, type EngagementLevel,
  groupTypeLabels, groupTypeColors, engagementLabels, engagementColors,
  engagementDotColors, predefinedTags, ministries,
} from "@/data/mockData";

interface Props {
  people: Person[];
  groups: Group[];
  onUpdateGroups: (groups: Group[]) => void;
  onUpdatePerson: (person: Person) => void;
}

const GroupsView = ({ people, groups, onUpdateGroups, onUpdatePerson }: Props) => {
  const [filterType, setFilterType] = useState<GroupType | "all">("all");
  const [dragPersonId, setDragPersonId] = useState<string | null>(null);

  // Shared filters
  const [search, setSearch] = useState("");
  const [filterEngagement, setFilterEngagement] = useState("all");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterMinistry, setFilterMinistry] = useState("all");
  const [showFilters, setShowFilters] = useState(false);

  // Sort for unassigned
  const [sortField, setSortField] = useState<"name" | "engagement">("name");
  const [sortAsc, setSortAsc] = useState(true);

  const personMap = new Map(people.map(p => [p.id, p]));
  const filteredGroups = filterType === "all" ? groups : groups.filter(g => g.type === filterType);

  const assignedIds = new Set(filteredGroups.flatMap(g => g.members));

  // Person filter function
  const matchesPerson = (p: Person) => {
    const s = search.toLowerCase();
    const matchesSearch = !s || p.name.toLowerCase().includes(s) || p.tags.some(t => t.toLowerCase().includes(s));
    const matchesEng = filterEngagement === "all" || p.engagement === filterEngagement;
    const matchesTag = filterTags.length === 0 || filterTags.every(t => p.tags.includes(t));
    const matchesMin = filterMinistry === "all" || p.ministries.includes(filterMinistry);
    return matchesSearch && matchesEng && matchesTag && matchesMin;
  };

  // Filter group members for display
  const getFilteredMembers = (memberIds: string[]) => {
    return memberIds
      .map(id => personMap.get(id))
      .filter((p): p is Person => !!p && matchesPerson(p));
  };

  const unassigned = useMemo(() => {
    let result = people.filter(p => !assignedIds.has(p.id) && matchesPerson(p));
    result.sort((a, b) => {
      const cmp = sortField === "name"
        ? a.name.localeCompare(b.name)
        : a.engagement.localeCompare(b.engagement);
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [people, assignedIds, search, filterEngagement, filterTags, filterMinistry, sortField, sortAsc]);

  const allTagsInUse = useMemo(() => {
    const s = new Set<string>(predefinedTags);
    people.forEach(p => p.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [people]);

  const activeFilters = [filterMinistry, filterEngagement].filter(f => f !== "all").length + filterTags.length + (search ? 1 : 0);

  const toggleFilterTag = (tag: string) => {
    setFilterTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleDrop = (groupId: string, personId: string) => {
    const updated = groups.map(g => {
      const withoutPerson = { ...g, members: g.members.filter(m => m !== personId) };
      if (g.id === groupId && !g.members.includes(personId)) {
        return { ...g, members: [...g.members, personId] };
      }
      return withoutPerson;
    });
    onUpdateGroups(updated);
    setDragPersonId(null);
  };

  const handleDropUnassigned = (personId: string) => {
    const updated = groups.map(g => ({
      ...g,
      members: g.members.filter(m => m !== personId),
    }));
    onUpdateGroups(updated);
    setDragPersonId(null);
  };

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span className="text-xs text-muted-foreground">Legend:</span>
        {(Object.keys(engagementLabels) as EngagementLevel[]).map(level => (
          <Badge key={level} className={`${engagementColors[level]} text-xs`}>
            {engagementLabels[level]}
          </Badge>
        ))}
      </div>

      {/* Filters bar */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={filterType} onValueChange={v => setFilterType(v as GroupType | "all")}>
          <SelectTrigger className="w-48 h-10"><SelectValue placeholder="Group type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {Object.entries(groupTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search people…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
        </div>
        <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className="gap-2 h-10">
          <Filter size={16} /> Filters
          {activeFilters > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">{activeFilters}</Badge>}
        </Button>
      </div>

      {showFilters && (
        <div className="space-y-3 mb-4 p-4 bg-card rounded-lg border border-border">
          <div className="flex flex-wrap gap-3">
            <Select value={filterEngagement} onValueChange={setFilterEngagement}>
              <SelectTrigger className="w-40 h-10"><SelectValue placeholder="Engagement" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {(Object.entries(engagementLabels) as [string, string][]).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterMinistry} onValueChange={setFilterMinistry}>
              <SelectTrigger className="w-48 h-10"><SelectValue placeholder="Ministry" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ministries</SelectItem>
                {ministries.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
              </SelectContent>
            </Select>
            {activeFilters > 0 && (
              <Button variant="ghost" size="sm" onClick={() => { setFilterEngagement("all"); setFilterMinistry("all"); setFilterTags([]); setSearch(""); }} className="gap-1 text-muted-foreground">
                <X size={14} /> Clear all
              </Button>
            )}
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-2">Filter by tags:</p>
            <div className="flex flex-wrap gap-1.5">
              {allTagsInUse.map(tag => (
                <button
                  key={tag}
                  onClick={() => toggleFilterTag(tag)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    filterTags.includes(tag)
                      ? "bg-primary/10 border-primary/40 text-primary"
                      : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {filterTags.includes(tag) ? "✓ " : ""}{tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-4">Drag people between groups · Click a chip to view details & change engagement level</p>

      {/* Group columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredGroups.map(group => {
          const members = getFilteredMembers(group.members);
          const totalMembers = group.members.length;
          return (
            <div
              key={group.id}
              onDragOver={e => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
                if (pid) handleDrop(group.id, pid);
              }}
              className={`rounded-lg border-2 border-dashed p-4 min-h-[120px] transition-colors ${
                dragPersonId ? "border-primary/40 bg-primary/5" : "border-border bg-card"
              }`}
            >
              <div className="flex items-center gap-2 mb-3">
                <Badge className={`${groupTypeColors[group.type]} text-xs`}>{groupTypeLabels[group.type]}</Badge>
                <h3 className="font-medium text-sm text-foreground">{group.name}</h3>
                <span className="text-xs text-muted-foreground ml-auto">
                  {members.length}{members.length !== totalMembers ? `/${totalMembers}` : ""}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {members.map(person => (
                  <PersonChip
                    key={person.id}
                    person={person}
                    onUpdatePerson={onUpdatePerson}
                    draggable
                    onDragStart={() => setDragPersonId(person.id)}
                    onDragEnd={() => setDragPersonId(null)}
                  />
                ))}
                {members.length === 0 && (
                  <p className="text-xs text-muted-foreground italic py-2">
                    {totalMembers > 0 ? "No members match filters" : "Drop people here"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unassigned */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
          if (pid) handleDropUnassigned(pid);
        }}
        className={`rounded-lg border-2 border-dashed p-4 transition-colors ${
          dragPersonId ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Unassigned ({unassigned.length})
          </h3>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">Sort:</span>
            <button
              onClick={() => { if (sortField === "name") setSortAsc(!sortAsc); else { setSortField("name"); setSortAsc(true); } }}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${sortField === "name" ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground"}`}
            >
              Name {sortField === "name" && (sortAsc ? "↑" : "↓")}
            </button>
            <button
              onClick={() => { if (sortField === "engagement") setSortAsc(!sortAsc); else { setSortField("engagement"); setSortAsc(true); } }}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${sortField === "engagement" ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground"}`}
            >
              Level {sortField === "engagement" && (sortAsc ? "↑" : "↓")}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {unassigned.map(p => (
            <PersonChip
              key={p.id}
              person={p}
              onUpdatePerson={onUpdatePerson}
              draggable
              onDragStart={() => setDragPersonId(p.id)}
              onDragEnd={() => setDragPersonId(null)}
            />
          ))}
          {unassigned.length === 0 && (
            <p className="text-xs text-muted-foreground italic py-2">Everyone is assigned!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupsView;
