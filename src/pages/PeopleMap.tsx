import { useState, useRef } from "react";
import { Users, Network, UserCheck, Plus, Settings, Download, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import AllMembersView from "@/components/views/AllMembersView";
import GroupsView from "@/components/views/GroupsView";
import OneToOneView from "@/components/views/OneToOneView";
import { usePeopleMapData } from "@/hooks/usePeopleMapData";

const PeopleMap = () => {
  const {
    people, groups, oneToOnes, groupTypes, ministries, roles, tags, loading,
    updatePerson, addPerson, deletePerson,
    updateGroups, updateOneToOnes, updateGroupTypes,
    addCategory, deleteCategory,
    exportData, importData,
  } = usePeopleMapData();

  const [showSettings, setShowSettings] = useState(false);
  const [newMinistry, setNewMinistry] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newTag, setNewTag] = useState("");
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPerson = async () => {
    if (!newPersonName.trim()) return;
    await addPerson(newPersonName.trim());
    setNewPersonName("");
    setShowAddPerson(false);
  };

  const handleAddMinistry = () => {
    if (newMinistry.trim()) { addCategory("ministry", newMinistry.trim()); setNewMinistry(""); }
  };
  const handleAddRole = () => {
    if (newRole.trim()) { addCategory("role", newRole.trim()); setNewRole(""); }
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
        </TabsList>

        <TabsContent value="all">
          <AllMembersView
            people={people}
            groups={groups}
            groupTypes={groupTypes}
            onUpdatePerson={updatePerson}
            onDeletePerson={deletePerson}
            onUpdateGroups={updateGroups}
            ministries={ministries}
            roles={roles}
            tags={tags}
            onAddMinistry={(m) => addCategory("ministry", m)}
            onAddRole={(r) => addCategory("role", r)}
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
            roles={roles}
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
            roles={roles}
          />
        </TabsContent>
      </Tabs>

      {/* Add Person Dialog */}
      <Dialog open={showAddPerson} onOpenChange={setShowAddPerson}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Add Person</DialogTitle></DialogHeader>
          <div className="space-y-3 mt-2">
            <Input placeholder="Name" value={newPersonName} onChange={e => setNewPersonName(e.target.value)} onKeyDown={e => e.key === "Enter" && handleAddPerson()} />
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddPerson(false)}>Cancel</Button>
              <Button onClick={handleAddPerson}>Add</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Settings Dialog */}
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
              <p className="font-medium text-sm mb-2">Roles</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[...roles].sort().map(r => (
                  <span key={r} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border flex items-center gap-1">
                    {r}
                    <button onClick={() => deleteCategory("role", r)} className="text-muted-foreground hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Add role…" className="h-8 text-sm" onKeyDown={e => e.key === "Enter" && handleAddRole()} />
                <Button size="sm" onClick={handleAddRole}>Add</Button>
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
