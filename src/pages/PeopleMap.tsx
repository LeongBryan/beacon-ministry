import { useState } from "react";
import { Users, Network, UserCheck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AllMembersView from "@/components/views/AllMembersView";
import GroupsView from "@/components/views/GroupsView";
import OneToOneView from "@/components/views/OneToOneView";
import {
  people as initialPeople,
  groups as initialGroups,
  oneToOnes,
  type Person,
  type Group,
} from "@/data/mockData";

const PeopleMap = () => {
  const [people, setPeople] = useState<Person[]>(initialPeople);
  const [groups, setGroups] = useState<Group[]>(initialGroups);

  const handleUpdatePerson = (updated: Person) => {
    setPeople(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">People Map</h1>
          <p className="text-muted-foreground mt-1">{people.length} people</p>
        </div>
        <Button size="lg" className="gap-2">
          <Plus size={18} /> Add Person
        </Button>
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
          <AllMembersView people={people} onUpdatePerson={handleUpdatePerson} />
        </TabsContent>

        <TabsContent value="groups">
          <GroupsView people={people} groups={groups} onUpdateGroups={setGroups} />
        </TabsContent>

        <TabsContent value="121">
          <OneToOneView people={people} oneToOnes={oneToOnes} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PeopleMap;
