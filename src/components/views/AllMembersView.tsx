import { useState, useMemo } from "react";
import { Search, Filter, ChevronUp, ChevronDown, X, Edit2, Grid3X3, List } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PersonChip from "@/components/PersonChip";
import {
  type Person, type EngagementLevel,
  ministries, engagementColors, engagementLabels,
} from "@/data/mockData";

interface Props {
  people: Person[];
  onUpdatePerson: (p: Person) => void;
}

const AllMembersView = ({ people, onUpdatePerson }: Props) => {
  const [search, setSearch] = useState("");
  const [filterMinistry, setFilterMinistry] = useState("all");
  const [filterEngagement, setFilterEngagement] = useState("all");
  const [sortField, setSortField] = useState<"name" | "engagement">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [viewMode, setViewMode] = useState<"list" | "cards">("list");
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = people.filter((p) => {
      const s = search.toLowerCase();
      const matchesSearch = !s || p.name.toLowerCase().includes(s) ||
        p.tags.some(t => t.toLowerCase().includes(s)) ||
        p.notes.toLowerCase().includes(s);
      const matchesMinistry = filterMinistry === "all" || p.ministries.includes(filterMinistry);
      const matchesEngagement = filterEngagement === "all" || p.engagement === filterEngagement;
      return matchesSearch && matchesMinistry && matchesEngagement;
    });
    result.sort((a, b) => {
      const cmp = String(a[sortField]).localeCompare(String(b[sortField]));
      return sortAsc ? cmp : -cmp;
    });
    return result;
  }, [people, search, filterMinistry, filterEngagement, sortField, sortAsc]);

  const toggleSort = (field: "name" | "engagement") => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const activeFilters = [filterMinistry, filterEngagement].filter(f => f !== "all").length;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? "person" : "people"}
        </p>
        <div className="flex gap-1 bg-muted rounded-lg p-1">
          <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" className="h-8 px-3" onClick={() => setViewMode("list")}>
            <List size={16} />
          </Button>
          <Button variant={viewMode === "cards" ? "default" : "ghost"} size="sm" className="h-8 px-3" onClick={() => setViewMode("cards")}>
            <Grid3X3 size={16} />
          </Button>
        </div>
      </div>

      {/* Search + Filters */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search by name, tag, or note…" value={search} onChange={e => setSearch(e.target.value)} className="pl-10 h-11" />
        </div>
        <Button variant={showFilters ? "default" : "outline"} onClick={() => setShowFilters(!showFilters)} className="gap-2 h-11">
          <Filter size={16} /> Filters
          {activeFilters > 0 && <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">{activeFilters}</Badge>}
        </Button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-4 p-4 bg-card rounded-lg border border-border">
          <Select value={filterMinistry} onValueChange={setFilterMinistry}>
            <SelectTrigger className="w-48 h-10"><SelectValue placeholder="Ministry" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ministries</SelectItem>
              {ministries.map(m => <SelectItem key={m} value={m}>{m}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filterEngagement} onValueChange={setFilterEngagement}>
            <SelectTrigger className="w-40 h-10"><SelectValue placeholder="Engagement" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              {(Object.entries(engagementLabels) as [string, string][]).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}
            </SelectContent>
          </Select>
          {activeFilters > 0 && (
            <Button variant="ghost" size="sm" onClick={() => { setFilterMinistry("all"); setFilterEngagement("all"); }} className="gap-1 text-muted-foreground">
              <X size={14} /> Clear
            </Button>
          )}
        </div>
      )}

      {/* List View */}
      {viewMode === "list" && (
        <div className="bg-card rounded-lg border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  <span className="flex items-center gap-1">Name <SortIcon field="name" /></span>
                </th>
                <th className="text-left px-4 py-3 font-medium cursor-pointer select-none" onClick={() => toggleSort("engagement")}>
                  <span className="flex items-center gap-1">Engagement <SortIcon field="engagement" /></span>
                </th>
                <th className="text-left px-4 py-3 font-medium">Ministries</th>
                <th className="text-left px-4 py-3 font-medium">Tags</th>
                <th className="text-left px-4 py-3 font-medium">Notes</th>
                <th className="px-4 py-3 w-12"></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(person => (
                <tr key={person.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{person.name}</td>
                  <td className="px-4 py-3">
                    <Badge className={`${engagementColors[person.engagement]} text-xs`}>{engagementLabels[person.engagement]}</Badge>
                  </td>
                  <td className="px-4 py-3">
                    {person.ministries.length === 0
                      ? <span className="text-muted-foreground italic text-xs">—</span>
                      : <div className="flex flex-wrap gap-1">{person.ministries.map(m => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}</div>
                    }
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {person.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-xs text-muted-foreground truncate">{person.notes || "—"}</p>
                    {person.followUpNotes && <p className="text-xs text-warm-gold truncate mt-0.5">⚑ {person.followUpNotes}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditPerson({ ...person })}><Edit2 size={14} /></Button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="text-center py-12 text-muted-foreground">No people found.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Cards View */}
      {viewMode === "cards" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(person => (
            <div key={person.id} className="bg-card rounded-lg border border-border p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <PersonChip person={person} onUpdatePerson={onUpdatePerson} />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditPerson({ ...person })}><Edit2 size={14} /></Button>
              </div>
              {person.ministries.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {person.ministries.map(m => <Badge key={m} variant="outline" className="text-xs">{m}</Badge>)}
                </div>
              )}
              {person.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {person.tags.map(tag => <Badge key={tag} variant="secondary" className="text-xs">{tag}</Badge>)}
                </div>
              )}
              {person.notes && <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{person.notes}</p>}
              {person.followUpNotes && <p className="text-xs text-warm-gold mt-1">⚑ {person.followUpNotes}</p>}
            </div>
          ))}
          {filtered.length === 0 && <p className="col-span-full text-center py-12 text-muted-foreground">No people found.</p>}
        </div>
      )}

      {/* Edit Dialog */}
      {editPerson && <EditPersonDialog person={editPerson} onSave={(p) => { onUpdatePerson(p); setEditPerson(null); }} onClose={() => setEditPerson(null)} />}
    </div>
  );
};

function EditPersonDialog({ person, onSave, onClose }: { person: Person; onSave: (p: Person) => void; onClose: () => void }) {
  const [draft, setDraft] = useState<Person>(person);
  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Edit — {person.name}</DialogTitle></DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Name</Label>
            <Input value={draft.name} onChange={e => setDraft({ ...draft, name: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Engagement</Label>
            <Select value={draft.engagement} onValueChange={v => setDraft({ ...draft, engagement: v as EngagementLevel })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>{(Object.entries(engagementLabels) as [string, string][]).map(([k, v]) => <SelectItem key={k} value={k}>{v}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div>
            <Label>Tags (comma-separated)</Label>
            <Input value={draft.tags.join(", ")} onChange={e => setDraft({ ...draft, tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean) })} className="mt-1" />
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
