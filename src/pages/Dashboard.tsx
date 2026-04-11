import { useMemo } from "react";
import { Link } from "react-router-dom";
import { format, parseISO, isBefore } from "date-fns";
import { CalendarDays, MapPin, Users, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { scheduleSlots, bookings, rooms, people } from "@/data/mockData";

const CURRENT_USER = "Sarah Tan";

const Dashboard = () => {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");

  const todaySlots = useMemo(
    () => scheduleSlots.filter((s) => s.date === todayStr && s.people.includes(CURRENT_USER)),
    [todayStr]
  );

  const upcomingSlots = useMemo(
    () =>
      scheduleSlots
        .filter((s) => !isBefore(parseISO(s.date), today) && s.people.includes(CURRENT_USER))
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 5),
    [today]
  );

  const todayBookings = useMemo(
    () => bookings.filter((b) => b.date === todayStr),
    [todayStr]
  );

  const followUps = useMemo(
    () => people.filter((p) => p.status === "follow-up"),
    []
  );

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground">Good {getGreeting()}, Sarah</h1>
        <p className="text-muted-foreground mt-1">{format(today, "EEEE, d MMMM yyyy")}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Today's duties */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <CalendarDays size={18} /> Today's Duties
            </h2>
          </div>
          {todaySlots.length === 0 ? (
            <p className="text-sm text-muted-foreground">No duties today.</p>
          ) : (
            <div className="space-y-2">
              {todaySlots.map((slot) => (
                <div key={slot.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm text-foreground">{slot.ministry}</div>
                  <div className="text-xs text-muted-foreground">{slot.role}</div>
                </div>
              ))}
            </div>
          )}
          <Link to="/my-schedule">
            <Button variant="ghost" size="sm" className="mt-3 gap-1 text-muted-foreground">
              View my schedule <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Room bookings today */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <MapPin size={18} /> Rooms Today
            </h2>
          </div>
          {todayBookings.length === 0 ? (
            <p className="text-sm text-muted-foreground">No bookings today.</p>
          ) : (
            <div className="space-y-2">
              {todayBookings.slice(0, 4).map((b) => (
                <div key={b.id} className="p-3 bg-muted/50 rounded-lg">
                  <div className="font-medium text-sm text-foreground">
                    {rooms.find((r) => r.id === b.roomId)?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {b.startTime}–{b.endTime} · {b.bookedBy}
                  </div>
                </div>
              ))}
              {todayBookings.length > 4 && (
                <p className="text-xs text-muted-foreground">+{todayBookings.length - 4} more</p>
              )}
            </div>
          )}
          <Link to="/rooms">
            <Button variant="ghost" size="sm" className="mt-3 gap-1 text-muted-foreground">
              View room bookings <ArrowRight size={14} />
            </Button>
          </Link>
        </div>

        {/* Follow-ups */}
        <div className="bg-card rounded-lg border border-border p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-foreground flex items-center gap-2">
              <Users size={18} /> Follow-ups
            </h2>
          </div>
          {followUps.length === 0 ? (
            <p className="text-sm text-muted-foreground">No follow-ups needed.</p>
          ) : (
            <div className="space-y-2">
              {followUps.map((p) => (
                <div key={p.id} className="p-3 bg-warm-gold-light/50 rounded-lg">
                  <div className="font-medium text-sm text-foreground">{p.name}</div>
                  <div className="text-xs text-muted-foreground">{p.followUpNotes || p.notes}</div>
                </div>
              ))}
            </div>
          )}
          <Link to="/people">
            <Button variant="ghost" size="sm" className="mt-3 gap-1 text-muted-foreground">
              View people map <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Upcoming duties */}
      {upcomingSlots.length > 0 && (
        <div className="mt-6 bg-card rounded-lg border border-border p-5">
          <h2 className="font-semibold text-foreground mb-4">Upcoming Duties</h2>
          <div className="space-y-2">
            {upcomingSlots.map((slot) => (
              <div key={slot.id} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                <div className="text-center min-w-[50px]">
                  <div className="text-xs text-muted-foreground">{format(parseISO(slot.date), "EEE")}</div>
                  <div className="text-lg font-bold text-foreground">{format(parseISO(slot.date), "d")}</div>
                </div>
                <div>
                  <div className="font-medium text-sm text-foreground">{slot.ministry}</div>
                  <div className="text-xs text-muted-foreground">{slot.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "morning";
  if (hour < 17) return "afternoon";
  return "evening";
}

export default Dashboard;
