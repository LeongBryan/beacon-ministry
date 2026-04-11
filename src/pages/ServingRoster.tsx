import { useState } from "react";
import { format, startOfWeek, addDays, addWeeks, subWeeks } from "date-fns";
import { ChevronLeft, ChevronRight, CalendarDays, Users } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { sampleRoster, ministries } from "@/data/sampleData";

const ServingRoster = () => {
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 0 })
  );
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null);
  const [view, setView] = useState<"week" | "month">("week");

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeekStart, i));
  const weekDateStrings = weekDates.map((d) => format(d, "yyyy-MM-dd"));

  const filteredRoster = sampleRoster.filter((entry) => {
    const matchesMinistry = !selectedMinistry || entry.ministry === selectedMinistry;
    const matchesWeek = weekDateStrings.includes(entry.date);
    return matchesMinistry && matchesWeek;
  });

  // Group by date
  const groupedByDate = filteredRoster.reduce((acc, entry) => {
    if (!acc[entry.date]) acc[entry.date] = [];
    acc[entry.date].push(entry);
    return acc;
  }, {} as Record<string, typeof sampleRoster>);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Serving Roster</h1>
        <p className="text-muted-foreground mt-1">See who's serving each week</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekStart(subWeeks(currentWeekStart, 1))}
          >
            <ChevronLeft size={18} />
          </Button>
          <span className="text-base font-medium text-foreground min-w-[200px] text-center">
            {format(currentWeekStart, "d MMM")} – {format(addDays(currentWeekStart, 6), "d MMM yyyy")}
          </span>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentWeekStart(addWeeks(currentWeekStart, 1))}
          >
            <ChevronRight size={18} />
          </Button>
        </div>
        <Button
          variant="outline"
          onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 0 }))}
        >
          This Week
        </Button>
      </div>

      {/* Ministry filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setSelectedMinistry(null)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            !selectedMinistry
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          All Ministries
        </button>
        {ministries
          .filter((m) => sampleRoster.some((r) => r.ministry === m.name))
          .map((ministry) => (
            <button
              key={ministry.id}
              onClick={() =>
                setSelectedMinistry(ministry.name === selectedMinistry ? null : ministry.name)
              }
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedMinistry === ministry.name
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {ministry.name}
            </button>
          ))}
      </div>

      {/* Roster content */}
      {Object.keys(groupedByDate).length === 0 ? (
        <Card className="border-border">
          <CardContent className="text-center py-16 text-muted-foreground">
            <CalendarDays size={40} className="mx-auto mb-3 opacity-40" />
            <p className="text-lg">No schedules for this week</p>
            <p className="text-sm">Try selecting a different week</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedByDate)
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, entries]) => {
              // Group by ministry
              const byMinistry = entries.reduce((acc, e) => {
                if (!acc[e.ministry]) acc[e.ministry] = [];
                acc[e.ministry].push(e);
                return acc;
              }, {} as Record<string, typeof entries>);

              return (
                <Card key={date} className="border-border">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-warm-gold-light flex items-center justify-center">
                        <CalendarDays size={18} className="text-foreground" />
                      </div>
                      {format(new Date(date), "EEEE, d MMMM yyyy")}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(byMinistry).map(([ministry, people]) => (
                      <div key={ministry}>
                        <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                          <Users size={16} className="text-muted-foreground" />
                          {ministry}
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 ml-6">
                          {people.map((person) => (
                            <div
                              key={person.id}
                              className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-soft-green flex items-center justify-center text-xs font-semibold text-foreground">
                                  {person.person
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </div>
                                <span className="font-medium text-foreground text-sm">
                                  {person.person}
                                </span>
                              </div>
                              <Badge variant="outline" className="text-xs">
                                {person.role}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ServingRoster;
