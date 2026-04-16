import { useState, useMemo } from "react";
import { Search, ChevronUp, ChevronDown, X, Edit2, Trash2, Eye, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  type Person, type Group, type GroupType, type EngagementLevel,
  engagementColors, engagementLabels,
} from "@/data/mockData";

interface Props {
  people: Person[];
  groups: Group[];
  groupTypes: GroupType[];
  onUpdatePerson: (p: Person) => void;
  onDeletePerson: (id: string) => void;
  onUpdateGroups: (groups: Group[]) => void;
  ministries: string[];
  roles: string[];
  tags: string[];
  onAddMinistry: (m: string) => void;
  onAddRole: (r: string) => void;
  onAddTag: (t: string) => void;
  onDeleteTag: (t: string) => void;
}

type ColumnKey = "name" | "servingIn" | "smallGroup" | "engagement";
type DraggableColumnKey = "servingIn" | "smallGroup" | "engagement";
const defaultColumnOrder: DraggableColumnKey[] = ["servingIn", "smallGroup", "engagement"];
const columnLabels: Record<ColumnKey, string> = {
  name: "Name",
  servingIn: "Serving In",
  smallGroup: "Small Group",
  engagement: "Church Engagement",
};
const allColumns: { key: ColumnKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "servingIn", label: "Serving In" },
  { key: "smallGroup", label: "Small Group" },
  { key: "engagement", label: "Church Engagement" },
];

const engagementOrder: EngagementLevel[] = ["regular", "infrequent", "missing"];

function MultiSelectFilter({ label, options, selected, onChange, sortFn }: {
  label: string; options: string[]; selected: string[]; onChange: (sel: string[]) => void;
  sortFn?: (a: string, b: string) => number;
}) {
  const sorted = sortFn ? [...options].sort(sortFn) : [...options].sort((a, b) => a.localeCompare(b));
  const allSelected = sorted.length > 0 && selected.length === sorted.length;
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-10 gap-1.5 text-sm">
          {label}
          {selected.length > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 min-w-[20px] px-1 flex items-center justify-center text-xs">
              {selected.length}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2 max-h-60 overflow-y-auto" align="start">
        <button onClick={() => onChange(allSelected ? [] : [...sorted])}
          className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-muted font-medium text-primary">
          {allSelected ? "Deselect All" : "Select All"}
        </button>
        <div className="border-t border-border my-1" />
        {sorted.map(opt => (
          <label key={opt} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm">
            <Checkbox
              checked={selected.includes(opt)}
              onCheckedChange={() => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])}
            />
            {opt}
          </label>
        ))}
      </PopoverContent>
    </Popover>
  );
}

/* Inline cell popover for multi-select assignment */
function InlineCellSelect({ options, selected, onChange, sortFn }: {
  options: string[]; selected: string[]; onChange: (sel: string[]) => void;
  sortFn?: (a: string, b: string) => number;
}) {
  const sorted = sortFn ? [...options].sort(sortFn) : [...options].sort((a, b) => a.localeCompare(b));
  return (
    <div className="max-h-48 overflow-y-auto p-1">
      {sorted.map(opt => (
        <label key={opt} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm">
          <Checkbox
            checked={selected.includes(opt)}
            onCheckedChange={() => onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt])}
          />
          {opt}
        </label>
      ))}
    </div>
  );
}

/* Inline engagement selector (single-select, ordered) */
function InlineEngagementSelect({ value, onChange }: {
  value: EngagementLevel; onChange: (v: EngagementLevel) => void;
}) {
  return (
    <div className="p-1">
      {engagementOrder.map(level => (
        <button key={level} onClick={() => onChange(level)}
          className={`w-full text-left text-sm px-2 py-1.5 rounded transition-all ${
            value === level ? engagementColors[level] + " font-medium" : "hover:bg-muted"
          }`}>
          {engagementLabels[level]}
        </button>
      ))}
    </div>
  );
}

