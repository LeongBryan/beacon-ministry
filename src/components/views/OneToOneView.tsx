import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, LayoutGrid, Share2, Trash2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import PersonChip from "@/components/PersonChip";
import {
  type Person, type OneToOne, type MeetingFrequency, type Group, type GroupType,
  frequencyColors, frequencyLabels, engagementLabels,
} from "@/data/mockData";

interface Props {
  people: Person[];
  oneToOnes: OneToOne[];
  onUpdateOneToOnes: (o: OneToOne[]) => void;
  onUpdatePerson: (p: Person) => void;
  tags: string[];
  ministries: string[];
  groups: Group[];
  groupTypes: GroupType[];
}

function MultiSelectFilter({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (sel: string[]) => void;
}) {
  const allSelected = options.length > 0 && selected.length === options.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-1.5 text-sm">
          {label}
          {selected.length > 0 && <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-xs">{selected.length}</Badge>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 max-h-60 overflow-y-auto" align="start">
        <button onClick={() => onChange(allSelected ? [] : [...options])} className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-muted font-medium text-primary">
          {allSelected ? "Deselect All" : "Select All"}
        </button>
        <div className="border-t border-border my-1" />
        {options.map(opt => (
          <label key={opt} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm">
            <Checkbox checked={selected.includes(opt)} onCheckedChange={() => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])} />
            {opt}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

const OneToOneView = ({ people, oneToOnes, onUpdateOneToOnes, onUpdatePerson, tags, ministries, groups, groupTypes }: Props) => {
  const [viewMode, setViewMode] = useState<"panels" | "mesh">("panels");
  const [dragPersonId, setDragPersonId] = useState<string | null>(null);

  const [search, setSearch] = useState("");
  const [filterEngagement, setFilterEngagement] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterMinistries, setFilterMinistries] = useState<string[]>([]);
  const [filterSmallGroups, setFilterSmallGroups] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<"name" | "engagement">("name");
  const [sortAsc, setSortAsc] = useState(true);

  const personMap = useMemo(() => new Map(people.map(p => [p.id, p])), [people]);

  const allGroupNames = useMemo(() => [...new Set(groups.map(g => g.name))].sort(), [groups]);

  const personGroupMap = useMemo(() => {
    const map = new Map<string, string[]>();
    for (const g of groups) {
      for (const mid of g.members) {
        if (!map.has(mid)) map.set(mid, []);
        map.get(mid)!.push(g.name);
      }
    }
    return map;
  }, [groups]);

  const matchesPerson = useCallback((p: Person) => {
    const s = search.toLowerCase();
    const matchesSearch = !s || p.name.toLowerCase().includes(s) || p.tags.some(t => t.toLowerCase().includes(s));
    const matchesEng = filterEngagement.length === 0 || filterEngagement.includes(p.engagement);
    const matchesTag = filterTags.length === 0 || filterTags.every(t => p.tags.includes(t));
    const matchesMin = filterMinistries.length === 0 || filterMinistries.some(m => p.ministries.includes(m));
    const pGroups = personGroupMap.get(p.id) || [];
    const matchesGroup = filterSmallGroups.length === 0 || filterSmallGroups.some(g => pGroups.includes(g));
    return matchesSearch && matchesEng && matchesTag && matchesMin && matchesGroup;
  }, [search, filterEngagement, filterTags, filterMinistries, filterSmallGroups, personGroupMap]);

  const personConnections = useMemo(() => {
    const map = new Map<string, { partnerId: string; pairId: string; frequency: MeetingFrequency }[]>();
    oneToOnes.forEach(o => {
      if (o.personA) {
        if (!map.has(o.personA)) map.set(o.personA, []);
        if (o.personB) map.get(o.personA)!.push({ partnerId: o.personB, pairId: o.id, frequency: o.frequency });
      }
      if (o.personB) {
        if (!map.has(o.personB)) map.set(o.personB, []);
        if (o.personA) map.get(o.personB)!.push({ partnerId: o.personA, pairId: o.id, frequency: o.frequency });
      }
    });
    return map;
  }, [oneToOnes]);

  const pairedIds = useMemo(() => new Set(personConnections.keys()), [personConnections]);

  const unassigned = useMemo(() => {
    let result = people.filter(p => !pairedIds.has(p.id) && matchesPerson(p));
    result.sort((a, b) => {
      const cmp = sortField === "name" ? a.name.localeCompare(b.name) : a.engagement.localeCompare(b.engagement);
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [people, pairedIds, matchesPerson, sortField, sortAsc]);

  const panelPeople = useMemo(() => {
    return Array.from(personConnections.keys())
      .map(id => personMap.get(id))
      .filter((p): p is Person => !!p && matchesPerson(p))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [personConnections, personMap, matchesPerson]);

  const allTagsInUse = useMemo(() => {
    const s = new Set<string>(tags);
    people.forEach(p => p.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [people, tags]);

  const activeFilters = filterEngagement.length + filterTags.length + filterMinistries.length + filterSmallGroups.length + (search ? 1 : 0);

  const toggleFilterTag = (tag: string) => {
    setFilterTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const totalPairs = oneToOnes.filter(o => o.personA && o.personB).length;
  const freqCounts = useMemo(() => {
    const counts: Record<MeetingFrequency, number> = { regular: 0, infrequent: 0, rarely: 0 };
    oneToOnes.forEach(o => { if (o.personA && o.personB) counts[o.frequency]++; });
    return counts;
  }, [oneToOnes]);

  const handleDropOnPanel = (targetPersonId: string, droppedPersonId: string) => {
    if (targetPersonId === droppedPersonId) return;
    const exists = oneToOnes.some(o =>
      (o.personA === targetPersonId && o.personB === droppedPersonId) ||
      (o.personA === droppedPersonId && o.personB === targetPersonId)
    );
    if (exists) return;
    const newPair: OneToOne = { id: `121-${Date.now()}`, personA: targetPersonId, personB: droppedPersonId, frequency: "regular", notes: "" };
    onUpdateOneToOnes([...oneToOnes, newPair]);
    setDragPersonId(null);
  };

  const handleDropNewPair = (personId: string) => {
    const newPair: OneToOne = { id: `121-${Date.now()}`, personA: personId, personB: "", frequency: "regular", notes: "" };
    onUpdateOneToOnes([...oneToOnes, newPair]);
    setDragPersonId(null);
  };

  const handleRemoveConnection = (pairId: string) => {
    onUpdateOneToOnes(oneToOnes.filter(o => o.id !== pairId));
  };

  const handleChangeFrequency = (pairId: string, freq: MeetingFrequency) => {
    onUpdateOneToOnes(oneToOnes.map(o => o.id === pairId ? { ...o, frequency: freq } : o));
  };

  const handleUnpairFromAll = (personId: string) => {
    onUpdateOneToOnes(oneToOnes.filter(o => o.personA !== personId && o.personB !== personId));
    setDragPersonId(null);
  };

  const handleDeletePanel = (personId: string) => {
    onUpdateOneToOnes(oneToOnes.filter(o => o.personA !== personId && o.personB !== personId));
  };

  return (
    <div>
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{pairedIds.size}</span> people in <span className="font-medium text-foreground">{totalPairs}</span> pairs
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(frequencyLabels).map(([k, v]) => (
            <Badge key={k} className={`${frequencyColors[k as MeetingFrequency]} text-xs`}>{v}: {freqCounts[k as MeetingFrequency]}</Badge>
          ))}
        </div>
        <div className="flex gap-1 ml-auto bg-muted rounded-lg p-1">
          <Button variant={viewMode === "panels" ? "default" : "ghost"} size="sm" className="h-8 px-3 gap-1.5" onClick={() => setViewMode("panels")}>
            <LayoutGrid size={14} /> Panels
          </Button>
          <Button variant={viewMode === "mesh" ? "default" : "ghost"} size="sm" className="h-8 px-3 gap-1.5" onClick={() => setViewMode("mesh")}>
            <Share2 size={14} /> Mesh
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
        <MultiSelectFilter label="Small Group" options={allGroupNames} selected={filterSmallGroups} onChange={setFilterSmallGroups} />
        <MultiSelectFilter label="Church Engagement" options={Object.keys(engagementLabels)} selected={filterEngagement} onChange={setFilterEngagement} />
        <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className="gap-2 h-10">
          <Filter size={16} /> Tags
          {filterTags.length > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">{filterTags.length}</Badge>}
        </Button>
        {activeFilters > 0 && (
          <Button variant="ghost" size="sm" className="h-10 gap-1 text-muted-foreground" onClick={() => { setFilterEngagement([]); setFilterMinistries([]); setFilterSmallGroups([]); setFilterTags([]); setSearch(""); }}>
            <X size={14} /> Clear all
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-card rounded-lg border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Filter by tags:</p>
          <div className="flex flex-wrap gap-1.5">
            {allTagsInUse.map(tag => (
              <button key={tag} onClick={() => toggleFilterTag(tag)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${filterTags.includes(tag) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"}`}
              >{filterTags.includes(tag) ? "✓ " : ""}{tag}</button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-muted-foreground mb-4">
        {viewMode === "panels"
          ? "Drag people from Unassigned into a person's box to create a 1-to-1 pair · Click chips to edit"
          : "Hover over nodes to see connections · Use Panels view for drag-and-drop management"}
      </p>

      {viewMode === "panels" && (
        <PanelsView
          panelPeople={panelPeople}
          personConnections={personConnections}
          personMap={personMap}
          dragPersonId={dragPersonId}
          setDragPersonId={setDragPersonId}
          onDropOnPanel={handleDropOnPanel}
          onRemoveConnection={handleRemoveConnection}
          onChangeFrequency={handleChangeFrequency}
          onUpdatePerson={onUpdatePerson}
          onDeletePanel={handleDeletePanel}
          tags={tags}
        />
      )}

      {viewMode === "mesh" && (
        <MeshView
          people={people}
          oneToOnes={oneToOnes}
          personMap={personMap}
          panelPeople={panelPeople}
          personConnections={personConnections}
        />
      )}

      {viewMode === "panels" && (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={(e) => { e.preventDefault(); const pid = e.dataTransfer.getData("text/plain") || dragPersonId; if (pid) handleDropNewPair(pid); }}
          className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors mb-6 ${dragPersonId ? "border-primary/40 bg-primary/5" : "border-border"}`}
        >
          <p className="text-sm text-muted-foreground">{dragPersonId ? "Drop here to start a new connection" : "Drag someone here to start a new 1-to-1"}</p>
        </div>
      )}

      {/* Unassigned pool */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const pid = e.dataTransfer.getData("text/plain") || dragPersonId; if (pid) handleUnpairFromAll(pid); }}
        className={`rounded-lg border-2 border-dashed p-4 transition-colors ${dragPersonId ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/30"}`}
      >
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">Not in any 1-to-1 ({unassigned.length})</h3>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-xs text-muted-foreground">Sort:</span>
            <button onClick={() => { if (sortField === "name") setSortAsc(!sortAsc); else { setSortField("name"); setSortAsc(true); } }}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${sortField === "name" ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground"}`}
            >Name {sortField === "name" && (sortAsc ? "↑" : "↓")}</button>
            <button onClick={() => { if (sortField === "engagement") setSortAsc(!sortAsc); else { setSortField("engagement"); setSortAsc(true); } }}
              className={`text-xs px-2 py-0.5 rounded border transition-colors ${sortField === "engagement" ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground"}`}
            >Level {sortField === "engagement" && (sortAsc ? "↑" : "↓")}</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {unassigned.map(p => (
            <PersonChip key={p.id} person={p} onUpdatePerson={onUpdatePerson} draggable compact tags={tags}
              onDragStart={() => setDragPersonId(p.id)} onDragEnd={() => setDragPersonId(null)} />
          ))}
          {unassigned.length === 0 && <p className="text-xs text-muted-foreground italic">Everyone is paired!</p>}
        </div>
      </div>
    </div>
  );
};

// ===== Panels View =====
function PanelsView({
  panelPeople, personConnections, personMap, dragPersonId, setDragPersonId,
  onDropOnPanel, onRemoveConnection, onChangeFrequency, onUpdatePerson, onDeletePanel, tags,
}: {
  panelPeople: Person[];
  personConnections: Map<string, { partnerId: string; pairId: string; frequency: MeetingFrequency }[]>;
  personMap: Map<string, Person>;
  dragPersonId: string | null;
  setDragPersonId: (id: string | null) => void;
  onDropOnPanel: (targetId: string, droppedId: string) => void;
  onRemoveConnection: (pairId: string) => void;
  onChangeFrequency: (pairId: string, freq: MeetingFrequency) => void;
  onUpdatePerson: (p: Person) => void;
  onDeletePanel: (personId: string) => void;
  tags: string[];
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
      {panelPeople.map(person => {
        const connections = personConnections.get(person.id) || [];
        return (
          <div
            key={person.id}
            onDragOver={e => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
              if (pid && pid !== person.id) onDropOnPanel(person.id, pid);
            }}
            className={`rounded-lg border-2 p-4 transition-colors ${
              dragPersonId && dragPersonId !== person.id ? "border-primary/40 border-dashed bg-primary/5" : "border-border bg-card"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <PersonChip person={person} onUpdatePerson={onUpdatePerson} draggable tags={tags}
                onDragStart={() => setDragPersonId(person.id)} onDragEnd={() => setDragPersonId(null)} />
              <span className="text-xs text-muted-foreground ml-auto">{connections.length} pairs</span>
              <button onClick={() => onDeletePanel(person.id)} className="text-muted-foreground hover:text-destructive p-0.5" title="Remove all connections">
                <Trash2 size={14} />
              </button>
            </div>
            <div className="space-y-1.5">
              {connections.map(conn => {
                const partner = personMap.get(conn.partnerId);
                if (!partner) return null;
                return (
                  <div key={conn.pairId} className="flex items-center gap-2 pl-2 py-1 rounded hover:bg-muted/50 group">
                    <span className="text-xs text-muted-foreground">↔</span>
                    <PersonChip person={partner} onUpdatePerson={onUpdatePerson} compact draggable tags={tags}
                      onDragStart={() => setDragPersonId(partner.id)} onDragEnd={() => setDragPersonId(null)} />
                    <Badge className={`${frequencyColors[conn.frequency]} text-[10px] px-1.5 py-0 ml-auto shrink-0`}>{frequencyLabels[conn.frequency]}</Badge>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Select value={conn.frequency} onValueChange={(v) => onChangeFrequency(conn.pairId, v as MeetingFrequency)}>
                        <SelectTrigger className="h-6 w-6 p-0 border-0 bg-transparent [&>svg]:hidden">
                          <span className="text-[10px]">✎</span>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(frequencyLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
                        </SelectContent>
                      </Select>
                      <button onClick={() => onRemoveConnection(conn.pairId)} className="text-muted-foreground hover:text-destructive p-0.5">
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
            {connections.length === 0 && <p className="text-xs text-muted-foreground italic py-1">Drop someone here to pair</p>}
          </div>
        );
      })}
    </div>
  );
}

// ===== Mesh View (SVG node graph) =====
function MeshView({
  people, oneToOnes, personMap, panelPeople, personConnections,
}: {
  people: Person[];
  oneToOnes: OneToOne[];
  personMap: Map<string, Person>;
  panelPeople: Person[];
  personConnections: Map<string, { partnerId: string; pairId: string; frequency: MeetingFrequency }[]>;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [nodePositions, setNodePositions] = useState<Map<string, { x: number; y: number }>>(new Map());
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Sort nodes: most connected first (leftmost)
  const nodes = useMemo(() => {
    return [...panelPeople].sort((a, b) => {
      const aConns = personConnections.get(a.id)?.length || 0;
      const bConns = personConnections.get(b.id)?.length || 0;
      return bConns - aConns;
    });
  }, [panelPeople, personConnections]);

  const width = 800;
  const height = 500;

  useEffect(() => {
    // Layout: most connected at left, spread across
    const positions = new Map<string, { x: number; y: number }>();
    const rows = Math.ceil(Math.sqrt(nodes.length));
    const cols = Math.ceil(nodes.length / rows);
    const xGap = (width - 120) / Math.max(cols - 1, 1);
    const yGap = (height - 80) / Math.max(rows - 1, 1);

    nodes.forEach((person, i) => {
      const col = i % cols;
      const row = Math.floor(i / cols);
      positions.set(person.id, {
        x: 60 + col * xGap,
        y: 40 + row * yGap,
      });
    });
    setNodePositions(positions);
  }, [nodes.length]);

  const frequencyStroke: Record<MeetingFrequency, { color: string; dash: string; width: number }> = {
    regular: { color: "hsl(var(--success))", dash: "", width: 2 },
    infrequent: { color: "hsl(var(--warm-gold))", dash: "6,3", width: 1.5 },
    rarely: { color: "hsl(var(--muted-foreground))", dash: "3,3", width: 1 },
  };

  const handleMouseDown = (e: React.MouseEvent, personId: string) => {
    const pos = nodePositions.get(personId);
    if (!pos) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.getBoundingClientRect();
    dragOffset.current = { x: e.clientX - pt.left - pos.x, y: e.clientY - pt.top - pos.y };
    setDraggingNode(personId);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingNode) return;
    const svg = svgRef.current;
    if (!svg) return;
    const pt = svg.getBoundingClientRect();
    const x = e.clientX - pt.left - dragOffset.current.x;
    const y = e.clientY - pt.top - dragOffset.current.y;
    setNodePositions(prev => {
      const next = new Map(prev);
      next.set(draggingNode, { x: Math.max(30, Math.min(width - 30, x)), y: Math.max(20, Math.min(height - 20, y)) });
      return next;
    });
  };

  const handleMouseUp = () => setDraggingNode(null);

  const edges = oneToOnes.filter(o => o.personA && o.personB && nodePositions.has(o.personA) && nodePositions.has(o.personB));

  const connectedToHovered = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const conns = personConnections.get(hoveredNode) || [];
    return new Set(conns.map(c => c.partnerId));
  }, [hoveredNode, personConnections]);

  const engagementNodeColor: Record<string, string> = {
    regular: "hsl(var(--success))",
    infrequent: "hsl(var(--warm-gold))",
    missing: "hsl(var(--destructive))",
  };

  return (
    <div className="bg-card rounded-lg border border-border mb-6 overflow-hidden">
      <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto" style={{ minHeight: 300, maxHeight: 500 }}
        onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp}>
        {edges.map(o => {
          const a = nodePositions.get(o.personA);
          const b = nodePositions.get(o.personB);
          if (!a || !b) return null;
          const style = frequencyStroke[o.frequency];
          const isHighlighted = hoveredNode && (o.personA === hoveredNode || o.personB === hoveredNode);
          const isDimmed = hoveredNode && !isHighlighted;
          return (
            <line key={o.id} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={style.color} strokeWidth={isHighlighted ? style.width + 1 : style.width}
              strokeDasharray={style.dash} opacity={isDimmed ? 0.15 : 1} />
          );
        })}
        {nodes.map(person => {
          const pos = nodePositions.get(person.id);
          if (!pos) return null;
          const isHovered = hoveredNode === person.id;
          const isConnected = connectedToHovered.has(person.id);
          const isDimmed = hoveredNode && !isHovered && !isConnected;
          const conns = personConnections.get(person.id) || [];
          const fill = engagementNodeColor[person.engagement] || "hsl(var(--muted))";
          return (
            <g key={person.id}
              onMouseEnter={() => setHoveredNode(person.id)} onMouseLeave={() => setHoveredNode(null)}
              onMouseDown={(e) => handleMouseDown(e, person.id)}
              style={{ cursor: draggingNode === person.id ? "grabbing" : "grab", opacity: isDimmed ? 0.25 : 1 }}>
              <circle cx={pos.x} cy={pos.y} r={isHovered ? 20 : 16} fill={fill} opacity={0.2} />
              <circle cx={pos.x} cy={pos.y} r={isHovered ? 12 : 8} fill={fill} stroke="hsl(var(--background))" strokeWidth={2} />
              <text x={pos.x} y={pos.y + (isHovered ? 28 : 22)} textAnchor="middle"
                className="text-[10px] fill-foreground font-medium select-none pointer-events-none">{person.name}</text>
              {isHovered && (
                <text x={pos.x} y={pos.y + 38} textAnchor="middle"
                  className="text-[9px] fill-muted-foreground select-none pointer-events-none">
                  {conns.length} connection{conns.length !== 1 ? "s" : ""}
                </text>
              )}
            </g>
          );
        })}
      </svg>
      <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <span>Drag nodes to rearrange · Most connected start at top-left</span>
        <div className="flex items-center gap-1"><span className="w-6 h-0.5 bg-success inline-block" /> Regular</div>
        <div className="flex items-center gap-1"><span className="w-6 h-0.5 bg-warm-gold inline-block border-dashed" style={{ borderTop: "2px dashed" }} /> Infrequent</div>
        <div className="flex items-center gap-1"><span className="w-6 h-0.5 bg-muted-foreground inline-block" style={{ borderTop: "2px dotted" }} /> Rarely</div>
      </div>
    </div>
  );
}

export default OneToOneView;
