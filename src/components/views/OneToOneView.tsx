import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, X, LayoutGrid, Share2, ChevronUp, ChevronDown } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PersonChip from "@/components/PersonChip";
import {
  type Person, type OneToOne, type MeetingFrequency, type EngagementLevel,
  frequencyColors, frequencyLabels, engagementLabels, engagementColors,
  engagementDotColors, predefinedTags, ministries,
} from "@/data/mockData";

interface Props {
  people: Person[];
  oneToOnes: OneToOne[];
  onUpdateOneToOnes: (o: OneToOne[]) => void;
  onUpdatePerson: (p: Person) => void;
}

const OneToOneView = ({ people, oneToOnes, onUpdateOneToOnes, onUpdatePerson }: Props) => {
  const [viewMode, setViewMode] = useState<"panels" | "mesh">("panels");
  const [dragPersonId, setDragPersonId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterEngagement, setFilterEngagement] = useState("all");
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterMinistry, setFilterMinistry] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<"name" | "engagement">("name");
  const [sortAsc, setSortAsc] = useState(true);

  const personMap = useMemo(() => new Map(people.map(p => [p.id, p])), [people]);

  const matchesPerson = useCallback((p: Person) => {
    const s = search.toLowerCase();
    const matchesSearch = !s || p.name.toLowerCase().includes(s) || p.tags.some(t => t.toLowerCase().includes(s));
    const matchesEng = filterEngagement === "all" || p.engagement === filterEngagement;
    const matchesTag = filterTags.length === 0 || filterTags.every(t => p.tags.includes(t));
    const matchesMin = filterMinistry === "all" || p.ministries.includes(filterMinistry);
    return matchesSearch && matchesEng && matchesTag && matchesMin;
  }, [search, filterEngagement, filterTags, filterMinistry]);

  // Build person -> connections map
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

  // Panel people: those with connections that match filter
  const panelPeople = useMemo(() => {
    return Array.from(personConnections.keys())
      .map(id => personMap.get(id))
      .filter((p): p is Person => !!p && matchesPerson(p))
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [personConnections, personMap, matchesPerson]);

  const allTagsInUse = useMemo(() => {
    const s = new Set<string>(predefinedTags);
    people.forEach(p => p.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [people]);

  const activeFilters = [filterMinistry, filterEngagement].filter(f => f !== "all").length + filterTags.length + (search ? 1 : 0);

  const toggleFilterTag = (tag: string) => {
    setFilterTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  // Stats
  const totalPairs = oneToOnes.filter(o => o.personA && o.personB).length;
  const freqCounts = useMemo(() => {
    const counts: Record<MeetingFrequency, number> = { regular: 0, infrequent: 0, rarely: 0 };
    oneToOnes.forEach(o => { if (o.personA && o.personB) counts[o.frequency]++; });
    return counts;
  }, [oneToOnes]);

  // Drop handler: create new pair or add to existing person's connections
  const handleDropOnPanel = (targetPersonId: string, droppedPersonId: string) => {
    if (targetPersonId === droppedPersonId) return;
    // Check if pair already exists
    const exists = oneToOnes.some(o =>
      (o.personA === targetPersonId && o.personB === droppedPersonId) ||
      (o.personA === droppedPersonId && o.personB === targetPersonId)
    );
    if (exists) return;
    const newPair: OneToOne = {
      id: `121-${Date.now()}`,
      personA: targetPersonId,
      personB: droppedPersonId,
      frequency: "regular",
      notes: "",
    };
    onUpdateOneToOnes([...oneToOnes, newPair]);
    setDragPersonId(null);
  };

  const handleDropNewPair = (personId: string) => {
    // If already paired, just ignore
    const newPair: OneToOne = {
      id: `121-${Date.now()}`,
      personA: personId,
      personB: "",
      frequency: "regular",
      notes: "",
    };
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

  return (
    <div>
      {/* Stats bar */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="text-sm text-muted-foreground">
          <span className="font-medium text-foreground">{pairedIds.size}</span> people in <span className="font-medium text-foreground">{totalPairs}</span> pairs
        </div>
        <div className="flex items-center gap-2">
          {Object.entries(frequencyLabels).map(([k, v]) => (
            <Badge key={k} className={`${frequencyColors[k as MeetingFrequency]} text-xs`}>
              {v}: {freqCounts[k as MeetingFrequency]}
            </Badge>
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
                    filterTags.includes(tag) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {filterTags.includes(tag) ? "✓ " : ""}{tag}
                </button>
              ))}
            </div>
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

      {/* New pair drop zone */}
      {viewMode === "panels" && (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
            if (pid) handleDropNewPair(pid);
          }}
          className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors mb-6 ${
            dragPersonId ? "border-primary/40 bg-primary/5" : "border-border"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            {dragPersonId ? "Drop here to start a new connection" : "Drag someone here to start a new 1-to-1"}
          </p>
        </div>
      )}

      {/* Unassigned pool */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
          if (pid) handleUnpairFromAll(pid);
        }}
        className={`rounded-lg border-2 border-dashed p-4 transition-colors ${
          dragPersonId ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/30"
        }`}
      >
        <div className="flex items-center gap-3 mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Not in any 1-to-1 ({unassigned.length})
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
              compact
              onDragStart={() => setDragPersonId(p.id)}
              onDragEnd={() => setDragPersonId(null)}
            />
          ))}
          {unassigned.length === 0 && (
            <p className="text-xs text-muted-foreground italic">Everyone is paired!</p>
          )}
        </div>
      </div>
    </div>
  );
};

