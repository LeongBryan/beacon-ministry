import { format } from "date-fns";
import { CalendarDays, Clock, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleRoster, currentUser } from "@/data/sampleData";

const MySchedule = () => {
  const myDuties = sampleRoster
    .filter((r) => r.person === currentUser.name)
    .sort((a, b) => a.date.localeCompare(b.date));

  const upcoming = myDuties.filter((d) => new Date(d.date) >= new Date());
  const past = myDuties.filter((d) => new Date(d.date) < new Date());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">My Schedule</h1>
        <p className="text-muted-foreground mt-1">Your upcoming serving duties at a glance</p>
      </div>

      {/* Summary */}
      <Card className="border-border bg-warm-gold-light/30">
        <CardContent className="flex items-center gap-4 p-6">
          <div className="w-14 h-14 rounded-xl bg-warm-gold-light flex items-center justify-center">
            <CalendarDays size={24} className="text-foreground" />
          </div>
          <div>
            <p className="text-3xl font-bold text-foreground">{upcoming.length}</p>
            <p className="text-muted-foreground">Upcoming {upcoming.length === 1 ? "duty" : "duties"}</p>
          </div>
        </CardContent>
      </Card>

      {/* Upcoming */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Coming Up</h2>
        {upcoming.length === 0 ? (
          <Card className="border-border">
            <CardContent className="text-center py-12 text-muted-foreground">
              <p className="text-lg">No upcoming duties 🎉</p>
              <p className="text-sm">Enjoy your rest!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((duty) => (
              <Card key={duty.id} className="border-border hover:shadow-md transition-shadow">
                <CardContent className="flex items-center gap-4 p-5">
                  <div className="text-center min-w-[56px]">
                    <p className="text-2xl font-bold text-foreground">
                      {format(new Date(duty.date), "d")}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase font-medium">
                      {format(new Date(duty.date), "MMM")}
                    </p>
                  </div>
                  <div className="w-px h-12 bg-border" />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-lg">{duty.role}</p>
                    <p className="text-muted-foreground">{duty.ministry}</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {format(new Date(duty.date), "EEEE")}
                    </p>
                  </div>
                  <Badge className="bg-soft-green text-foreground border-0 shrink-0">
                    Upcoming
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Past (if any) */}
      {past.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-foreground mb-4 text-muted-foreground">Past Duties</h2>
          <div className="space-y-2 opacity-60">
            {past.map((duty) => (
              <Card key={duty.id} className="border-border">
                <CardContent className="flex items-center gap-4 p-4">
                  <div className="text-center min-w-[48px]">
                    <p className="text-lg font-bold text-muted-foreground">
                      {format(new Date(duty.date), "d")}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase">
                      {format(new Date(duty.date), "MMM")}
                    </p>
                  </div>
                  <div className="w-px h-10 bg-border" />
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground">{duty.role}</p>
                    <p className="text-sm text-muted-foreground">{duty.ministry}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MySchedule;
