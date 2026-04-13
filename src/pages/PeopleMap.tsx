import { useState } from "react";
import { Users, Network, UserCheck, Plus, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import AllMembersView from "@/components/views/AllMembersView";
import GroupsView from "@/components/views/GroupsView";
import OneToOneView from "@/components/views/OneToOneView";
import {
  people as initialPeople,
  groups as initialGroups,
  oneToOnes as initialOneToOnes,
  defaultMinistries,
  defaultRoles,
  defaultTags,
  defaultGroupTypes,
  type Person,
  type Group,
  type OneToOne,
  type GroupType as GroupTypeT,
} from "@/data/mockData";

const PeopleMap = () => {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [groups, setGroups] = useState<Group[]>(initialGroups);
  const [oneToOnes, setOneToOnes] = useState<OneToOne[]>(initialOneToOnes);

  // Dynamic categories
  const [ministries, setMinistries] = useState<string[]>(defaultMinistries);
  const [roles, setRoles] = useState<string[]>(defaultRoles);
  const [tags, setTags] = useState<string[]>(defaultTags);
  const [groupTypes, setGroupTypes] = useState<GroupTypeT[]>(defaultGroupTypes);

  // Settings dialog
  const [showSettings, setShowSettings] = useState(false);
  const [newMinistry, setNewMinistry] = useState("");
  const [newRole, setNewRole] = useState("");
  const [newTag, setNewTag] = useState("");

  // Add person dialog
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [newPersonName, setNewPersonName] = useState("");

  const handleUpdatePerson = (updated: Person) => {
    setPeople(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const handleDeletePerson = (personId: string) => {
    setPeople(prev => prev.filter(p => p.id !== personId));
    setGroups(prev => prev.map(g => ({ ...g, members: g.members.filter(m => m !== personId) })));
    setOneToOnes(prev => prev.filter(o => o.personA !== personId && o.personB !== personId));
  };

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    const newPerson: Person = {
      id: `p-${Date.now()}`,
      name: newPersonName.trim(),
      engagement: "regular",
      roles: [],
      tags: [],
      notes: "",
      followUpNotes: "",
      ministries: [],
    };
    setPeople(prev => [...prev, newPerson]);
    setNewPersonName("");
    setShowAddPerson(false);
  };

  const addMinistry = () => {
    if (newMinistry.trim() && !ministries.includes(newMinistry.trim())) {
      setMinistries(prev => [...prev, newMinistry.trim()]);
      setNewMinistry("");
    }
  };

  const addRole = () => {
    if (newRole.trim() && !roles.includes(newRole.trim())) {
      setRoles(prev => [...prev, newRole.trim()]);
      setNewRole("");
    }
  };

  const addTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">People Map</h1>
          <p className="text-muted-foreground mt-1">{people.length} people</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="lg" className="gap-2" onClick={() => setShowSettings(true)}>
            <Settings size={18} /> Manage Categories
          </Button>
          <Button size="lg" className="gap-2" onClick={() => setShowAddPerson(true)}>
            <Plus size={18} /> Add Person
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-6 h-12">
          <TabsTrigger value="all" className="gap-2 px-4 h-10 text-sm">
            <Users size={16} /> All Members
          </TabsTrigger>
          <TabsTrigger value="groups" className="gap-2 px-4 h-10 text-sm">
            <Network size={16} /> Groups
          </TabsTrigger>
          <TabsTrigger value="121" className="gap-2 px-4 h-10 text-sm">
            <UserCheck size={16} /> 1-to-1
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AllMembersView
            people={people}
            onUpdatePerson={handleUpdatePerson}
            onDeletePerson={handleDeletePerson}
            ministries={ministries}
            roles={roles}
            tags={tags}
            onAddMinistry={(m) => { if (!ministries.includes(m)) setMinistries(prev => [...prev, m]); }}
            onAddRole={(r) => { if (!roles.includes(r)) setRoles(prev => [...prev, r]); }}
            onAddTag={(t) => { if (!tags.includes(t)) setTags(prev => [...prev, t]); }}
            onDeleteTag={(t) => setTags(prev => prev.filter(x => x !== t))}
          />
        </TabsContent>

        <TabsContent value="groups">
          <GroupsView
            people={people}
            groups={groups}
            onUpdateGroups={setGroups}
            onUpdatePerson={handleUpdatePerson}
            groupTypes={groupTypes}
            onUpdateGroupTypes={setGroupTypes}
            tags={tags}
            ministries={ministries}
            roles={roles}
          />
        </TabsContent>

        <TabsContent value="121">
          <OneToOneView
            people={people}
            oneToOnes={oneToOnes}
            onUpdateOneToOnes={setOneToOnes}
            onUpdatePerson={handleUpdatePerson}
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
            {/* Ministries */}
            <div>
              <p className="font-medium text-sm mb-2">Ministries</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {ministries.map(m => (
                  <span key={m} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border flex items-center gap-1">
                    {m}
                    <button onClick={() => setMinistries(prev => prev.filter(x => x !== m))} className="text-muted-foreground hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newMinistry} onChange={e => setNewMinistry(e.target.value)} placeholder="Add ministry…" className="h-8 text-sm" onKeyDown={e => e.key === "Enter" && addMinistry()} />
                <Button size="sm" onClick={addMinistry}>Add</Button>
              </div>
            </div>

            {/* Roles */}
            <div>
              <p className="font-medium text-sm mb-2">Roles</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {roles.map(r => (
                  <span key={r} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border flex items-center gap-1">
                    {r}
                    <button onClick={() => setRoles(prev => prev.filter(x => x !== r))} className="text-muted-foreground hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Add role…" className="h-8 text-sm" onKeyDown={e => e.key === "Enter" && addRole()} />
                <Button size="sm" onClick={addRole}>Add</Button>
              </div>
            </div>

            {/* Tags */}
            <div>
              <p className="font-medium text-sm mb-2">Tags</p>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {tags.map(t => (
                  <span key={t} className="text-xs px-2.5 py-1 rounded-full bg-muted border border-border flex items-center gap-1">
                    {t}
                    <button onClick={() => setTags(prev => prev.filter(x => x !== t))} className="text-muted-foreground hover:text-destructive">×</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <Input value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Add tag…" className="h-8 text-sm" onKeyDown={e => e.key === "Enter" && addTag()} />
                <Button size="sm" onClick={addTag}>Add</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PeopleMap;