// ===== Panels View =====
function PanelsView({
  panelPeople, personConnections, personMap, dragPersonId, setDragPersonId,
  onDropOnPanel, onRemoveConnection, onChangeFrequency, onUpdatePerson,
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
              dragPersonId && dragPersonId !== person.id
                ? "border-primary/40 border-dashed bg-primary/5"
                : "border-border bg-card"
            }`}
          >
            {/* Person header */}
            <div className="flex items-center gap-2 mb-3">
              <PersonChip
                person={person}
                onUpdatePerson={onUpdatePerson}
                draggable
                onDragStart={() => setDragPersonId(person.id)}
                onDragEnd={() => setDragPersonId(null)}
              />
              <span className="text-xs text-muted-foreground ml-auto">{connections.length} pairs</span>
            </div>

            {/* Connections list */}
            <div className="space-y-1.5">
              {connections.map(conn => {
                const partner = personMap.get(conn.partnerId);
                if (!partner) return null;
                return (
                  <div key={conn.pairId} className="flex items-center gap-2 pl-2 py-1 rounded hover:bg-muted/50 group">
                    <span className="text-xs text-muted-foreground">↔</span>
                    <PersonChip
                      person={partner}
                      onUpdatePerson={onUpdatePerson}
                      compact
                      draggable
                      onDragStart={() => setDragPersonId(partner.id)}
                      onDragEnd={() => setDragPersonId(null)}
                    />
                    <Badge className={`${frequencyColors[conn.frequency]} text-[10px] px-1.5 py-0 ml-auto shrink-0`}>
                      {frequencyLabels[conn.frequency]}
                    </Badge>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Select value={conn.frequency} onValueChange={(v) => onChangeFrequency(conn.pairId, v as MeetingFrequency)}>
                        <SelectTrigger className="h-6 w-6 p-0 border-0 bg-transparent [&>svg]:hidden">
                          <span className="text-[10px]">✎</span>
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(frequencyLabels).map(([k, v]) => (
                            <SelectItem key={k} value={k}>{v}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <button
                        onClick={() => onRemoveConnection(conn.pairId)}
                        className="text-muted-foreground hover:text-destructive p-0.5"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {connections.length === 0 && (
              <p className="text-xs text-muted-foreground italic py-1">Drop someone here to pair</p>
            )}
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

  // Layout nodes in a circle
  const nodes = panelPeople;
  const width = 800;
  const height = 500;

  useEffect(() => {
    if (nodePositions.size > 0) return; // don't reset if user moved nodes
    const positions = new Map<string, { x: number; y: number }>();
    const cx = width / 2;
    const cy = height / 2;
    const rx = width / 2 - 60;
    const ry = height / 2 - 40;
    nodes.forEach((person, i) => {
      const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
      positions.set(person.id, {
        x: cx + rx * Math.cos(angle),
        y: cy + ry * Math.sin(angle),
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

  const handleMouseUp = () => {
    setDraggingNode(null);
  };

  // Edges
  const edges = oneToOnes.filter(o => o.personA && o.personB && nodePositions.has(o.personA) && nodePositions.has(o.personB));

  const connectedToHovered = useMemo(() => {
    if (!hoveredNode) return new Set<string>();
    const conns = personConnections.get(hoveredNode) || [];
    return new Set(conns.map(c => c.partnerId));
  }, [hoveredNode, personConnections]);

  return (
    <div className="bg-card rounded-lg border border-border mb-6 overflow-hidden">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto"
        style={{ minHeight: 300, maxHeight: 500 }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Edges */}
        {edges.map(o => {
          const a = nodePositions.get(o.personA);
          const b = nodePositions.get(o.personB);
          if (!a || !b) return null;
          const style = frequencyStroke[o.frequency];
          const isHighlighted = hoveredNode && (o.personA === hoveredNode || o.personB === hoveredNode);
          const isDimmed = hoveredNode && !isHighlighted;
          return (
            <line
              key={o.id}
              x1={a.x} y1={a.y} x2={b.x} y2={b.y}
              stroke={style.color}
              strokeWidth={isHighlighted ? style.width + 1 : style.width}
              strokeDasharray={style.dash}
              opacity={isDimmed ? 0.15 : 1}
            />
          );
        })}

        {/* Nodes */}
        {nodes.map(person => {
          const pos = nodePositions.get(person.id);
          if (!pos) return null;
          const isHovered = hoveredNode === person.id;
          const isConnected = connectedToHovered.has(person.id);
          const isDimmed = hoveredNode && !isHovered && !isConnected;
          const conns = personConnections.get(person.id) || [];

          const dotColorMap: Record<string, string> = {
            leader: "hsl(var(--primary))",
            partner: "hsl(200, 40%, 70%)",
            regular: "hsl(var(--success))",
            infrequent: "hsl(var(--warm-gold))",
            missing: "hsl(var(--destructive))",
          };

          return (
            <g
              key={person.id}
              onMouseEnter={() => setHoveredNode(person.id)}
              onMouseLeave={() => setHoveredNode(null)}
              onMouseDown={(e) => handleMouseDown(e, person.id)}
              style={{ cursor: draggingNode === person.id ? "grabbing" : "grab", opacity: isDimmed ? 0.25 : 1 }}
            >
              <circle cx={pos.x} cy={pos.y} r={isHovered ? 20 : 16} fill={dotColorMap[person.engagement] || "hsl(var(--muted))"} opacity={0.2} />
              <circle cx={pos.x} cy={pos.y} r={isHovered ? 12 : 8} fill={dotColorMap[person.engagement] || "hsl(var(--muted))"} stroke="hsl(var(--background))" strokeWidth={2} />
              <text
                x={pos.x}
                y={pos.y + (isHovered ? 28 : 22)}
                textAnchor="middle"
                className="text-[10px] fill-foreground font-medium select-none pointer-events-none"
              >
                {person.name}
              </text>
              {isHovered && (
                <text
                  x={pos.x}
                  y={pos.y + 38}
                  textAnchor="middle"
                  className="text-[9px] fill-muted-foreground select-none pointer-events-none"
                >
                  {conns.length} connection{conns.length !== 1 ? "s" : ""}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {/* Mesh legend */}
      <div className="flex items-center gap-4 px-4 py-2 border-t border-border bg-muted/30 text-xs text-muted-foreground">
        <span>Drag nodes to rearrange</span>
        <div className="flex items-center gap-1">
          <span className="w-6 h-0.5 bg-success inline-block" /> Regular
        </div>
        <div className="flex items-center gap-1">
          <span className="w-6 h-0.5 bg-warm-gold inline-block border-dashed" style={{ borderTop: "2px dashed" }} /> Infrequent
        </div>
        <div className="flex items-center gap-1">
          <span className="w-6 h-0.5 bg-muted-foreground inline-block" style={{ borderTop: "2px dotted" }} /> Rarely
        </div>
      </div>
    </div>
  );
}

export default OneToOneView;
