import { useState, useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Filter, X, Plus, Trash2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import PersonChip from "@/components/PersonChip";
import {
  type Person, type Group, type GroupType,
  type GroupAttendance, type GroupRole, type GroupMemberMeta,
  groupAttendanceLabels, groupAttendanceDotColors,
  groupRoleLabels, engagementLabels,
} from "@/data/mockData";

interface Props {
  people: Person[];
  groups: Group[];
  onUpdateGroups: (groups: Group[]) => void;
  onUpdatePerson: (person: Person) => void;
  groupTypes: GroupType[];
  onUpdateGroupTypes: (types: GroupType[]) => void;
  tags: string[];
  ministries: string[];
  roles: string[];
}

function MultiSelectFilter({ label, options, selected, onChange }: {
  label: string; options: string[]; selected: string[]; onChange: (sel: string[]) => void;
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

const groupTypeColorOptions = [
  "bg-soft-blue", "bg-soft-green", "bg-warm-gold-light", "bg-primary/20",
  "bg-destructive/20", "bg-success/20", "bg-accent", "bg-muted",
];

// Sort members: role first (leader > partner > none), then attendance (regular > infrequent > missing > none), then name
function sortGroupMembers(members: Person[], meta: Record<string, GroupMemberMeta>): Person[] {
  const roleOrder = (r?: GroupRole) => r === "leader" ? 0 : r === "partner" ? 1 : 2;
  const attOrder = (a?: GroupAttendance) => a === "regular" ? 0 : a === "infrequent" ? 1 : a === "missing" ? 2 : 3;
  return [...members].sort((a, b) => {
    const mA = meta[a.id] || {};
    const mB = meta[b.id] || {};
    const rc = roleOrder(mA.role) - roleOrder(mB.role);
    if (rc !== 0) return rc;
    const ac = attOrder(mA.attendance) - attOrder(mB.attendance);
    if (ac !== 0) return ac;
    return a.name.localeCompare(b.name);
  });
}

const GroupsView = ({ people, groups, onUpdateGroups, onUpdatePerson, groupTypes, onUpdateGroupTypes, tags, ministries, roles }: Props) => {
  const [filterTypeId, setFilterTypeId] = useState<string>("all");
  const [dragPersonId, setDragPersonId] = useState<string | null>(null);
  const [ctrlHeld, setCtrlHeld] = useState(false);

  const [search, setSearch] = useState("");
  const [filterEngagement, setFilterEngagement] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [filterMinistries, setFilterMinistries] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  const [showCreateGroup, setShowCreateGroup] = useState(false);
  const [newGroupName, setNewGroupName] = useState("");
  const [newGroupTypeId, setNewGroupTypeId] = useState(groupTypes[0]?.id || "");

  const [showCreateType, setShowCreateType] = useState(false);
  const [newTypeName, setNewTypeName] = useState("");
  const [newTypeColor, setNewTypeColor] = useState(groupTypeColorOptions[0]);

  const personMap = new Map(people.map(p => [p.id, p]));
  const typeMap = new Map(groupTypes.map(t => [t.id, t]));

  // Sort groups: by type label alphabetically, then group name
  const sortedGroups = useMemo(() => {
    return [...groups].sort((a, b) => {
      const tA = typeMap.get(a.typeId)?.label || "";
      const tB = typeMap.get(b.typeId)?.label || "";
      const tc = tA.localeCompare(tB);
      return tc !== 0 ? tc : a.name.localeCompare(b.name);
    });
  }, [groups, groupTypes]);

  const filteredGroups = filterTypeId === "all" ? sortedGroups : sortedGroups.filter(g => g.typeId === filterTypeId);
  const assignedIds = new Set(filteredGroups.flatMap(g => g.members));

  const matchesPerson = (p: Person) => {
    const s = search.toLowerCase();
    const matchesSearch = !s || p.name.toLowerCase().includes(s) || p.tags.some(t => t.toLowerCase().includes(s));
    const matchesEng = filterEngagement.length === 0 || filterEngagement.includes(p.engagement);
    const matchesTag = filterTags.length === 0 || filterTags.every(t => p.tags.includes(t));
    const matchesMin = filterMinistries.length === 0 || filterMinistries.some(m => p.ministries.includes(m));
    return matchesSearch && matchesEng && matchesTag && matchesMin;
  };

  const getFilteredMembers = (memberIds: string[]) =>
    memberIds.map(id => personMap.get(id)).filter((p): p is Person => !!p && matchesPerson(p));

  const unassigned = useMemo(() => {
    return people.filter(p => !assignedIds.has(p.id) && matchesPerson(p)).sort((a, b) => a.name.localeCompare(b.name));
  }, [people, assignedIds, search, filterEngagement, filterTags, filterMinistries]);

  const allTagsInUse = useMemo(() => {
    const s = new Set<string>(tags);
    people.forEach(p => p.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [people, tags]);

  const activeFilters = filterEngagement.length + filterTags.length + filterMinistries.length + (search ? 1 : 0);

  const handleDrop = (groupId: string, personId: string) => {
    // Find existing meta from any source group so it carries over
    let existingMeta: GroupMemberMeta = {};
    for (const g of groups) {
      if (g.members.includes(personId) && g.memberMeta[personId]) {
        existingMeta = { ...g.memberMeta[personId] };
        break;
      }
    }
    const updated = groups.map(g => {
      if (g.id === groupId && !g.members.includes(personId)) {
        return { ...g, members: [...g.members, personId], memberMeta: { ...g.memberMeta, [personId]: { ...existingMeta, ...g.memberMeta[personId] } } };
      }
      // If NOT ctrl-held, remove from other groups (move)
      if (!ctrlHeld && g.id !== groupId) {
        const newMeta = { ...g.memberMeta };
        delete newMeta[personId];
        return { ...g, members: g.members.filter(m => m !== personId), memberMeta: newMeta };
      }
      return g;
    });
    onUpdateGroups(updated);
    setDragPersonId(null);
  };

  const handleDropUnassigned = (personId: string) => {
    onUpdateGroups(groups.map(g => ({ ...g, members: g.members.filter(m => m !== personId) })));
    setDragPersonId(null);
  };

  const handleRemoveMember = (groupId: string, personId: string) => {
    onUpdateGroups(groups.map(g => g.id === groupId ? { ...g, members: g.members.filter(m => m !== personId) } : g));
  };

  const handleDeleteGroup = (groupId: string) => {
    onUpdateGroups(groups.filter(g => g.id !== groupId));
  };

  const handleCreateGroup = () => {
    if (!newGroupName.trim() || !newGroupTypeId) return;
    const newGroup: Group = { id: `grp-${Date.now()}`, typeId: newGroupTypeId, name: newGroupName.trim(), members: [], memberMeta: {} };
    onUpdateGroups([...groups, newGroup]);
    setNewGroupName("");
    setShowCreateGroup(false);
  };

  const handleCreateType = () => {
    if (!newTypeName.trim()) return;
    const newType: GroupType = { id: `type-${Date.now()}`, label: newTypeName.trim(), color: newTypeColor };
    onUpdateGroupTypes([...groupTypes, newType]);
    setNewTypeName("");
    setShowCreateType(false);
  };

  const handleDeleteType = (typeId: string) => {
    onUpdateGroupTypes(groupTypes.filter(t => t.id !== typeId));
    onUpdateGroups(groups.filter(g => g.typeId !== typeId));
  };

  const setMemberAttendance = (groupId: string, personId: string, att: GroupAttendance | null) => {
    onUpdateGroups(groups.map(g => {
      if (g.id !== groupId) return g;
      const prev = g.memberMeta[personId] || {};
      const updated = att ? { ...prev, attendance: att } : { ...prev };
      if (!att) delete (updated as any).attendance;
      return { ...g, memberMeta: { ...g.memberMeta, [personId]: updated } };
    }));
  };

  const setMemberRole = (groupId: string, personId: string, role: GroupRole | null) => {
    onUpdateGroups(groups.map(g => {
      if (g.id !== groupId) return g;
      const prev = g.memberMeta[personId] || {};
      const updated = role ? { ...prev, role } : { ...prev };
      if (!role) delete (updated as any).role;
      return { ...g, memberMeta: { ...g.memberMeta, [personId]: updated } };
    }));
  };

  return (
    <div
      onKeyDown={e => { if (e.key === "Control" || e.key === "Meta") setCtrlHeld(true); }}
      onKeyUp={e => { if (e.key === "Control" || e.key === "Meta") setCtrlHeld(false); }}
      tabIndex={-1}
      className="outline-none"
    >
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 mb-4 text-xs text-muted-foreground">
        <span className="font-medium">Attendance:</span>
        {(Object.keys(groupAttendanceLabels) as GroupAttendance[]).map(att => (
          <span key={att} className="flex items-center gap-1">
            <div className={`w-2.5 h-2.5 rounded-full ${groupAttendanceDotColors[att]}`} />
            {groupAttendanceLabels[att]}
          </span>
        ))}
        <span className="mx-2 text-border">|</span>
        <span className="font-medium">Role:</span>
        {(Object.keys(groupRoleLabels) as GroupRole[]).map(role => (
          <Badge key={role} variant={role === "leader" ? "default" : "secondary"} className="text-[10px] font-bold">
            {groupRoleLabels[role]}
          </Badge>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Select value={filterTypeId} onValueChange={setFilterTypeId}>
          <SelectTrigger className="w-48 h-10"><SelectValue placeholder="Group type" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Small Groups</SelectItem>
            {[...groupTypes].sort((a, b) => a.label.localeCompare(b.label)).map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
          </SelectContent>
        </Select>
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
            <X size={14} /> Clear all
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-card rounded-lg border border-border">
          <p className="text-xs font-medium text-muted-foreground mb-2">Filter by tags:</p>
          <div className="flex flex-wrap gap-1.5">
            {allTagsInUse.map(tag => (
              <button key={tag} onClick={() => setFilterTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])}
                className={`text-xs px-2.5 py-1 rounded-full border transition-all ${filterTags.includes(tag) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"}`}>
                {filterTags.includes(tag) ? "✓ " : ""}{tag}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2 mb-4">
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowCreateGroup(true)}>
          <Plus size={14} /> New Small Group
        </Button>
        <Button size="sm" variant="outline" className="gap-1.5" onClick={() => setShowCreateType(true)}>
          <Plus size={14} /> New Group Type
        </Button>
      </div>

      <p className="text-xs text-muted-foreground mb-4">
        Drag to move between groups · Hold <kbd className="px-1 py-0.5 rounded bg-muted border border-border text-[10px]">Ctrl</kbd> while dragging to multi-assign · Click a chip to set attendance &amp; role
      </p>

      {/* Group cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {filteredGroups.map(group => {
          const rawMembers = getFilteredMembers(group.members);
          const members = sortGroupMembers(rawMembers, group.memberMeta);
          const totalMembers = group.members.length;
          const gType = typeMap.get(group.typeId);
          return (
            <div
              key={group.id}
              onDragOver={e => e.preventDefault()}
              onDrop={(e) => { e.preventDefault(); const pid = e.dataTransfer.getData("text/plain") || dragPersonId; if (pid) handleDrop(group.id, pid); }}
              className={`rounded-lg border-2 border-dashed p-4 min-h-[120px] transition-colors ${dragPersonId ? "border-primary/40 bg-primary/5" : "border-border bg-card"}`}
            >
              <div className="flex items-center gap-2 mb-3">
                {gType && <Badge className={`${gType.color} text-foreground text-xs`}>{gType.label}</Badge>}
                <h3 className="font-medium text-sm text-foreground">{group.name}</h3>
                <span className="text-xs text-muted-foreground ml-auto">{members.length}{members.length !== totalMembers ? `/${totalMembers}` : ""}</span>
                <button onClick={() => handleDeleteGroup(group.id)} className="text-muted-foreground hover:text-destructive p-0.5" title="Delete group">
                  <X size={14} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {members.map(person => {
                  const meta = group.memberMeta[person.id] || {};
                  return (
                    <div key={person.id} className="group relative">
                      <Popover>
                        <PopoverTrigger asChild>
                          <div
                            draggable
                            onDragStart={(e) => { e.dataTransfer.setData("text/plain", person.id); setDragPersonId(person.id); setCtrlHeld(e.ctrlKey || e.metaKey); }}
                            onDragEnd={() => setDragPersonId(null)}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border rounded-full text-sm cursor-pointer select-none transition-all hover:shadow-sm ${
                              meta.role ? "border-primary/60 ring-1 ring-primary/20" : "border-border"
                            }`}
                          >
                            {meta.attendance ? (
                              <div className={`w-2.5 h-2.5 rounded-full ${groupAttendanceDotColors[meta.attendance]}`} />
                            ) : (
                              <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                            )}
                            <span className="font-medium text-foreground text-xs">{person.name}</span>
                            {meta.role && (
                              <Badge variant={meta.role === "leader" ? "default" : "secondary"} className="text-[9px] px-1.5 py-0 h-4 font-bold ml-0.5">
                                {groupRoleLabels[meta.role]}
                              </Badge>
                            )}
                          </div>
                        </PopoverTrigger>
                        <PopoverContent className="w-64 p-3" align="start">
                          <p className="font-semibold text-sm mb-3">{person.name}</p>

                          <p className="text-xs font-medium text-muted-foreground mb-1.5">Group Attendance</p>
                          <div className="flex flex-wrap gap-1.5 mb-3">
                            <button onClick={() => setMemberAttendance(group.id, person.id, null)}
                              className={`text-xs px-2.5 py-1 rounded-full transition-all ${!meta.attendance ? "bg-muted ring-1 ring-primary/40 text-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted/80"}`}>
                              None
                            </button>
                            {(Object.keys(groupAttendanceLabels) as GroupAttendance[]).map(att => (
                              <button key={att} onClick={() => setMemberAttendance(group.id, person.id, att)}
                                className={`text-xs px-2.5 py-1 rounded-full transition-all flex items-center gap-1 ${
                                  meta.attendance === att ? "ring-1 ring-foreground/30 bg-muted text-foreground font-medium" : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
                                }`}>
                                <div className={`w-2 h-2 rounded-full ${groupAttendanceDotColors[att]}`} />
                                {groupAttendanceLabels[att]}
                              </button>
                            ))}
                          </div>

                          <p className="text-xs font-medium text-muted-foreground mb-1.5">Group Role</p>
                          <div className="flex flex-wrap gap-1.5">
                            <button onClick={() => setMemberRole(group.id, person.id, null)}
                              className={`text-xs px-2.5 py-1 rounded-full transition-all ${!meta.role ? "bg-muted ring-1 ring-primary/40 text-foreground" : "bg-muted/50 text-muted-foreground hover:bg-muted/80"}`}>
                              None
                            </button>
                            {(Object.keys(groupRoleLabels) as GroupRole[]).map(role => (
                              <button key={role} onClick={() => setMemberRole(group.id, person.id, role)}
                                className={`text-xs px-2.5 py-1 rounded-full transition-all font-semibold ${
                                  meta.role === role
                                    ? (role === "leader" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground ring-1 ring-primary/30")
                                    : "bg-muted/50 text-muted-foreground hover:bg-muted/80"
                                }`}>
                                {groupRoleLabels[role]}
                              </button>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                      <button
                        onClick={() => handleRemoveMember(group.id, person.id)}
                        className="absolute -top-1 -right-1 bg-background border border-border rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  );
                })}
                {members.length === 0 && (
                  <p className="text-xs text-muted-foreground italic py-2">{totalMembers > 0 ? "No members match filters" : "Drop people here"}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Unassigned */}
      <div
        onDragOver={e => e.preventDefault()}
        onDrop={(e) => { e.preventDefault(); const pid = e.dataTransfer.getData("text/plain") || dragPersonId; if (pid) handleDropUnassigned(pid); }}
        className={`rounded-lg border-2 border-dashed p-4 transition-colors ${dragPersonId ? "border-destructive/40 bg-destructive/5" : "border-border bg-muted/30"}`}
      >
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Unassigned ({unassigned.length})</h3>
        <div className="flex flex-wrap gap-2">
          {unassigned.map(p => (
            <PersonChip key={p.id} person={p} onUpdatePerson={onUpdatePerson} draggable tags={tags}
              onDragStart={() => setDragPersonId(p.id)} onDragEnd={() => setDragPersonId(null)} />
          ))}
          {unassigned.length === 0 && <p className="text-xs text-muted-foreground italic py-2">Everyone is assigned!</p>}
        </div>
      </div>

      {/* Create Group Dialog */}
      <Dialog open={showCreateGroup} onOpenChange={setShowCreateGroup}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Create Small Group</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Group name" value={newGroupName} onChange={e => setNewGroupName(e.target.value)} />
            <Select value={newGroupTypeId} onValueChange={setNewGroupTypeId}>
              <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
              <SelectContent>
                {[...groupTypes].sort((a, b) => a.label.localeCompare(b.label)).map(t => <SelectItem key={t.id} value={t.id}>{t.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateGroup(false)}>Cancel</Button>
              <Button onClick={handleCreateGroup}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Group Type Dialog */}
      <Dialog open={showCreateType} onOpenChange={setShowCreateType}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Create Group Type</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Type name" value={newTypeName} onChange={e => setNewTypeName(e.target.value)} />
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {groupTypeColorOptions.map(c => (
                  <button key={c} onClick={() => setNewTypeColor(c)}
                    className={`w-8 h-8 rounded-lg ${c} border-2 transition-all ${newTypeColor === c ? "border-primary ring-2 ring-primary/30" : "border-border"}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Existing types:</p>
            <div className="flex flex-wrap gap-1.5">
              {[...groupTypes].sort((a, b) => a.label.localeCompare(b.label)).map(t => (
                <span key={t.id} className={`text-xs px-2.5 py-1 rounded-full ${t.color} text-foreground flex items-center gap-1`}>
                  {t.label}
                  <button onClick={() => handleDeleteType(t.id)} className="hover:text-destructive">×</button>
                </span>
              ))}
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateType(false)}>Cancel</Button>
              <Button onClick={handleCreateType}>Create</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupsView;
