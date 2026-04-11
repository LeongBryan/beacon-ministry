import { useState, useMemo } from "react";
import { Search, Filter, ChevronDown, ChevronUp, X, Edit2, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  people as initialPeople,
  ministries,
  categoryColors,
  statusColors,
  categoryLabels,
  statusLabels,
  type Person,
  type PersonCategory,
  type PersonStatus,
} from "@/data/mockData";

const PeopleMap = () => {
  const [search, setSearch] = useState("");
  const [filterMinistry, setFilterMinistry] = useState<string>("all");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [sortField, setSortField] = useState<"name" | "category" | "status">("name");
  const [sortAsc, setSortAsc] = useState(true);
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [editPerson, setEditPerson] = useState<Person | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = people.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.tags.some((t) => t.toLowerCase().includes(search.toLowerCase())) ||
        p.notes.toLowerCase().includes(search.toLowerCase());
      const matchesMinistry =
        filterMinistry === "all" ||
        p.assignments.some((a) => a.ministry === filterMinistry);
      const matchesCategory =
        filterCategory === "all" || p.category === filterCategory;
      const matchesStatus =
        filterStatus === "all" || p.status === filterStatus;
      return matchesSearch && matchesMinistry && matchesCategory && matchesStatus;
    });

    result.sort((a, b) => {
      const valA = a[sortField];
      const valB = b[sortField];
      const cmp = String(valA).localeCompare(String(valB));
      return sortAsc ? cmp : -cmp;
    });

    return result;
  }, [people, search, filterMinistry, filterCategory, filterStatus, sortField, sortAsc]);

  const toggleSort = (field: "name" | "category" | "status") => {
    if (sortField === field) setSortAsc(!sortAsc);
    else { setSortField(field); setSortAsc(true); }
  };

  const SortIcon = ({ field }: { field: string }) => {
    if (sortField !== field) return null;
    return sortAsc ? <ChevronUp size={14} /> : <ChevronDown size={14} />;
  };

  const handleSave = (updated: Person) => {
    setPeople((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
    setEditPerson(null);
  };

  const activeFilters = [filterMinistry, filterCategory, filterStatus].filter(f => f !== "all").length;

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">People Map</h1>
          <p className="text-muted-foreground mt-1">
            {filtered.length} {filtered.length === 1 ? "person" : "people"}
          </p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus size={18} /> Add Person
        </Button>
      </div>

      {/* Search + Filter toggle */}
      <div className="flex gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by name, tag, or note…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 h-11"
          />
        </div>
        <Button
          variant={showFilters ? "default" : "outline"}
          onClick={() => setShowFilters(!showFilters)}
          className="gap-2 h-11"
        >
          <Filter size={16} />
          Filters
          {activeFilters > 0 && (
            <Badge variant="secondary" className="ml-1 h-5 w-5 p-0 flex items-center justify-center text-xs">
              {activeFilters}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filter row */}
      {showFilters && (
        <div className="flex flex-wrap gap-3 mb-4 p-4 bg-card rounded-lg border border-border">
          <Select value={filterMinistry} onValueChange={setFilterMinistry}>
            <SelectTrigger className="w-48 h-10">
              <SelectValue placeholder="Ministry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Ministries</SelectItem>
              {ministries.map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-40 h-10">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {Object.entries(categoryLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-40 h-10">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              {Object.entries(statusLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {activeFilters > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterMinistry("all");
                setFilterCategory("all");
                setFilterStatus("all");
              }}
              className="gap-1 text-muted-foreground"
            >
              <X size={14} /> Clear
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th
                className="text-left px-4 py-3 font-medium cursor-pointer select-none"
                onClick={() => toggleSort("name")}
              >
                <span className="flex items-center gap-1">Name <SortIcon field="name" /></span>
              </th>
              <th
                className="text-left px-4 py-3 font-medium cursor-pointer select-none"
                onClick={() => toggleSort("category")}
              >
                <span className="flex items-center gap-1">Category <SortIcon field="category" /></span>
              </th>
              <th
                className="text-left px-4 py-3 font-medium cursor-pointer select-none"
                onClick={() => toggleSort("status")}
              >
                <span className="flex items-center gap-1">Status <SortIcon field="status" /></span>
              </th>
              <th className="text-left px-4 py-3 font-medium">Ministry / Role</th>
              <th className="text-left px-4 py-3 font-medium">Tags</th>
              <th className="text-left px-4 py-3 font-medium">Notes</th>
              <th className="px-4 py-3 w-12"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((person) => (
              <tr
                key={person.id}
                className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors"
              >
                <td className="px-4 py-3 font-medium">{person.name}</td>
                <td className="px-4 py-3">
                  <Badge className={`${categoryColors[person.category]} text-xs`}>
                    {categoryLabels[person.category]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  <Badge className={`${statusColors[person.status]} text-xs`}>
                    {statusLabels[person.status]}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {person.assignments.length === 0 ? (
                    <span className="text-muted-foreground italic">Unassigned</span>
                  ) : (
                    <div className="space-y-1">
                      {person.assignments.map((a, i) => (
                        <div key={i} className="text-xs">
                          <span className="font-medium">{a.ministry}</span>
                          <span className="text-muted-foreground"> — {a.role}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-1">
                    {person.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </td>
                <td className="px-4 py-3 max-w-[200px]">
                  <p className="text-xs text-muted-foreground truncate">{person.notes || "—"}</p>
                  {person.followUpNotes && (
                    <p className="text-xs text-warm-gold truncate mt-0.5">⚑ {person.followUpNotes}</p>
                  )}
                </td>
                <td className="px-4 py-3">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => setEditPerson({ ...person })}
                  >
                    <Edit2 size={14} />
                  </Button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center py-12 text-muted-foreground">
                  No people found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Dialog */}
      {editPerson && (
        <EditPersonDialog
          person={editPerson}
          onSave={handleSave}
          onClose={() => setEditPerson(null)}
        />
      )}
    </div>
  );
};

function EditPersonDialog({
  person,
  onSave,
  onClose,
}: {
  person: Person;
  onSave: (p: Person) => void;
  onClose: () => void;
}) {
  const [draft, setDraft] = useState<Person>(person);

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit — {person.name}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Name</Label>
            <Input
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className="mt-1"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Category</Label>
              <Select
                value={draft.category}
                onValueChange={(v) => setDraft({ ...draft, category: v as PersonCategory })}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select
                value={draft.status}
                onValueChange={(v) => setDraft({ ...draft, status: v as PersonStatus })}
              >
                <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(statusLabels).map(([k, v]) => (
                    <SelectItem key={k} value={k}>{v}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label>Tags (comma-separated)</Label>
            <Input
              value={draft.tags.join(", ")}
              onChange={(e) =>
                setDraft({ ...draft, tags: e.target.value.split(",").map((t) => t.trim()).filter(Boolean) })
              }
              className="mt-1"
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Textarea
              value={draft.notes}
              onChange={(e) => setDraft({ ...draft, notes: e.target.value })}
              className="mt-1"
              rows={2}
            />
          </div>
          <div>
            <Label>Follow-up Notes</Label>
            <Textarea
              value={draft.followUpNotes}
              onChange={(e) => setDraft({ ...draft, followUpNotes: e.target.value })}
              className="mt-1"
              rows={2}
            />
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

export default PeopleMap;
