import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, ArrowLeftRight } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PersonChip from "@/components/PersonChip";
import {
  type Person, type OneToOne, type MeetingFrequency,
  frequencyColors, frequencyLabels,
} from "@/data/mockData";

interface Props {
  people: Person[];
  oneToOnes: OneToOne[];
  onUpdateOneToOnes: (o: OneToOne[]) => void;
  onUpdatePerson: (p: Person) => void;
}

const OneToOneView = ({ people, oneToOnes, onUpdateOneToOnes, onUpdatePerson }: Props) => {
  const [dragPersonId, setDragPersonId] = useState<string | null>(null);

  const personMap = useMemo(() => new Map(people.map(p => [p.id, p])), [people]);

  // People involved in any 121
  const pairedIds = useMemo(() => {
    const ids = new Set<string>();
    oneToOnes.forEach(o => { ids.add(o.personA); ids.add(o.personB); });
    return ids;
  }, [oneToOnes]);

  const unassigned = useMemo(() =>
    people.filter(p => !pairedIds.has(p.id)),
    [people, pairedIds]
  );

  const handleDropOnPair = (targetPairId: string, side: "A" | "B", personId: string) => {
    // Remove person from any existing pair (both sides)
    let updated = oneToOnes.map(o => {
      if (o.personA === personId) return { ...o, personA: "" };
      if (o.personB === personId) return { ...o, personB: "" };
      return o;
    });
    // Place in target
    updated = updated.map(o => {
      if (o.id === targetPairId) {
        return side === "A" ? { ...o, personA: personId } : { ...o, personB: personId };
      }
      return o;
    });
    // Clean up empty pairs
    updated = updated.filter(o => o.personA || o.personB);
    onUpdateOneToOnes(updated);
    setDragPersonId(null);
  };

  const handleDropNewPair = (personId: string) => {
    // Remove from existing pairs
    let updated = oneToOnes.map(o => {
      if (o.personA === personId) return { ...o, personA: "" };
      if (o.personB === personId) return { ...o, personB: "" };
      return o;
    }).filter(o => o.personA || o.personB);

    // Create new pair with this person on side A
    const newPair: OneToOne = {
      id: `121-${Date.now()}`,
      personA: personId,
      personB: "",
      frequency: "regular",
      notes: "",
    };
    onUpdateOneToOnes([...updated, newPair]);
    setDragPersonId(null);
  };

  const handleRemovePair = (pairId: string) => {
    onUpdateOneToOnes(oneToOnes.filter(o => o.id !== pairId));
  };

  const handleChangeFrequency = (pairId: string, freq: MeetingFrequency) => {
    onUpdateOneToOnes(oneToOnes.map(o => o.id === pairId ? { ...o, frequency: freq } : o));
  };

  const handleUnpairPerson = (pairId: string, side: "A" | "B") => {
    const updated = oneToOnes.map(o => {
      if (o.id !== pairId) return o;
      return side === "A" ? { ...o, personA: "" } : { ...o, personB: "" };
    }).filter(o => o.personA || o.personB);
    onUpdateOneToOnes(updated);
  };

  return (
    <div>
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <span className="text-sm text-muted-foreground">Frequency:</span>
        {Object.entries(frequencyLabels).map(([k, v]) => (
          <Badge key={k} className={`${frequencyColors[k as MeetingFrequency]} text-xs`}>{v}</Badge>
        ))}
      </div>
      <p className="text-xs text-muted-foreground mb-4">
        Drag people from Unassigned into pair slots · Click chips to view details & tag · Use ✕ to remove pairs
      </p>

      {/* Pairs Table */}
      <div className="space-y-2 mb-6">
        {oneToOnes.map(pair => {
          const personA = pair.personA ? personMap.get(pair.personA) : null;
          const personB = pair.personB ? personMap.get(pair.personB) : null;
          return (
            <div
              key={pair.id}
              className="flex items-center gap-3 bg-card rounded-lg border border-border p-3"
            >
              {/* Side A */}
              <DropSlot
                person={personA}
                side="A"
                pairId={pair.id}
                dragPersonId={dragPersonId}
                onDrop={handleDropOnPair}
                onUnpair={handleUnpairPerson}
                onUpdatePerson={onUpdatePerson}
                onDragStart={setDragPersonId}
                onDragEnd={() => setDragPersonId(null)}
              />

              <ArrowLeftRight size={16} className="text-muted-foreground shrink-0" />

              {/* Side B */}
              <DropSlot
                person={personB}
                side="B"
                pairId={pair.id}
                dragPersonId={dragPersonId}
                onDrop={handleDropOnPair}
                onUnpair={handleUnpairPerson}
                onUpdatePerson={onUpdatePerson}
                onDragStart={setDragPersonId}
                onDragEnd={() => setDragPersonId(null)}
              />

              {/* Frequency */}
              <Select
                value={pair.frequency}
                onValueChange={(v) => handleChangeFrequency(pair.id, v as MeetingFrequency)}
              >
                <SelectTrigger className="w-32 h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(frequencyLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Remove pair */}
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0 text-muted-foreground hover:text-destructive"
                onClick={() => handleRemovePair(pair.id)}
              >
                <X size={14} />
              </Button>
            </div>
          );
        })}

        {/* New pair drop zone */}
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={(e) => {
            e.preventDefault();
            const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
            if (pid) handleDropNewPair(pid);
          }}
          className={`rounded-lg border-2 border-dashed p-4 text-center transition-colors ${
            dragPersonId ? "border-primary/40 bg-primary/5" : "border-border"
          }`}
        >
          <p className="text-sm text-muted-foreground">
            {dragPersonId ? "Drop here to create a new pair" : "Drag someone here to start a new 1-to-1 pair"}
          </p>
        </div>
      </div>

      {/* Unassigned pool */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          // Dropping back to unassigned = remove from pairs
          const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
          if (pid) {
            const updated = oneToOnes.map(o => {
              if (o.personA === pid) return { ...o, personA: "" };
              if (o.personB === pid) return { ...o, personB: "" };
              return o;
            }).filter(o => o.personA || o.personB);
            onUpdateOneToOnes(updated);
            setDragPersonId(null);
          }
        }}
        className={`rounded-lg border-2 border-dashed p-4 transition-colors ${
          dragPersonId ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/30"
        }`}
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Not in any 1-to-1 ({unassigned.length})
        </h3>
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

// Drop slot for one side of a pair
function DropSlot({
  person, side, pairId, dragPersonId, onDrop, onUnpair, onUpdatePerson, onDragStart, onDragEnd,
}: {
  person: Person | null | undefined;
  side: "A" | "B";
  pairId: string;
  dragPersonId: string | null;
  onDrop: (pairId: string, side: "A" | "B", personId: string) => void;
  onUnpair: (pairId: string, side: "A" | "B") => void;
  onUpdatePerson: (p: Person) => void;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
}) {
  return (
    <div
      onDragOver={e => e.preventDefault()}
      onDrop={(e) => {
        e.preventDefault();
        const pid = e.dataTransfer.getData("text/plain") || dragPersonId;
        if (pid) onDrop(pairId, side, pid);
      }}
      className={`flex items-center gap-1 min-w-[140px] rounded-md px-2 py-1.5 transition-colors ${
        !person && dragPersonId ? "bg-primary/10 border border-dashed border-primary/30" :
        !person ? "bg-muted/50 border border-dashed border-border" : ""
      }`}
    >
      {person ? (
        <div className="flex items-center gap-1">
          <PersonChip
            person={person}
            onUpdatePerson={onUpdatePerson}
            draggable
            onDragStart={() => onDragStart(person.id)}
            onDragEnd={onDragEnd}
          />
          <button
            onClick={() => onUnpair(pairId, side)}
            className="text-muted-foreground hover:text-destructive p-0.5"
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <span className="text-xs text-muted-foreground italic px-2">Drop here</span>
      )}
    </div>
  );
}

export default OneToOneView;
