import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, Plus, Trash2, Home } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import PersonChip from "@/components/PersonChip";
import {
  type Person, type Household, HOUSEHOLD_PALETTE,
  engagementLabels,
} from "@/data/mockData";

interface Props {
  people: Person[];
  households: Household[];
  onUpdateHouseholds: (households: Household[]) => void;
  onUpdatePerson: (person: Person) => void;
  tags: string[];
  ministries: string[];
}

function MultiSelectFilter({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (s: string[]) => void;
}) {
  const sorted = [...options].sort((a, b) => a.localeCompare(b));
  const allSelected = sorted.length > 0 && selected.length === sorted.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-1.5 text-sm">
          {label}
          {selected.length > 0 && <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-xs">{selected.length}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 max-h-60 overflow-y-auto" align="start">
        <button onClick={() => onChange(allSelected ? [] : [...sorted])} className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-muted font-medium text-primary">
          {allSelected ? "Deselect All" : "Select All"}
        </button>
        <div className="border-t border-border my-1" />
        {sorted.map(opt => (
          <label key={opt} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm">
            <Checkbox checked={selected.includes(opt)} onCheckedChange={() => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])} />
            {opt}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

const HouseholdsView = ({ people, households, onUpdateHouseholds, onUpdatePerson, tags, ministries }: Props) => {
  const [dragPersonId, setDragPersonId] = useState<string | null>(null);
  const [ctrlHeld, setCtrlHeld] = useState(false);
  const [newHouseholdName, setNewHouseholdName] = useState("");
  const [search, setSearch] = useState("");
  const [filterEngagement, setFilterEngagement] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterMinistries, setFilterMinistries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => { if (e.key === "Control" || e.key === "Meta") setCtrlHeld(true); };
    const up = (e: KeyboardEvent) => { if (e.key === "Control" || e.key === "Meta") setCtrlHeld(false); };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    return () => { window.removeEventListener("keydown", down); window.removeEventListener("keyup", up); };
  }, []);

  const personMap = useMemo(() => new Map(people.map(p => [p.id, p])), [people]);

  const householdMemberSet = useMemo(() => {
    const set = new Set<string>();
    households.forEach(hh => hh.members.forEach(m => set.add(m)));
    return set;
  }, [households]);

  const matchesPerson = (p: Person) => {
    const s = search.toLowerCase();
    const matchesSearch = !s || p.name.toLowerCase().includes(s) || p.tags.some(t => t.toLowerCase().includes(s));
    const matchesEng = filterEngagement.length === 0 || filterEngagement.includes(p.engagement);
    const matchesTag = filterTags.length === 0 || filterTags.every(t => p.tags.includes(t));
    const matchesMin = filterMinistries.length === 0 || filterMinistries.some(m => p.ministries.includes(m));
    return matchesSearch && matchesEng && matchesTag && matchesMin;
  };

  const unassigned = useMemo(() =>
    people.filter(p => !householdMemberSet.has(p.id) && matchesPerson(p)).sort((a, b) => a.name.localeCompare(b.name)),
    [people, householdMemberSet, search, filterEngagement, filterTags, filterMinistries]
  );

  const allTagsInUse = useMemo(() => {
    const s = new Set<string>(tags);
    people.forEach(p => p.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [people, tags]);

  const activeFilters = filterEngagement.length + filterTags.length + filterMinistries.length + (search ? 1 : 0);

  const handleDrop = (hhId: string, personId: string) => {
    if (ctrlHeld) {
      onUpdateHouseholds(households.map(hh =>
        hh.id === hhId ? { ...hh, members: hh.members.filter(m => m !== personId) } : hh
      ));
    } else {
      onUpdateHouseholds(households.map(hh => {
        if (hh.id === hhId) return hh.members.includes(personId) ? hh : { ...hh, members: [...hh.members, personId] };
        return { ...hh, members: hh.members.filter(m => m !== personId) };
      }));
    }
    setDragPersonId(null);
  };

  const handleDropUnassigned = (personId: string) => {
    onUpdateHouseholds(households.map(hh => ({ ...hh, members: hh.members.filter(m => m !== personId) })));
    setDragPersonId(null);
  };

  const handleAddHousehold = () => {
    if (!newHouseholdName.trim()) return;
    onUpdateHouseholds([...households, { id: `hh-${Date.now()}`, name: newHouseholdName.trim(), members: [] }]);
    setNewHouseholdName("");
  };

  return (
    <div>
      {/* Header stats + add */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-5">
        <p className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{households.length}</span> household{households.length !== 1 ? "s" : ""} ·{" "}
          <span className="font-medium text-foreground">{householdMemberSet.size}</span> people assigned
        </p>
        <div className="flex items-center gap-2 sm:ml-auto">
          <Input
            placeholder="New household name…"
            value={newHouseholdName}
            onChange={e => setNewHouseholdName(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleAddHousehold()}
            className="h-9 w-56 text-sm"
          />
          <Button size="sm" onClick={handleAddHousehold} disabled={!newHouseholdName.trim()} className="gap-1.5 shrink-0">
            <Plus size={14} /> Add
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search people…" value={search} onChange={e => setSearch(e.target.value)} className="pl-9 h-10" />
        </div>
        <MultiSelectFilter label="Serving In" options={ministries} selected={filterMinistries} onChange={setFilterMinistries} />
        <MultiSelectFilter label="Church Engagement" options={Object.keys(engagementLabels)} selected={filterEngagement} onChange={setFilterEngagement} />
        <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className="gap-2 h-10">
          <Filter size={16} /> Tags
          {filterTags.length > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">{filterTags.length}</Badge>}
        </Button>
        {activeFilters > 0 && (
          <Button variant="ghost" size="sm" className="h-10 gap-1 text-muted-foreground" onClick={() => { setFilterEngagement([]); setFilterMinistries([]); setFilterTags([]); setSearch(""); }}>
            <X size={14} /> Clear
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-card rounded-lg border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Filter by tags:</p>
          <div className="flex flex-wrap gap-1.5">
            {allTagsInUse.map(tag => (
              <button key={tag} onClick={() => setFilterTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${filterTags.includes(tag) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"}`}
              >{filterTags.includes(tag) ? "✓ " : ""}{tag}</button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-4">
        Drag people onto a household to assign · {ctrlHeld
          ? <span className="text-primary font-medium">Ctrl held — drop to remove from household</span>
          : "Hold Ctrl/Cmd and drag to remove · Drop on Unassigned to unassign"}
      </p>

      {/* Household cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {households.map((hh, idx) => {
          const palette = HOUSEHOLD_PALETTE[idx % HOUSEHOLD_PALETTE.length];
          const members = hh.members.map(m => personMap.get(m)).filter((p): p is Person => !!p && matchesPerson(p));
          return (
            <div
              key={hh.id}
              onDragOver={e => e.preventDefault()}
              onDrop={e => {
                e.preventDefault();
                const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
                if (pid) handleDrop(hh.id, pid);
              }}
              className={`rounded-lg border-2 transition-colors overflow-hidden ${
                dragPersonId
                  ? ctrlHeld
                    ? "border-destructive/40 border-dashed bg-destructive/5"
                    : "border-primary/40 border-dashed bg-primary/5"
                  : "border-border bg-card"
              }`}
            >
              <div className="px-4 py-2.5 flex items-center gap-2 border-b border-border" style={{ backgroundColor: palette.row }}>
                <Home size={13} className="text-muted-foreground shrink-0" />
                <span className="font-medium text-sm flex-1 truncate">{hh.name}</span>
                <span className="text-xs text-muted-foreground shrink-0">{hh.members.length}</span>
                <button onClick={() => onUpdateHouseholds(households.filter(h => h.id !== hh.id))}
                  className="text-muted-foreground hover:text-destructive p-0.5 shrink-0" title="Delete household">
                  <Trash2 size={13} />
                </button>
              </div>
              <div className="p-3 flex flex-wrap gap-1.5 min-h-[56px]">
                {members.map(person => (
                  <PersonChip key={person.id} person={person} onUpdatePerson={onUpdatePerson} draggable compact tags={tags}
                    onDragStart={() => setDragPersonId(person.id)} onDragEnd={() => setDragPersonId(null)} />
                ))}
                {members.length === 0 && (
                  <p className="text-xs text-muted-foreground italic w-full text-center pt-3">Drop people here</p>
                )}
              </div>
            </div>
          );
        })}

        {households.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground">
            <Home size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No households yet — add one above</p>
          </div>
        )}
      </div>

      {/* Unassigned pool — sticky at bottom */}
      <div
        className="sticky bottom-0 z-10 pt-2"
        onDragOver={e => e.preventDefault()}
        onDrop={e => {
          e.preventDefault();
          const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
          if (pid) handleDropUnassigned(pid);
        }}
      >
        <div className={`rounded-lg border-2 border-dashed p-4 transition-colors shadow-lg ${
          dragPersonId ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/30"
        }`}>
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Not in any household ({unassigned.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-36 overflow-y-auto">
            {unassigned.map(p => (
              <PersonChip key={p.id} person={p} onUpdatePerson={onUpdatePerson} draggable compact tags={tags}
                onDragStart={() => setDragPersonId(p.id)} onDragEnd={() => setDragPersonId(null)} />
            ))}
            {unassigned.length === 0 && <p className="text-xs text-muted-foreground italic">Everyone is in a household!</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdsView;
