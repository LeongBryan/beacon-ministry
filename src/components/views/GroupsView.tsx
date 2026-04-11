import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  type Person, type Group, type GroupType,
  groupTypeLabels, groupTypeColors,
} from "@/data/mockData";

interface Props {
  people: Person[];
  groups: Group[];
  onUpdateGroups: (groups: Group[]) => void;
}

const GroupsView = ({ people, groups, onUpdateGroups }: Props) => {
  const [filterType, setFilterType] = useState<GroupType | "all">("all");
  const [dragPerson, setDragPerson] = useState<string | null>(null);

  const personMap = new Map(people.map(p => [p.id, p]));
  const filteredGroups = filterType === "all" ? groups : groups.filter(g => g.type === filterType);

  // Find unassigned people (not in any group of the filtered type)
  const assignedIds = new Set(filteredGroups.flatMap(g => g.members));
  const unassigned = people.filter(p => !assignedIds.has(p.id));

  const handleDrop = (groupId: string, personId: string) => {
    const updated = groups.map(g => {
      // Remove from old group
      const withoutPerson = { ...g, members: g.members.filter(m => m !== personId) };
      // Add to target group
      if (g.id === groupId && !g.members.includes(personId)) {
        return { ...g, members: [...g.members, personId] };
      }
      return withoutPerson;
    });
    onUpdateGroups(updated);
    setDragPerson(null);
  };

  const handleDropUnassigned = (personId: string) => {
    const updated = groups.map(g => ({
      ...g,
      members: g.members.filter(m => m !== personId),
    }));
    onUpdateGroups(updated);
    setDragPerson(null);
  };

  const PersonChip = ({ id }: { id: string }) => {
    const person = personMap.get(id);
    if (!person) return null;
    return (
      <div
        draggable
        onDragStart={() => setDragPerson(id)}
        onDragEnd={() => setDragPerson(null)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border border-border rounded-full text-sm cursor-grab active:cursor-grabbing hover:shadow-sm transition-shadow select-none"
      >
        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-medium">
          {person.name[0]}
        </div>
        {person.name}
      </div>
    );
  };

  return (
    <div>
      {/* Filter */}
      <div className="flex items-center gap-3 mb-6">
        <Select value={filterType} onValueChange={v => setFilterType(v as GroupType | "all")}>
          <SelectTrigger className="w-48 h-10"><SelectValue placeholder="Group type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Groups</SelectItem>
            {Object.entries(groupTypeLabels).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">Drag people between groups to reassign</p>
      </div>

      {/* Group columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredGroups.map(group => (
          <div
            key={group.id}
            onDragOver={e => e.preventDefault()}
            onDrop={() => dragPerson && handleDrop(group.id, dragPerson)}
            className={`rounded-lg border-2 border-dashed p-4 min-h-[120px] transition-colors ${
              dragPerson ? "border-primary/40 bg-primary/5" : "border-border bg-card"
            }`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Badge className={`${groupTypeColors[group.type]} text-xs`}>{groupTypeLabels[group.type]}</Badge>
              <h3 className="font-medium text-sm text-foreground">{group.name}</h3>
              <span className="text-xs text-muted-foreground ml-auto">{group.members.length}</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {group.members.map(id => <PersonChip key={id} id={id} />)}
              {group.members.length === 0 && (
                <p className="text-xs text-muted-foreground italic py-2">Drop people here</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Unassigned */}
      {unassigned.length > 0 && (
        <div
          onDragOver={e => e.preventDefault()}
          onDrop={() => dragPerson && handleDropUnassigned(dragPerson)}
          className="rounded-lg border-2 border-dashed border-border p-4 bg-muted/30"
        >
          <h3 className="text-sm font-medium text-muted-foreground mb-3">
            Unassigned ({unassigned.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {unassigned.map(p => <PersonChip key={p.id} id={p.id} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupsView;
