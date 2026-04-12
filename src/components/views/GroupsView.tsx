import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PersonChip from "@/components/PersonChip";
import {
  type Person, type Group, type GroupType, type EngagementLevel,
  groupTypeLabels, groupTypeColors, engagementLabels, engagementColors,
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

  const personMap = new Map(people.map(p => [p.id, p]));
  const filteredGroups = filterType === "all" ? groups : groups.filter(g => g.type === filterType);

  const assignedIds = new Set(filteredGroups.flatMap(g => g.members));
  const unassigned = people.filter(p => !assignedIds.has(p.id));

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
      {/* Legend + Filter */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <Select value={filterType} onValueChange={v => setFilterType(v as GroupType | "all")}>
          <SelectTrigger className="w-48 h-10"><SelectValue placeholder="Group type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {Object.entries(groupTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="flex items-center gap-2 ml-auto">
          <span className="text-xs text-muted-foreground">Legend:</span>
          {(Object.keys(engagementLabels) as EngagementLevel[]).map(level => (
            <Badge key={level} className={`${engagementColors[level]} text-xs`}>
              {engagementLabels[level]}
            </Badge>
          ))}
        </div>
      </div>

      <p className="text-xs text-muted-foreground mb-4">Drag people between groups · Click a chip to view details & change engagement level</p>

      {/* Group columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredGroups.map(group => (
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
              <span className="text-xs text-muted-foreground ml-auto">{group.members.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.members.map(id => {
                const person = personMap.get(id);
                if (!person) return null;
                return (
                  <PersonChip
                    key={id}
                    person={person}
                    onUpdatePerson={onUpdatePerson}
                    draggable
                    onDragStart={() => setDragPersonId(id)}
                    onDragEnd={() => setDragPersonId(null)}
                  />
                );
              })}
              {group.members.length === 0 && (
                <p className="text-xs text-muted-foreground italic py-2">Drop people here</p>
              )}
            </div>
          </div>
        ))}
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
        <h3 className="text-sm font-medium text-muted-foreground mb-3">
          Unassigned ({unassigned.length})
        </h3>
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
