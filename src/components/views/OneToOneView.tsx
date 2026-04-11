import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import {
  type Person, type OneToOne, type MeetingFrequency,
  frequencyColors, frequencyLabels,
} from "@/data/mockData";

interface Props {
  people: Person[];
  oneToOnes: OneToOne[];
}

interface NodePos {
  id: string;
  x: number;
  y: number;
}

const FREQ_STROKE: Record<MeetingFrequency, string> = {
  regular: "hsl(145, 50%, 42%)",
  infrequent: "hsl(45, 70%, 50%)",
  rarely: "hsl(220, 10%, 70%)",
};

const OneToOneView = ({ people, oneToOnes }: Props) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const personMap = useMemo(() => new Map(people.map(p => [p.id, p])), [people]);

  // Find all people involved in 121s
  const involvedIds = useMemo(() => {
    const ids = new Set<string>();
    oneToOnes.forEach(o => { ids.add(o.personA); ids.add(o.personB); });
    return Array.from(ids);
  }, [oneToOnes]);

  // Layout: place nodes in a circle
  const nodePositions = useMemo((): NodePos[] => {
    const count = involvedIds.length;
    const cx = 400, cy = 300;
    const radius = Math.min(250, Math.max(150, count * 20));
    return involvedIds.map((id, i) => {
      const angle = (2 * Math.PI * i) / count - Math.PI / 2;
      return { id, x: cx + radius * Math.cos(angle), y: cy + radius * Math.sin(angle) };
    });
  }, [involvedIds]);

  const posMap = useMemo(() => new Map(nodePositions.map(n => [n.id, n])), [nodePositions]);

  // Highlighted connections
  const isHighlighted = useCallback((o: OneToOne) => {
    if (!hoveredNode) return true;
    return o.personA === hoveredNode || o.personB === hoveredNode;
  }, [hoveredNode]);

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="text-sm text-muted-foreground">Frequency:</span>
        {Object.entries(frequencyLabels).map(([k, v]) => (
          <Badge key={k} className={`${frequencyColors[k as MeetingFrequency]} text-xs`}>{v}</Badge>
        ))}
        <span className="text-xs text-muted-foreground ml-auto">Hover over a person to highlight their connections</span>
      </div>

      {/* Graph */}
      <div ref={containerRef} className="bg-card rounded-lg border border-border overflow-auto">
        <svg viewBox="0 0 800 600" className="w-full h-auto min-h-[500px]">
          {/* Edges */}
          {oneToOnes.map(o => {
            const a = posMap.get(o.personA);
            const b = posMap.get(o.personB);
            if (!a || !b) return null;
            const highlighted = isHighlighted(o);
            return (
              <line
                key={o.id}
                x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                stroke={FREQ_STROKE[o.frequency]}
                strokeWidth={highlighted ? 3 : 1.5}
                opacity={highlighted ? 1 : 0.15}
                strokeDasharray={o.frequency === "rarely" ? "6,4" : o.frequency === "infrequent" ? "4,2" : "none"}
              />
            );
          })}

          {/* Edge labels */}
          {oneToOnes.map(o => {
            const a = posMap.get(o.personA);
            const b = posMap.get(o.personB);
            if (!a || !b || !isHighlighted(o)) return null;
            const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2;
            return (
              <text key={`label-${o.id}`} x={mx} y={my - 6} textAnchor="middle" fontSize={10} fill="hsl(220, 10%, 45%)" className="select-none pointer-events-none">
                {frequencyLabels[o.frequency]}
              </text>
            );
          })}

          {/* Nodes */}
          {nodePositions.map(node => {
            const person = personMap.get(node.id);
            if (!person) return null;
            const isHovered = hoveredNode === node.id;
            const isConnected = hoveredNode ? oneToOnes.some(o =>
              (o.personA === hoveredNode && o.personB === node.id) ||
              (o.personB === hoveredNode && o.personA === node.id)
            ) : false;
            const dimmed = hoveredNode && !isHovered && !isConnected;
            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                className="cursor-pointer"
                opacity={dimmed ? 0.2 : 1}
              >
                <circle r={isHovered ? 24 : 20} fill="hsl(220, 35%, 25%)" opacity={0.9} />
                <text y={1} textAnchor="middle" fontSize={10} fill="hsl(40, 30%, 97%)" className="select-none pointer-events-none font-medium">
                  {person.name.split(" ")[0].slice(0, 6)}
                </text>
                <text y={36} textAnchor="middle" fontSize={11} fill="hsl(220, 30%, 15%)" className="select-none pointer-events-none">
                  {person.name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Summary list */}
      <div className="mt-6 bg-card rounded-lg border border-border p-4">
        <h3 className="text-sm font-medium text-foreground mb-3">All 1-to-1 Relationships</h3>
        <div className="space-y-2">
          {oneToOnes.map(o => {
            const a = personMap.get(o.personA);
            const b = personMap.get(o.personB);
            return (
              <div key={o.id} className="flex items-center gap-3 text-sm">
                <span className="font-medium min-w-[100px]">{a?.name || "?"}</span>
                <span className="text-muted-foreground">↔</span>
                <span className="font-medium min-w-[100px]">{b?.name || "?"}</span>
                <Badge className={`${frequencyColors[o.frequency]} text-xs`}>{frequencyLabels[o.frequency]}</Badge>
                {o.notes && <span className="text-xs text-muted-foreground">{o.notes}</span>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default OneToOneView;
