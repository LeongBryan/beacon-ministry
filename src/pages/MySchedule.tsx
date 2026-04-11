import { useMemo } from "react";
import { format, parseISO, isBefore } from "date-fns";
import { CalendarDays, MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { scheduleSlots, bookings, rooms } from "@/data/mockData";

const CURRENT_USER = "Sarah Tan";

const MySchedule = () => {
  const today = new Date();

  const mySlots = useMemo(() =>
    scheduleSlots
      .filter((s) => s.people.includes(CURRENT_USER))
      .sort((a, b) => a.date.localeCompare(b.date)),
    []
  );

  const myBookings = useMemo(() =>
    bookings
      .filter((b) => b.bookedBy === CURRENT_USER)
      .sort((a, b) => a.date.localeCompare(b.date)),
    []
  );

  const upcomingSlots = mySlots.filter((s) => !isBefore(parseISO(s.date), today));
  const upcomingBookings = myBookings.filter((b) => !isBefore(parseISO(b.date), today));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">My Schedule</h1>
        <p className="text-muted-foreground mt-1">Hi {CURRENT_USER} — here's what's coming up for you.</p>
      </div>

      {/* Serving duties */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <CalendarDays size={20} /> Serving Duties
        </h2>
        {upcomingSlots.length === 0 ? (
          <p className="text-muted-foreground bg-card rounded-lg border border-border p-6 text-center">
            No upcoming serving duties.
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingSlots.map((slot) => (
              <div key={slot.id} className="flex items-start gap-4 bg-card rounded-lg border border-border p-4">
                <div className="text-center min-w-[60px]">
                  <div className="text-xs text-muted-foreground">{format(parseISO(slot.date), "EEE")}</div>
                  <div className="text-xl font-bold text-foreground">{format(parseISO(slot.date), "d")}</div>
                  <div className="text-xs text-muted-foreground">{format(parseISO(slot.date), "MMM")}</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">{slot.ministry}</div>
                  <div className="text-sm text-muted-foreground">{slot.role}</div>
                  {slot.notes && <div className="text-xs text-muted-foreground mt-1">{slot.notes}</div>}
                  {slot.linkedRoom && (
                    <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                      <MapPin size={12} />
                      {rooms.find((r) => r.id === slot.linkedRoom)?.name || slot.linkedRoom}
                    </div>
                  )}
                </div>
                <Badge variant="outline" className="text-xs shrink-0">
                  {slot.people.length > 1 ? `+${slot.people.length - 1} others` : "Solo"}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Room bookings */}
      <section>
        <h2 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <MapPin size={20} /> My Room Bookings
        </h2>
        {upcomingBookings.length === 0 ? (
          <p className="text-muted-foreground bg-card rounded-lg border border-border p-6 text-center">
            No upcoming room bookings.
          </p>
        ) : (
          <div className="space-y-2">
            {upcomingBookings.map((booking) => (
              <div key={booking.id} className="flex items-start gap-4 bg-card rounded-lg border border-border p-4">
                <div className="text-center min-w-[60px]">
                  <div className="text-xs text-muted-foreground">{format(parseISO(booking.date), "EEE")}</div>
                  <div className="text-xl font-bold text-foreground">{format(parseISO(booking.date), "d")}</div>
                  <div className="text-xs text-muted-foreground">{format(parseISO(booking.date), "MMM")}</div>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">
                    {rooms.find((r) => r.id === booking.roomId)?.name}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {booking.startTime} – {booking.endTime}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{booking.ministry}</div>
                  {booking.notes && <div className="text-xs text-muted-foreground">{booking.notes}</div>}
                </div>
                {booking.recurring && (
                  <Badge variant="outline" className="text-xs shrink-0">Recurring</Badge>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MySchedule;