const AllMembersView = ({
  people, groups, groupTypes, onUpdatePerson, onDeletePerson, onUpdateGroups,
  ministries, roles, tags, onAddMinistry, onAddRole, onAddTag, onDeleteTag,
}: Props) => {
  const [search, setSearch] = useState("");
  const [filterMinistries, setFilterMinistries] = useState<string[]>([]);
  const [filterEngagement, setFilterEngagement] = useState<string[]>([]);
  const [filterSmallGroups, setFilterSmallGroups] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortField, setSortField] = useState<"name" | "engagement">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(allColumns.map(c => c.key));
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  // Build person→group name map
  const personGroupMap = useMemo(() => {
    const map = new Map<string, string[]>();
    const sortedGroups = [...groups].sort((a, b) => {
      const tA = groupTypes.find(t => t.id === a.typeId)?.label || "";
      const tB = groupTypes.find(t => t.id === b.typeId)?.label || "";
      const tc = tA.localeCompare(tB);
      return tc !== 0 ? tc : a.name.localeCompare(b.name);
    });
    for (const g of sortedGroups) {
      for (const mid of g.members) {
        if (!map.has(mid)) map.set(mid, []);
        map.get(mid)!.push(g.name);
      }
    }
    return map;
  }, [groups, groupTypes]);

  const allGroupNames = useMemo(() => {
    return [...new Set(groups.map(g => g.name))].sort();
  }, [groups]);

  const filtered = useMemo(() => {
    let result = people.filter((p) => {
      const s = search.toLowerCase();
      const matchesSearch = !s || p.name.toLowerCase().includes(s) ||
        p.ministries.some(m => m.toLowerCase().includes(s));
      const matchesMinistry = filterMinistries.length === 0 || filterMinistries.some(m => p.ministries.includes(m));
      const matchesEngagement = filterEngagement.length === 0 || filterEngagement.includes(p.engagement);
      const pGroups = personGroupMap.get(p.id) || [];
      const matchesGroup = filterSmallGroups.length === 0 || filterSmallGroups.some(g => pGroups.includes(g));
      const matchesTags = filterTags.length === 0 || filterTags.some(t => p.tags.includes(t));
      return matchesSearch && matchesMinistry && matchesEngagement && matchesGroup && matchesTags;
    });
    result.sort((a, b) => {
      let cmp: number;
      if (sortField === "name") {
        cmp = a.name.localeCompare(b.name);
      } else {
        cmp = engagementOrder.indexOf(a.engagement as EngagementLevel) - engagementOrder.indexOf(b.engagement as EngagementLevel);
      }
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [people, search, filterMinistries, filterEngagement, filterSmallGroups, filterTags, sortField, sortAsc, personGroupMap]);

  const toggleSort = (field: "name" | "engagement") => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const handleTogglePersonGroup = (personId: string, groupName: string) => {
    const newGroups = groups.map(g => {
      if (g.name !== groupName) return g;
      const isMember = g.members.includes(personId);
      return {
        ...g,
        members: isMember ? g.members.filter(m => m !== personId) : [...g.members, personId],
      };
    });
    onUpdateGroups(newGroups);
  };

  const engagementSortFn = (a: string, b: string) => {
    return engagementOrder.indexOf(a as EngagementLevel) - engagementOrder.indexOf(b as EngagementLevel);
  };

  const activeFilters = filterMinistries.length + filterEngagement.length + filterSmallGroups.length + filterTags.length;
  const isCol = (k: ColumnKey) => visibleColumns.includes(k);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "person" : "people"}
        </p>
        <Popover open={showColumnPicker} onOpenChange={setShowColumnPicker}>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 px-2 gap-1 text-xs">
              <Eye size={14} /> Columns
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-44 p-2" align="end">
            {allColumns.map(col => (
              <label key={col.key} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm">
                <Checkbox
                  checked={visibleColumns.includes(col.key)}
                  onCheckedChange={() => setVisibleColumns(prev =>
                    prev.includes(col.key) ? prev.filter(c => c !== col.key) : [...prev, col.key]
                  )}
                />
                {col.label}
              </label>
            ))}
          </PopoverContent>
        </Popover>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name or ministry…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11" />
        </div>
        <MultiSelectFilter label="Serving In" options={ministries} selected={filterMinistries} onChange={setFilterMinistries} />
        <MultiSelectFilter label="Small Group" options={allGroupNames} selected={filterSmallGroups} onChange={setFilterSmallGroups} />
        <MultiSelectFilter label="Church Engagement" options={Object.keys(engagementLabels)} selected={filterEngagement} onChange={setFilterEngagement} sortFn={engagementSortFn} />
        <MultiSelectFilter label="Tags" options={tags} selected={filterTags} onChange={setFilterTags} />
        {activeFilters > 0 && (
          <Button variant="ghost" size="sm" className="h-10 gap-1 text-muted-foreground" onClick={() => { setFilterMinistries([]); setFilterEngagement([]); setFilterSmallGroups([]); setFilterTags([]); setSearch(""); }}>
            <X size={14} /> Clear all
          </Button>
        )}
      </div>

      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              {isCol("name") && (
                <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  <span className="flex items-center gap-1">Name <SortIcon field="name" /></span>
                </th>
              )}
              {isCol("servingIn") && <th className="text-left px-4 py-3 font-medium">Serving In</th>}
              {isCol("smallGroup") && <th className="text-left px-4 py-3 font-medium">Small Group</th>}
              {isCol("engagement") && (
                <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("engagement")}>
                  <span className="flex items-center gap-1">Church Engagement <SortIcon field="engagement" /></span>
                </th>
              )}
              <th className="px-4 py-3 w-20"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(person => {
              const pGroups = personGroupMap.get(person.id) || [];
              return (
                <tr key={person.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  {isCol("name") && <td className="px-4 py-3 font-medium">{person.name}</td>}
                  {isCol("servingIn") && (
                    <td className="px-4 py-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="w-full text-left min-h-[28px] rounded px-1 -mx-1 hover:bg-muted/50 transition-colors cursor-pointer">
                            {person.ministries.length === 0
                              ? <span className="text-muted-foreground italic text-xs">—</span>
                              : <div className="flex flex-wrap gap-1">{[...person.ministries].sort().map(m => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}</div>
                            }
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-0" align="start">
                          <InlineCellSelect
                            options={ministries}
                            selected={person.ministries}
                            onChange={(sel) => onUpdatePerson({ ...person, ministries: sel })}
                          />
                        </PopoverContent>
                      </Popover>
                    </td>
                  )}
                  {isCol("smallGroup") && (
                    <td className="px-4 py-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="w-full text-left min-h-[28px] rounded px-1 -mx-1 hover:bg-muted/50 transition-colors cursor-pointer">
                            {pGroups.length === 0
                              ? <span className="text-muted-foreground italic text-xs">—</span>
                              : <div className="flex flex-wrap gap-1">{pGroups.map(g => <Badge key={g} variant="secondary" className="text-xs">{g}</Badge>)}</div>
                            }
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-0" align="start">
                          <InlineCellSelect
                            options={allGroupNames}
                            selected={pGroups}
                            onChange={(sel) => {
                              // For each group, add/remove this person
                              const newGroups = groups.map(g => {
                                const shouldBeMember = sel.includes(g.name);
                                const isMember = g.members.includes(person.id);
                                if (shouldBeMember && !isMember) return { ...g, members: [...g.members, person.id] };
                                if (!shouldBeMember && isMember) return { ...g, members: g.members.filter(m => m !== person.id) };
                                return g;
                              });
                              onUpdateGroups(newGroups);
                            }}
                          />
                        </PopoverContent>
                      </Popover>
                    </td>
                  )}
                  {isCol("engagement") && (
                    <td className="px-4 py-3">
                      <Popover>
                        <PopoverTrigger asChild>
                          <button className="rounded px-1 -mx-1 hover:bg-muted/50 transition-colors cursor-pointer">
                            <Badge className={`${engagementColors[person.engagement]} text-xs`}>
                              {engagementLabels[person.engagement]}
                            </Badge>
                          </button>
                        </PopoverTrigger>
                        <PopoverContent className="w-40 p-0" align="start">
                          <InlineEngagementSelect
                            value={person.engagement}
                            onChange={(v) => onUpdatePerson({ ...person, engagement: v })}
                          />
                        </PopoverContent>
                      </Popover>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditPerson({ ...person })}><Edit2 size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDeletePerson(person.id)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan={allColumns.length + 1} className="text-center py-12 text-muted-foreground">No people found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {editPerson && (
        <EditPersonDialog
          person={editPerson}
          onSave={(p) => { onUpdatePerson(p); setEditPerson(null); }}
          onClose={() => setEditPerson(null)}
          ministries={ministries}
          roles={roles}
          tags={tags}
          onAddMinistry={onAddMinistry}
          onAddRole={onAddRole}
          onAddTag={onAddTag}
          onDeleteTag={onDeleteTag}
        />
      )}
    </div>
  );
};

function EditPersonDialog({ person, onSave, onClose, ministries, roles, tags, onAddMinistry, onAddRole, onAddTag, onDeleteTag }: {
  person: Person; onSave: (p: Person) => void; onClose: () => void;
  ministries: string[]; roles: string[]; tags: string[];
  onAddMinistry: (m: string) => void; onAddRole: (r: string) => void;
  onAddTag: (t: string) => void; onDeleteTag: (t: string) => void;
}) {
  const [draft, setDraft] = useState<Person>(person);
  const [newMinistry, setNewMinistry] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newTag, setNewTag] = useState("");

  const toggleArrayField = (field: "ministries" | "roles" | "tags", value: string) => {
    setDraft(d => ({
      ...d,
      [field]: d[field].includes(value) ? d[field].filter(v => v !== value) : [...d[field], value],
    }));
  };

  const sortedMinistries = [...ministries].sort();
  const sortedRoles = [...roles].sort();
  const sortedTags = [...tags].sort();

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Edit — {person.name}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Name</Label>
            <Input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className="mt-1" />
          </div>

          <div>
            <Label>Church Engagement</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {engagementOrder.map(level => (
                <button key={level} onClick={() => setDraft({ ...draft, engagement: level })}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                    draft.engagement === level ? engagementColors[level] : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}>
                  {engagementLabels[level]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Serving In (Ministries)</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sortedMinistries.map(m => (
                <button key={m} onClick={() => toggleArrayField("ministries", m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    draft.ministries.includes(m) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  }`}>
                  {draft.ministries.includes(m) ? "✓ " : ""}{m}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input value={newMinistry} onChange={e => setNewMinistry(e.target.value)} placeholder="Add new…" className="h-7 text-xs" onKeyDown={e => {
                if (e.key === "Enter" && newMinistry.trim()) { onAddMinistry(newMinistry.trim()); toggleArrayField("ministries", newMinistry.trim()); setNewMinistry(""); }
              }} />
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => {
                if (newMinistry.trim()) { onAddMinistry(newMinistry.trim()); toggleArrayField("ministries", newMinistry.trim()); setNewMinistry(""); }
              }}><Plus size={12} /></Button>
            </div>
          </div>

          <div>
            <Label>Roles</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sortedRoles.map(r => (
                <button key={r} onClick={() => toggleArrayField("roles", r)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    draft.roles.includes(r) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  }`}>
                  {draft.roles.includes(r) ? "✓ " : ""}{r}
                </button>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Add new…" className="h-7 text-xs" onKeyDown={e => {
                if (e.key === "Enter" && newRole.trim()) { onAddRole(newRole.trim()); toggleArrayField("roles", newRole.trim()); setNewRole(""); }
              }} />
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => {
                if (newRole.trim()) { onAddRole(newRole.trim()); toggleArrayField("roles", newRole.trim()); setNewRole(""); }
              }}><Plus size={12} /></Button>
            </div>
          </div>

          <div>
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {sortedTags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1">
                  <button onClick={() => toggleArrayField("tags", tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      draft.tags.includes(tag) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                    }`}>
                    {draft.tags.includes(tag) ? "✓ " : ""}{tag}
                  </button>
                  <button onClick={() => onDeleteTag(tag)} className="text-muted-foreground hover:text-destructive text-xs">×</button>
                </span>
              ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add new tag…" className="h-7 text-xs" onKeyDown={e => {
                if (e.key === "Enter" && newTag.trim()) { onAddTag(newTag.trim()); toggleArrayField("tags", newTag.trim()); setNewTag(""); }
              }} />
              <Button size="sm" variant="outline" className="h-7 text-xs" onClick={() => {
                if (newTag.trim()) { onAddTag(newTag.trim()); toggleArrayField("tags", newTag.trim()); setNewTag(""); }
              }}><Plus size={12} /></Button>
            </div>
          </div>

          <div>
            <Label>Notes</Label>
            <Textarea value={draft.notes} onChange={e => setDraft({ ...draft, notes: e.target.value })} className="mt-1" rows={2} />
          </div>
          <div>
            <Label>Follow-up Notes</Label>
            <Textarea value={draft.followUpNotes} onChange={e => setDraft({ ...draft, followUpNotes: e.target.value })} className="mt-1" rows={2} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>Cancel</Button>
            <Button onClick={() => onSave(draft)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default AllMembersView;
