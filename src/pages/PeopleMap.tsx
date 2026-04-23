import { useState, useRef } from "react";
import { Users, Network, UserCheck, Home, Plus, Settings, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import AllMembersView from "@/components/views/AllMembersView";
import GroupsView from "@/components/views/GroupsView";
import OneToOneView from "@/components/views/OneToOneView";
import HouseholdsView from "@/components/views/HouseholdsView";
import { usePeopleMapData } from "@/hooks/usePeopleMapData";
import { engagementColors, engagementLabels } from "@/data/mockData";

const PeopleMap = () => {
  const {
    people, groups, oneToOnes, groupTypes, ministries, tags, households, loading,
    updatePerson, addPerson, deletePerson,
    updateGroups, updateOneToOnes, updateGroupTypes,
    updateHouseholds,
    addCategory, deleteCategory,
    exportData, importData,
  } = usePeopleMapData();

  const [showSettings, setShowSettings] = useState(false);
  const [newMinistry, setNewMinistry] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [newPersonDraft, setNewPersonDraft] = useState<{
    name: string; engagement: "regular" | "infrequent" | "missing";
    ministries: string[]; tags: string[]; notes: string; followUpNotes: string;
  }>({ name: "", engagement: "regular", ministries: [], tags: [], notes: "", followUpNotes: "" });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPerson = async () => {
    if (!newPersonDraft.name.trim()) return;
    await addPerson({ ...newPersonDraft, name: newPersonDraft.name.trim() });
    setNewPersonDraft({ name: "", engagement: "regular", ministries: [], tags: [], notes: "", followUpNotes: "" });
    setShowAddPerson(false);
  };

  const handleAddMinistry = () => {
    if (newMinistry.trim()) { addCategory("ministry", newMinistry.trim()); setNewMinistry(""); }
  };
  const handleAddTag = () => {
    if (newTag.trim()) { addCategory("tag", newTag.trim()); setNewTag(""); }
  };

  const handleImportFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) importData(file);
    e.target.value = "";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading data…</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">People Map</h1>
          <p className="text-muted-foreground mt-1">{people.length} people</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" size="sm" className="gap-2" onClick={exportData}>
            <Download size={16} /> Export
          </Button>
          <Button variant="outline" size="sm" className="gap-2" onClick={() => fileInputRef.current?.click()}>
            <Upload size={16} /> Import
          </Button>
          <input ref={fileInputRef} type="file" accept=".json" className="hidden" onChange={handleImportFile} />
          <Button variant="outline" size="sm" className="gap-2" onClick={() => setShowSettings(true)}>
            <Settings size={16} /> Categories
          </Button>
          <Button size="sm" className="gap-2" onClick={() => setShowAddPerson(true)}>
            <Plus size={16} /> Add Person
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 h-12">
          <TabsTrigger value="all" className="gap-2 px-4 h-10 text-sm">
            <Users size={16} /> All Members
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2 px-4 h-10 text-sm">
            <Network size={16} /> Small Groups
          </TabsTrigger>
          <TabsTrigger value="121" className="gap-2 px-4 h-10 text-sm">
            <UserCheck size={16} /> 1-to-1
          </TabsTrigger>
          <TabsTrigger value="households" className="gap-2 px-4 h-10 text-sm">
            <Home size={16} /> Households
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AllMembersView
            people={people}
            groups={groups}
            groupTypes={groupTypes}
            households={households}
            onUpdatePerson={updatePerson}
            onDeletePerson={deletePerson}
            onUpdateGroups={updateGroups}
            ministries={ministries}
            tags={tags}
            onAddMinistry={(m) => addCategory("ministry", m)}
            onAddTag={(t) => addCategory("tag", t)}
            onDeleteTag={(t) => deleteCategory("tag", t)}
          />
        </TabsContent>

        <TabsContent value="groups">
          <GroupsView
            people={people}
            groups={groups}
            onUpdateGroups={updateGroups}
            onUpdatePerson={updatePerson}
            groupTypes={groupTypes}
            onUpdateGroupTypes={updateGroupTypes}
            tags={tags}
            ministries={ministries}
          />
        </TabsContent>

        <TabsContent value="households">
          <HouseholdsView
            people={people}
            households={households}
            onUpdateHouseholds={updateHouseholds}
            onUpdatePerson={updatePerson}
            tags={tags}
            ministries={ministries}
          />
        </TabsContent>

        <TabsContent value="121">
          <OneToOneView
            people={people}
            oneToOnes={oneToOnes}
            onUpdateOneToOnes={updateOneToOnes}
            onUpdatePerson={updatePerson}
            tags={tags}
            ministries={ministries}
            groups={groups}
            groupTypes={groupTypes}
          />
        </TabsContent>
      </Tabs>

      {/* Add Person Dialog */}
      <Dialog open={showAddPerson} onOpenChange={(open) => {
        setShowAddPerson(open);
        if (!open) setNewPersonDraft({ name: "", engagement: "regular", ministries: [], tags: [], notes: "", followUpNotes: "" });
      }}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Add Person</DialogTitle></DialogHeader>
          <div className="space-y-4 mt-2">
            <div>
              <Label>Name</Label>
              <Input
                className="mt-1"
                placeholder="Full name"
                value={newPersonDraft.name}
                onChange={e => setNewPersonDraft(d => ({ ...d, name: e.target.value }))}
                onKeyDown={e => e.key === "Enter" && handleAddPerson()}
                autoFocus
              />
            </div>
            <div>
              <Label>Church Engagement</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(["regular", "infrequent", "missing"] as const).map(level => (
                  <button key={level} onClick={() => setNewPersonDraft(d => ({ ...d, engagement: level }))}
                    className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                      newPersonDraft.engagement === level ? engagementColors[level] : "bg-muted text-muted-foreground hover:bg-muted/80"
                    }`}>
                    {engagementLabels[level]}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Serving In (Ministries)</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[...ministries].sort().map(m => (
                  <button key={m} onClick={() => setNewPersonDraft(d => ({
                    ...d, ministries: d.ministries.includes(m) ? d.ministries.filter(x => x !== m) : [...d.ministries, m],
                  }))} className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    newPersonDraft.ministries.includes(m) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  }`}>
                    {newPersonDraft.ministries.includes(m) ? "✓ " : ""}{m}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Tags</Label>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[...tags].sort().map(t => (
                  <button key={t} onClick={() => setNewPersonDraft(d => ({
                    ...d, tags: d.tags.includes(t) ? d.tags.filter(x => x !== t) : [...d.tags, t],
                  }))} className={`text-xs px-2.5 py-1 rounded-full border transition-all ${
                    newPersonDraft.tags.includes(t) ? "bg-primary/10 border-primary/40 text-primary" : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                  }`}>
                    {newPersonDraft.tags.includes(t) ? "✓ " : ""}{t}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label>Notes</Label>
              <Textarea className="mt-1" rows={2} value={newPersonDraft.notes} onChange={e => setNewPersonDraft(d => ({ ...d, notes: e.target.value }))} />
            </div>
            <div>
              <Label>Follow-up Notes</Label>
              <Textarea className="mt-1" rows={2} value={newPersonDraft.followUpNotes} onChange={e => setNewPersonDraft(d => ({ ...d, followUpNotes: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="outline" onClick={() => setShowAddPerson(false)}>Cancel</Button>
              <Button onClick={handleAddPerson} disabled={!newPersonDraft.name.trim()}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings / Categories Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Manage Categories</DialogTitle></DialogHeader>
          <div className="space-y-6 mt-2">
            <div>
              <p className="font-medium text-sm mb-2">Ministries (Serving In)</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[...ministries].sort().map(m => (
                  <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border flex items-center gap-1">
                    {m}
                    <button onClick={() => deleteCategory("ministry", m)} className="text-muted-foreground hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newMinistry} onChange={e => setNewMinistry(e.target.value)} placeholder="Add ministry…" className="h-8 text-sm" onKeyDown={e => e.key === "Enter" && handleAddMinistry()} />
                <Button size="sm" onClick={handleAddMinistry}>Add</Button>
              </div>
            </div>

            <div>
              <p className="font-medium text-sm mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[...tags].sort().map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border flex items-center gap-1">
                    {t}
                    <button onClick={() => deleteCategory("tag", t)} className="text-muted-foreground hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add tag…" className="h-8 text-sm" onKeyDown={e => e.key === "Enter" && handleAddTag()} />
                <Button size="sm" onClick={handleAddTag}>Add</Button>
              </div>
            </div>

          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeopleMap;
