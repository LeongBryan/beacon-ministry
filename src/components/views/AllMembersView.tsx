import { useState, useMemo } from "react";
import { Search, Filter, ChevronUp, ChevronDown, X, Edit2, Grid3X3, List, Trash2, Eye, EyeOff, Plus } from "lucide-react";
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
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import PersonChip from "@/components/PersonChip";
import {
  type Person, type EngagementLevel,
  engagementColors, engagementLabels,
} from "@/data/mockData";

interface Props {
  people: Person[];
  onUpdatePerson: (p: Person) => void;
  onDeletePerson: (id: string) => void;
  ministries: string[];
  roles: string[];
  tags: string[];
  onAddMinistry: (m: string) => void;
  onAddRole: (r: string) => void;
  onAddTag: (t: string) => void;
  onDeleteTag: (t: string) => void;
}

type ColumnKey = "name" | "engagement" | "roles" | "ministries" | "tags" | "notes";
const allColumns: { key: ColumnKey; label: string }[] = [
  { key: "name", label: "Name" },
  { key: "engagement", label: "Engagement" },
  { key: "roles", label: "Role" },
  { key: "ministries", label: "Ministry" },
  { key: "tags", label: "Tags" },
  { key: "notes", label: "Notes" },
];

// Multi-select checkbox dropdown
function MultiSelectFilter({ label, options, selected, onChange }: {
  label: string;
  options: string[];
  selected: string[];
  onChange: (sel: string[]) => void;
}) {
  const allSelected = options.length > 0 && selected.length === options.length;
  const noneSelected = selected.length === 0;

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
        <div className="space-y-1">
          <button
            onClick={() => onChange(allSelected ? [] : [...options])}
            className="w-full text-left text-xs px-2 py-1.5 rounded hover:bg-muted font-medium text-primary"
          >
            {allSelected ? "Deselect All" : "Select All"}
          </button>
          <div className="border-t border-border my-1" />
          {options.map(opt => (
            <label key={opt} className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-muted cursor-pointer text-sm">
              <Checkbox
                checked={selected.includes(opt)}
                onCheckedChange={() => {
                  onChange(selected.includes(opt) ? selected.filter(s => s !== opt) : [...selected, opt]);
                }}
              />
              {opt}
            </label>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}

const AllMembersView = ({ people, onUpdatePerson, onDeletePerson, ministries, roles, tags, onAddMinistry, onAddRole, onAddTag, onDeleteTag }: Props) => {
  const [search, setSearch] = useState("");
  const [filterMinistries, setFilterMinistries] = useState<string[]>([]);
  const [filterRoles, setFilterRoles] = useState<string[]>([]);
  const [filterEngagement, setFilterEngagement] = useState<string[]>([]);
  const [filterTags, setFilterTags] = useState<string[]>([]);
  const [sortField, setSortField] = useState<"name" | "engagement">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState<ColumnKey[]>(allColumns.map(c => c.key));
  const [showColumnPicker, setShowColumnPicker] = useState(false);

  // Collect all tags in use (merge predefined + person tags)
  const allTagsInUse = useMemo(() => {
    const s = new Set<string>(tags);
    people.forEach(p => p.tags.forEach(t => s.add(t)));
    return Array.from(s).sort();
  }, [people, tags]);

  const toggleFilterTag = (tag: string) => {
    setFilterTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filtered = useMemo(() => {
    let result = people.filter((p) => {
      const s = search.toLowerCase();
      const matchesSearch = !s || p.name.toLowerCase().includes(s) ||
        p.tags.some(t => t.toLowerCase().includes(s)) ||
        p.notes.toLowerCase().includes(s);
      const matchesMinistry = filterMinistries.length === 0 || filterMinistries.some(m => p.ministries.includes(m));
      const matchesRole = filterRoles.length === 0 || filterRoles.some(r => p.roles.includes(r));
      const matchesEngagement = filterEngagement.length === 0 || filterEngagement.includes(p.engagement);
      const matchesTags = filterTags.length === 0 || filterTags.every(t => p.tags.includes(t));
      return matchesSearch && matchesMinistry && matchesRole && matchesEngagement && matchesTags;
    });
    result.sort((a, b) => {
      const cmp = String(a[sortField]).localeCompare(String(b[sortField]));
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [people, search, filterMinistries, filterRoles, filterEngagement, filterTags, sortField, sortAsc]);

  const toggleSort = (field: "name" | "engagement") => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const activeFilters = filterMinistries.length + filterRoles.length + filterEngagement.length + filterTags.length;
  const isCol = (k: ColumnKey) => visibleColumns.includes(k);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "person" : "people"}
        </p>
        <div className="flex items-center gap-2">
          {/* Column visibility */}
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
                    onCheckedChange={() => {
                      setVisibleColumns(prev =>
                        prev.includes(col.key) ? prev.filter(c => c !== col.key) : [...prev, col.key]
                      );
                    }}
                  />
                  {col.label}
                </label>
              ))}
            </PopoverContent>
          </Popover>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" className="h-8 px-3" onClick={() => setViewMode("list")}>
              <List size={16} />
            </Button>
            <Button variant={viewMode === "cards" ? "default" : "ghost"} size="sm" className="h-8 px-3" onClick={() => setViewMode("cards")}>
              <Grid3X3 size={16} />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, tag, or note…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11" />
        </div>
        <MultiSelectFilter label="Ministry" options={ministries} selected={filterMinistries} onChange={setFilterMinistries} />
        <MultiSelectFilter label="Role" options={roles} selected={filterRoles} onChange={setFilterRoles} />
        <MultiSelectFilter label="Engagement" options={Object.keys(engagementLabels)} selected={filterEngagement} onChange={setFilterEngagement} />
        <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className="gap-2 h-10">
          <Filter size={16} /> Tags
          {filterTags.length > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">{filterTags.length}</Badge>}
        </Button>
        {activeFilters > 0 && (
          <Button variant="ghost" size="sm" className="h-10 gap-1 text-muted-foreground" onClick={() => { setFilterMinistries([]); setFilterRoles([]); setFilterEngagement([]); setFilterTags([]); setSearch(""); }}>
            <X size={14} /> Clear all
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="mb-4 p-4 bg-card rounded-lg border border-border">
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
      )}

      {viewMode === "list" && (
        <div className="bg-card rounded-lg border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                {isCol("name") && (
                  <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("name")}>
                    <span className="flex items-center gap-1">Name <SortIcon field="name" /></span>
                  </th>
                )}
                {isCol("engagement") && (
                  <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("engagement")}>
                    <span className="flex items-center gap-1">Engagement <SortIcon field="engagement" /></span>
                  </th>
                )}
                {isCol("roles") && <th className="text-left px-4 py-3 font-medium">Role</th>}
                {isCol("ministries") && <th className="text-left px-4 py-3 font-medium">Ministry</th>}
                {isCol("tags") && <th className="text-left px-4 py-3 font-medium">Tags</th>}
                {isCol("notes") && <th className="text-left px-4 py-3 font-medium">Notes</th>}
                <th className="px-4 py-3 w-20"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(person => (
                <tr key={person.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  {isCol("name") && <td className="px-4 py-3 font-medium">{person.name}</td>}
                  {isCol("engagement") && (
                    <td className="px-4 py-3">
                      <InlineCellSelect
                        options={Object.keys(engagementLabels) as string[]}
                        selected={[person.engagement]}
                        multi={false}
                        renderSelected={() => <Badge className={`${engagementColors[person.engagement]} text-xs cursor-pointer`}>{engagementLabels[person.engagement]}</Badge>}
                        onChange={(sel) => onUpdatePerson({ ...person, engagement: sel[0] as EngagementLevel })}
                      />
                    </td>
                  )}
                  {isCol("roles") && (
                    <td className="px-4 py-3">
                      <InlineCellSelect
                        options={roles}
                        selected={person.roles}
                        multi
                        renderSelected={() => person.roles.length === 0
                          ? <span className="text-muted-foreground italic text-xs cursor-pointer hover:text-foreground">—</span>
                          : <div className="flex flex-wrap gap-1 cursor-pointer">{person.roles.map(r => <Badge key={r} variant="outline" className="text-xs">{r}</Badge>)}</div>
                        }
                        onChange={(sel) => onUpdatePerson({ ...person, roles: sel })}
                      />
                    </td>
                  )}
                  {isCol("ministries") && (
                    <td className="px-4 py-3">
                      <InlineCellSelect
                        options={ministries}
                        selected={person.ministries}
                        multi
                        renderSelected={() => person.ministries.length === 0
                          ? <span className="text-muted-foreground italic text-xs cursor-pointer hover:text-foreground">—</span>
                          : <div className="flex flex-wrap gap-1 cursor-pointer">{person.ministries.map(m => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}</div>
                        }
                        onChange={(sel) => onUpdatePerson({ ...person, ministries: sel })}
                      />
                    </td>
                  )}
                  {isCol("tags") && (
                    <td className="px-4 py-3">
                      <InlineCellSelect
                        options={allTagsInUse}
                        selected={person.tags}
                        multi
                        renderSelected={() => person.tags.length === 0
                          ? <span className="text-muted-foreground italic text-xs cursor-pointer hover:text-foreground">—</span>
                          : <div className="flex flex-wrap gap-1 cursor-pointer">{person.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}</div>
                        }
                        onChange={(sel) => onUpdatePerson({ ...person, tags: sel })}
                      />
                    </td>
                  )}
                  {isCol("notes") && (
                    <td className="px-4 py-3 max-w-[200px]">
                      <p className="text-xs text-muted-foreground truncate">{person.notes || "—"}</p>
                    </td>
                  )}
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditPerson({ ...person })}><Edit2 size={14} /></Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDeletePerson(person.id)}><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={allColumns.length + 1} className="text-center py-12 text-muted-foreground">No people found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(person => (
            <div key={person.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <PersonChip person={person} onUpdatePerson={onUpdatePerson} tags={tags} />
                <div className="flex items-center gap-0.5">
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditPerson({ ...person })}><Edit2 size={14} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => onDeletePerson(person.id)}><Trash2 size={14} /></Button>
                </div>
              </div>
              {person.roles.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {person.roles.map(r => <Badge key={r} variant="secondary" className="text-xs">{r}</Badge>)}
                </div>
              )}
              {person.ministries.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {person.ministries.map(m => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}
                </div>
              )}
              {person.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {person.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs bg-primary/5">{tag}</Badge>)}
                </div>
              )}
              {person.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{person.notes}</p>}
            </div>
          ))}
          {filtered.length === 0 && <p className="col-span-full text-center py-12 text-muted-foreground">No people found.</p>}
        </div>
      )}

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
            <Label>Engagement</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {(Object.keys(engagementLabels) as EngagementLevel[]).map(level => (
                <button
                  key={level}
                  onClick={() => setDraft({ ...draft, engagement: level })}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                    draft.engagement === level ? engagementColors[level] : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {engagementLabels[level]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Ministries</Label>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {ministries.map(m => (
                <button
                  key={m}
                  onClick={() => toggleArrayField("ministries", m)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    draft.ministries.includes(m) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
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
              {roles.map(r => (
                <button
                  key={r}
                  onClick={() => toggleArrayField("roles", r)}
                  className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    draft.roles.includes(r) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
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
            <div className="flex items-center justify-between">
              <Label>Tags</Label>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.map(tag => (
                <span key={tag} className="inline-flex items-center gap-1">
                  <button
                    onClick={() => toggleArrayField("tags", tag)}
                    className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                      draft.tags.includes(tag) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
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
