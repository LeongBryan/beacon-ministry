import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  type Person, type Group, type OneToOne, type GroupType, type GroupMemberMeta,
  people as initialPeople, groups as initialGroups,
  oneToOnes as initialOneToOnes, defaultGroupTypes,
  defaultMinistries, defaultRoles, defaultTags,
} from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

export function usePeopleMapData() {
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [oneToOnes, setOneToOnes] = useState<OneToOne[]>([]);
  const [groupTypes, setGroupTypes] = useState<GroupType[]>([]);
  const [ministries, setMinistries] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;
    loadAll();
  }, []);

  async function loadAll() {
    setLoading(true);
    try {
      const [pRes, gRes, oRes, gtRes, cRes] = await Promise.all([
        supabase.from("people").select("*"),
        supabase.from("groups").select("*"),
        supabase.from("one_to_ones").select("*"),
        supabase.from("group_types").select("*"),
        supabase.from("categories").select("*"),
      ]);

      if (!pRes.data?.length) {
        await seedInitialData();
        return;
      }

      setPeople((pRes.data || []).map(r => ({
        id: r.id, name: r.name, engagement: r.engagement as Person["engagement"],
        roles: r.roles || [], tags: r.tags || [], notes: r.notes || "",
        followUpNotes: r.follow_up_notes || "", ministries: r.ministries || [],
      })));
      setGroupTypes((gtRes.data || []).map(r => ({ id: r.id, label: r.label, color: r.color })));
      setGroups((gRes.data || []).map(r => ({
        id: r.id, typeId: r.type_id, name: r.name,
        members: r.members || [],
        memberMeta: (r.member_legends as Record<string, GroupMemberMeta>) || {},
      })));
      setOneToOnes((oRes.data || []).map(r => ({
        id: r.id, personA: r.person_a, personB: r.person_b,
        frequency: r.frequency as OneToOne["frequency"], notes: r.notes || "",
      })));

      const cats = cRes.data || [];
      setMinistries(cats.filter(c => c.type === "ministry").map(c => c.value));
      setRoles(cats.filter(c => c.type === "role").map(c => c.value));
      setTags(cats.filter(c => c.type === "tag").map(c => c.value));
    } catch (e) {
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  }

  async function seedInitialData() {
    try {
      await supabase.from("group_types").upsert(
        defaultGroupTypes.map(t => ({ id: t.id, label: t.label, color: t.color }))
      );
      await supabase.from("people").upsert(
        initialPeople.map(p => ({
          id: p.id, name: p.name, engagement: p.engagement,
          roles: p.roles, tags: p.tags, notes: p.notes,
          follow_up_notes: p.followUpNotes, ministries: p.ministries,
        }))
      );
      await supabase.from("groups").upsert(
        initialGroups.map(g => ({
          id: g.id, type_id: g.typeId, name: g.name,
          members: g.members, member_legends: g.memberMeta,
        }))
      );
      await supabase.from("one_to_ones").upsert(
        initialOneToOnes.map(o => ({
          id: o.id, person_a: o.personA, person_b: o.personB,
          frequency: o.frequency, notes: o.notes,
        }))
      );
      const catRows = [
        ...defaultMinistries.map(v => ({ type: "ministry", value: v })),
        ...defaultRoles.map(v => ({ type: "role", value: v })),
        ...defaultTags.map(v => ({ type: "tag", value: v })),
      ];
      await supabase.from("categories").upsert(catRows, { onConflict: "type,value" });

      initialized.current = false;
      await loadAll();
    } catch (e) {
      console.error("Seed error:", e);
    }
  }

  const updatePerson = useCallback(async (updated: Person) => {
    setPeople(prev => prev.map(p => p.id === updated.id ? updated : p));
    await supabase.from("people").update({
      name: updated.name, engagement: updated.engagement,
      roles: updated.roles, tags: updated.tags, notes: updated.notes,
      follow_up_notes: updated.followUpNotes, ministries: updated.ministries,
    }).eq("id", updated.id);
  }, []);

  const addPerson = useCallback(async (name: string) => {
    const id = `p-${Date.now()}`;
    const person: Person = { id, name, engagement: "regular", roles: [], tags: [], notes: "", followUpNotes: "", ministries: [] };
    setPeople(prev => [...prev, person]);
    await supabase.from("people").insert({
      id, name, engagement: "regular", roles: [], tags: [], notes: "", follow_up_notes: "", ministries: [],
    });
    return person;
  }, []);

  const deletePerson = useCallback(async (personId: string) => {
    setPeople(prev => prev.filter(p => p.id !== personId));
    setGroups(prev => prev.map(g => ({ ...g, members: g.members.filter(m => m !== personId) })));
    setOneToOnes(prev => prev.filter(o => o.personA !== personId && o.personB !== personId));
    await Promise.all([
      supabase.from("people").delete().eq("id", personId),
      supabase.from("one_to_ones").delete().or(`person_a.eq.${personId},person_b.eq.${personId}`),
    ]);
    const { data: gData } = await supabase.from("groups").select("*");
    if (gData) {
      for (const g of gData) {
        if (g.members?.includes(personId)) {
          await supabase.from("groups").update({ members: g.members.filter((m: string) => m !== personId) }).eq("id", g.id);
        }
      }
    }
  }, []);

  const updateGroups = useCallback(async (newGroups: Group[]) => {
    setGroups(newGroups);
    const ids = newGroups.map(g => g.id);
    const { data: existing } = await supabase.from("groups").select("id");
    const existingIds = (existing || []).map(r => r.id);
    const toDelete = existingIds.filter(id => !ids.includes(id));
    if (toDelete.length) await supabase.from("groups").delete().in("id", toDelete);
    if (newGroups.length) {
      await supabase.from("groups").upsert(
        newGroups.map(g => ({ id: g.id, type_id: g.typeId, name: g.name, members: g.members, member_legends: g.memberMeta }))
      );
    }
  }, []);

  const updateOneToOnes = useCallback(async (newOtos: OneToOne[]) => {
    setOneToOnes(newOtos);
    const ids = newOtos.map(o => o.id);
    const { data: existing } = await supabase.from("one_to_ones").select("id");
    const existingIds = (existing || []).map(r => r.id);
    const toDelete = existingIds.filter(id => !ids.includes(id));
    if (toDelete.length) await supabase.from("one_to_ones").delete().in("id", toDelete);
    if (newOtos.length) {
      await supabase.from("one_to_ones").upsert(
        newOtos.map(o => ({ id: o.id, person_a: o.personA, person_b: o.personB, frequency: o.frequency, notes: o.notes }))
      );
    }
  }, []);

  const updateGroupTypes = useCallback(async (newTypes: GroupType[]) => {
    setGroupTypes(newTypes);
    const ids = newTypes.map(t => t.id);
    const { data: existing } = await supabase.from("group_types").select("id");
    const existingIds = (existing || []).map(r => r.id);
    const toDelete = existingIds.filter(id => !ids.includes(id));
    if (toDelete.length) await supabase.from("group_types").delete().in("id", toDelete);
    if (newTypes.length) {
      await supabase.from("group_types").upsert(newTypes.map(t => ({ id: t.id, label: t.label, color: t.color })));
    }
  }, []);

  const addCategory = useCallback(async (type: "ministry" | "role" | "tag", value: string) => {
    if (type === "ministry") setMinistries(prev => prev.includes(value) ? prev : [...prev, value]);
    if (type === "role") setRoles(prev => prev.includes(value) ? prev : [...prev, value]);
    if (type === "tag") setTags(prev => prev.includes(value) ? prev : [...prev, value]);
    await supabase.from("categories").upsert({ type, value }, { onConflict: "type,value" });
  }, []);

  const deleteCategory = useCallback(async (type: "ministry" | "role" | "tag", value: string) => {
    if (type === "ministry") setMinistries(prev => prev.filter(v => v !== value));
    if (type === "role") setRoles(prev => prev.filter(v => v !== value));
    if (type === "tag") setTags(prev => prev.filter(v => v !== value));
    await supabase.from("categories").delete().eq("type", type).eq("value", value);
  }, []);

  const exportData = useCallback(() => {
    const data = { people, groups, oneToOnes, groupTypes, ministries, roles, tags, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `people-map-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported!", description: "Backup file downloaded." });
  }, [people, groups, oneToOnes, groupTypes, ministries, roles, tags]);

  const importData = useCallback(async (file: File) => {
    try {
      const text = await file.text();
      const data = JSON.parse(text);
      
      if (!data.people || !Array.isArray(data.people)) {
        toast({ title: "Invalid file", description: "File doesn't contain valid People Map data.", variant: "destructive" });
        return;
      }

      await Promise.all([
        supabase.from("one_to_ones").delete().neq("id", ""),
        supabase.from("groups").delete().neq("id", ""),
      ]);
      await supabase.from("people").delete().neq("id", "");
      await supabase.from("group_types").delete().neq("id", "");
      await supabase.from("categories").delete().neq("id", "00000000-0000-0000-0000-000000000000");

      if (data.groupTypes?.length) {
        await supabase.from("group_types").upsert(data.groupTypes.map((t: GroupType) => ({ id: t.id, label: t.label, color: t.color })));
      }
      if (data.people?.length) {
        await supabase.from("people").upsert(data.people.map((p: Person) => ({
          id: p.id, name: p.name, engagement: p.engagement, roles: p.roles, tags: p.tags,
          notes: p.notes, follow_up_notes: p.followUpNotes, ministries: p.ministries,
        })));
      }
      if (data.groups?.length) {
        await supabase.from("groups").upsert(data.groups.map((g: Group) => ({
          id: g.id, type_id: g.typeId, name: g.name, members: g.members,
          member_legends: g.memberMeta || g.memberLegends || {},
        })));
      }
      if (data.oneToOnes?.length) {
        await supabase.from("one_to_ones").upsert(data.oneToOnes.map((o: OneToOne) => ({
          id: o.id, person_a: o.personA, person_b: o.personB, frequency: o.frequency, notes: o.notes,
        })));
      }
      const catRows = [
        ...(data.ministries || []).map((v: string) => ({ type: "ministry", value: v })),
        ...(data.roles || []).map((v: string) => ({ type: "role", value: v })),
        ...(data.tags || []).map((v: string) => ({ type: "tag", value: v })),
      ];
      if (catRows.length) await supabase.from("categories").upsert(catRows, { onConflict: "type,value" });

      setPeople(data.people.map((p: any) => ({ ...p, followUpNotes: p.followUpNotes || "" })));
      setGroups((data.groups || []).map((g: any) => ({ ...g, memberMeta: g.memberMeta || g.memberLegends || {} })));
      setOneToOnes(data.oneToOnes || []);
      setGroupTypes(data.groupTypes || []);
      setMinistries(data.ministries || []);
      setRoles(data.roles || []);
      setTags(data.tags || []);

      toast({ title: "Imported!", description: `${data.people.length} people restored.` });
    } catch (e) {
      console.error("Import error:", e);
      toast({ title: "Import failed", description: String(e), variant: "destructive" });
    }
  }, []);

  return {
    people, groups, oneToOnes, groupTypes, ministries, roles, tags, loading,
    updatePerson, addPerson, deletePerson,
    updateGroups, updateOneToOnes, updateGroupTypes,
    addCategory, deleteCategory,
    exportData, importData,
  };
}
