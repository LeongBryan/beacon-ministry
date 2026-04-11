import { useState, useMemo } from "react";
import { format, addDays, startOfWeek, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Edit2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { scheduleSlots as initialSlots, ministries, type ScheduleSlot } from "@/data/mockData";

const Schedule = () => {
  const [slots, setSlots] = useState<ScheduleSlot[]>(initialSlots);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [filterMinistry, setFilterMinistry] = useState<string>("all");
  const [editSlot, setEditSlot] = useState<ScheduleSlot | null>(null);
  const [showNew, setShowNew] = useState(false);

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const displayMinistries = useMemo(() => {
    if (filterMinistry !== "all") return [filterMinistry];
    // Only show ministries that have slots this week
    const weekDates = weekDays.map((d) => format(d, "yyyy-MM-dd"));
    const active = new Set(
      slots.filter((s) => weekDates.includes(s.date)).map((s) => s.ministry)
    );
    return ministries.filter((m) => active.has(m));
  }, [filterMinistry, slots, weekDays]);

  const getSlots = (ministry: string, date: string) =>
    slots.filter((s) => s.ministry === ministry && s.date === date);

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Schedule</h1>
          <p className="text-muted-foreground mt-1">Plan who serves where and when</p>
        </div>
        <Button size="lg" className="gap-2" onClick={() => { setEditSlot(null); setShowNew(true); }}>
          <Plus size={18} /> Add Slot
        </Button>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, -7))}>
          <ChevronLeft size={18} />
        </Button>
        <span className="font-medium text-foreground">
          {format(weekStart, "d MMM")} – {format(addDays(weekStart, 6), "d MMM yyyy")}
        </span>
        <Button variant="outline" size="icon" onClick={() => setWeekStart(addDays(weekStart, 7))}>
          <ChevronRight size={18} />
        </Button>
        <Select value={filterMinistry} onValueChange={setFilterMinistry}>
          <SelectTrigger className="w-48 ml-auto">
            <SelectValue placeholder="All Ministries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Ministries</SelectItem>
            {ministries.map((m) => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Function-first grid */}
      <div className="bg-card rounded-lg border border-border overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-4 py-3 font-medium min-w-[160px] sticky left-0 bg-muted/50">
                Ministry
              </th>
              {weekDays.map((day) => (
                <th key={day.toISOString()} className="text-center px-2 py-3 font-medium text-xs min-w-[120px]">
                  <div>{format(day, "EEE")}</div>
                  <div className="text-muted-foreground">{format(day, "d MMM")}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {displayMinistries.length === 0 ? (
              <tr>
                <td colSpan={8} className="text-center py-12 text-muted-foreground">
                  No schedule data for this week.
                </td>
              </tr>
            ) : (
              displayMinistries.map((ministry) => (
                <tr key={ministry} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium align-top sticky left-0 bg-card">
                    {ministry}
                  </td>
                  {weekDays.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const daySlots = getSlots(ministry, dateStr);
                    return (
                      <td key={day.toISOString()} className="px-2 py-2 align-top">
                        {daySlots.length === 0 ? (
                          <span className="text-xs text-muted-foreground/50">—</span>
                        ) : (
                          <div className="space-y-1.5">
                            {daySlots.map((slot) => (
                              <button
                                key={slot.id}
                                onClick={() => setEditSlot({ ...slot })}
                                className="block w-full text-left px-2 py-1.5 bg-primary/10 rounded hover:bg-primary/20 transition-colors"
                              >
                                <div className="text-[10px] text-muted-foreground font-medium">{slot.role}</div>
                                <div className="text-xs">
                                  {slot.people.map((name, i) => (
                                    <div key={i} className="font-medium">{name}</div>
                                  ))}
                                </div>
                                {slot.notes && (
                                  <div className="text-[10px] text-muted-foreground mt-0.5 truncate">{slot.notes}</div>
                                )}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Edit/New dialog */}
      {(editSlot || showNew) && (
        <SlotDialog
          slot={editSlot}
          onClose={() => { setEditSlot(null); setShowNew(false); }}
          onSave={(s) => {
            if (editSlot) {
              setSlots((prev) => prev.map((x) => (x.id === s.id ? s : x)));
            } else {
              setSlots((prev) => [...prev, { ...s, id: `s${Date.now()}` }]);
            }
            setEditSlot(null);
            setShowNew(false);
          }}
          onDelete={(id) => {
            setSlots((prev) => prev.filter((x) => x.id !== id));
            setEditSlot(null);
            setShowNew(false);
          }}
          defaultDate={format(weekDays[0], "yyyy-MM-dd")}
        />
      )}
    </div>
  );
};

function SlotDialog({
  slot,
  onClose,
  onSave,
  onDelete,
  defaultDate,
}: {
  slot: ScheduleSlot | null;
  onClose: () => void;
  onSave: (s: ScheduleSlot) => void;
  onDelete: (id: string) => void;
  defaultDate: string;
}) {
  const [draft, setDraft] = useState<ScheduleSlot>(
    slot ?? {
      id: "",
      date: defaultDate,
      ministry: ministries[0],
      role: "",
      people: [],
      notes: "",
    }
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{slot ? "Edit Schedule Slot" : "New Schedule Slot"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Ministry</Label>
            <Select value={draft.ministry} onValueChange={(v) => setDraft({ ...draft, ministry: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {ministries.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Role</Label>
            <Input value={draft.role} onChange={(e) => setDraft({ ...draft, role: e.target.value })} className="mt-1" placeholder="e.g. Worship Leader, Usher" />
          </div>
          <div>
            <Label>People (one per line)</Label>
            <Textarea
              value={draft.people.join("\n")}
              onChange={(e) => setDraft({ ...draft, people: e.target.value.split("\n").filter(Boolean) })}
              className="mt-1"
              rows={3}
              placeholder="Grace Tan&#10;Anna Seow&#10;Luke Lee"
            />
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="mt-1" />
          </div>
          <div className="flex justify-between pt-2">
            <div>
              {slot && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(slot.id)}>Delete</Button>
              )}
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button onClick={() => onSave(draft)}>Save</Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default Schedule;
