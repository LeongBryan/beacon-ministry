import { useState, useMemo } from "react";
import { format, addDays, startOfWeek, isSameDay, parseISO } from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { rooms, bookings as initialBookings, ministries, type Booking } from "@/data/mockData";

const timeSlots: string[] = [];
for (let h = 7; h <= 21; h++) {
  timeSlots.push(`${String(h).padStart(2, "0")}:00`);
  timeSlots.push(`${String(h).padStart(2, "0")}:30`);
}

const RoomBooking = () => {
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [weekStart, setWeekStart] = useState(() => startOfWeek(new Date(), { weekStartsOn: 1 }));
  const [selectedDay, setSelectedDay] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<"week" | "day">("day");
  const [showBookingDialog, setShowBookingDialog] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  const weekDays = useMemo(() =>
    Array.from({ length: 7 }, (_, i) => addDays(weekStart, i)),
    [weekStart]
  );

  const dayBookings = useMemo(() => {
    const dateStr = format(selectedDay, "yyyy-MM-dd");
    return bookings.filter((b) => b.date === dateStr);
  }, [bookings, selectedDay]);

  const getBookingStyle = (booking: Booking) => {
    const [sh, sm] = booking.startTime.split(":").map(Number);
    const [eh, em] = booking.endTime.split(":").map(Number);
    const startMin = (sh - 7) * 60 + sm;
    const duration = (eh - sh) * 60 + (em - sm);
    const top = (startMin / 30) * 40; // 40px per 30-min slot
    const height = (duration / 30) * 40;
    return { top: `${top}px`, height: `${height}px` };
  };

  const prevWeek = () => setWeekStart(addDays(weekStart, -7));
  const nextWeek = () => setWeekStart(addDays(weekStart, 7));

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">Room Booking</h1>
          <p className="text-muted-foreground mt-1">Book and manage church spaces</p>
        </div>
        <Button size="lg" className="gap-2" onClick={() => { setSelectedBooking(null); setShowBookingDialog(true); }}>
          <Plus size={18} /> New Booking
        </Button>
      </div>

      {/* Week nav */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="outline" size="icon" onClick={prevWeek}><ChevronLeft size={18} /></Button>
        <span className="font-medium text-foreground">
          {format(weekStart, "d MMM")} – {format(addDays(weekStart, 6), "d MMM yyyy")}
        </span>
        <Button variant="outline" size="icon" onClick={nextWeek}><ChevronRight size={18} /></Button>
        <div className="ml-auto flex gap-2">
          <Button
            variant={viewMode === "day" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("day")}
          >
            Day
          </Button>
          <Button
            variant={viewMode === "week" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("week")}
          >
            Week
          </Button>
        </div>
      </div>

      {/* Day selector strip */}
      <div className="flex gap-1 mb-4 overflow-x-auto pb-1">
        {weekDays.map((day) => {
          const isSelected = isSameDay(day, selectedDay);
          const isToday = isSameDay(day, new Date());
          const dayBookingCount = bookings.filter((b) => b.date === format(day, "yyyy-MM-dd")).length;
          return (
            <button
              key={day.toISOString()}
              onClick={() => { setSelectedDay(day); setViewMode("day"); }}
              className={`flex-1 min-w-[80px] px-3 py-2 rounded-lg text-center transition-colors border ${
                isSelected
                  ? "bg-primary text-primary-foreground border-primary"
                  : isToday
                  ? "bg-accent border-accent"
                  : "bg-card border-border hover:bg-muted/50"
              }`}
            >
              <div className="text-xs font-medium">{format(day, "EEE")}</div>
              <div className="text-lg font-semibold">{format(day, "d")}</div>
              {dayBookingCount > 0 && (
                <div className={`text-xs ${isSelected ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
                  {dayBookingCount} booking{dayBookingCount !== 1 ? "s" : ""}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Day grid view */}
      {viewMode === "day" && (
        <div className="bg-card rounded-lg border border-border overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Header */}
            <div className="grid border-b border-border" style={{ gridTemplateColumns: `80px repeat(${rooms.length}, 1fr)` }}>
              <div className="px-3 py-2 text-xs font-medium text-muted-foreground border-r border-border">
                Time
              </div>
              {rooms.map((room) => (
                <div key={room.id} className="px-3 py-2 text-xs font-medium text-center border-r border-border last:border-r-0">
                  {room.name}
                </div>
              ))}
            </div>
            {/* Grid body */}
            <div className="relative grid" style={{ gridTemplateColumns: `80px repeat(${rooms.length}, 1fr)` }}>
              {/* Time column */}
              <div className="border-r border-border">
                {timeSlots.map((time) => (
                  <div
                    key={time}
                    className="h-[40px] px-3 flex items-start pt-1 text-xs text-muted-foreground border-b border-border/50"
                  >
                    {time.endsWith(":00") ? time : ""}
                  </div>
                ))}
              </div>
              {/* Room columns */}
              {rooms.map((room) => {
                const roomBookings = dayBookings.filter((b) => b.roomId === room.id);
                return (
                  <div key={room.id} className="relative border-r border-border last:border-r-0">
                    {timeSlots.map((time) => (
                      <div key={time} className="h-[40px] border-b border-border/50" />
                    ))}
                    {/* Booking blocks */}
                    {roomBookings.map((booking) => {
                      const style = getBookingStyle(booking);
                      return (
                        <button
                          key={booking.id}
                          className="absolute left-1 right-1 bg-primary/15 border-l-[3px] border-primary rounded-r px-2 py-1 overflow-hidden cursor-pointer hover:bg-primary/25 transition-colors"
                          style={style}
                          onClick={() => { setSelectedBooking(booking); setShowBookingDialog(true); }}
                        >
                          <p className="text-xs font-medium text-foreground truncate">{booking.bookedBy}</p>
                          <p className="text-[10px] text-muted-foreground truncate">{booking.ministry}</p>
                          <p className="text-[10px] text-muted-foreground truncate">
                            {booking.startTime}–{booking.endTime}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Week overview */}
      {viewMode === "week" && (
        <div className="bg-card rounded-lg border border-border overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium">Room</th>
                {weekDays.map((day) => (
                  <th key={day.toISOString()} className="text-center px-2 py-3 font-medium text-xs">
                    {format(day, "EEE d")}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rooms.map((room) => (
                <tr key={room.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium whitespace-nowrap">{room.name}</td>
                  {weekDays.map((day) => {
                    const dateStr = format(day, "yyyy-MM-dd");
                    const dayRoomBookings = bookings.filter(
                      (b) => b.roomId === room.id && b.date === dateStr
                    );
                    return (
                      <td key={day.toISOString()} className="px-2 py-2 align-top">
                        {dayRoomBookings.map((b) => (
                          <button
                            key={b.id}
                            onClick={() => { setSelectedBooking(b); setShowBookingDialog(true); }}
                            className="block w-full text-left mb-1 px-2 py-1 bg-primary/10 rounded text-[10px] hover:bg-primary/20 transition-colors"
                          >
                            <div className="font-medium truncate">{b.bookedBy}</div>
                            <div className="text-muted-foreground">{b.startTime}–{b.endTime}</div>
                          </button>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Booking dialog */}
      {showBookingDialog && (
        <BookingDialog
          booking={selectedBooking}
          onClose={() => { setShowBookingDialog(false); setSelectedBooking(null); }}
          onSave={(b) => {
            if (selectedBooking) {
              setBookings((prev) => prev.map((x) => (x.id === b.id ? b : x)));
            } else {
              setBookings((prev) => [...prev, { ...b, id: `b${Date.now()}` }]);
            }
            setShowBookingDialog(false);
            setSelectedBooking(null);
          }}
          onDelete={(id) => {
            setBookings((prev) => prev.filter((x) => x.id !== id));
            setShowBookingDialog(false);
            setSelectedBooking(null);
          }}
          defaultDate={format(selectedDay, "yyyy-MM-dd")}
        />
      )}
    </div>
  );
};

function BookingDialog({
  booking,
  onClose,
  onSave,
  onDelete,
  defaultDate,
}: {
  booking: Booking | null;
  onClose: () => void;
  onSave: (b: Booking) => void;
  onDelete: (id: string) => void;
  defaultDate: string;
}) {
  const [draft, setDraft] = useState<Booking>(
    booking ?? {
      id: "",
      roomId: rooms[0].id,
      date: defaultDate,
      startTime: "09:00",
      endTime: "10:00",
      bookedBy: "",
      ministry: "",
      notes: "",
      recurring: false,
    }
  );

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{booking ? "Edit Booking" : "New Booking"}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-2">
          <div>
            <Label>Room</Label>
            <Select value={draft.roomId} onValueChange={(v) => setDraft({ ...draft, roomId: v })}>
              <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
              <SelectContent>
                {rooms.map((r) => (
                  <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Date</Label>
            <Input type="date" value={draft.date} onChange={(e) => setDraft({ ...draft, date: e.target.value })} className="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Start Time</Label>
              <Input type="time" value={draft.startTime} onChange={(e) => setDraft({ ...draft, startTime: e.target.value })} className="mt-1" />
            </div>
            <div>
              <Label>End Time</Label>
              <Input type="time" value={draft.endTime} onChange={(e) => setDraft({ ...draft, endTime: e.target.value })} className="mt-1" />
            </div>
          </div>
          <div>
            <Label>Booked By</Label>
            <Input value={draft.bookedBy} onChange={(e) => setDraft({ ...draft, bookedBy: e.target.value })} className="mt-1" />
          </div>
          <div>
            <Label>Ministry / Purpose</Label>
            <Select value={draft.ministry} onValueChange={(v) => setDraft({ ...draft, ministry: v })}>
              <SelectTrigger className="mt-1"><SelectValue placeholder="Select ministry" /></SelectTrigger>
              <SelectContent>
                {ministries.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notes</Label>
            <Input value={draft.notes} onChange={(e) => setDraft({ ...draft, notes: e.target.value })} className="mt-1" />
          </div>
          <div className="flex justify-between pt-2">
            <div>
              {booking && (
                <Button variant="destructive" size="sm" onClick={() => onDelete(booking.id)}>
                  Delete
                </Button>
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

export default RoomBooking;
