import { format } from "date-fns";
import {
  FolderOpen,
  CalendarDays,
  Megaphone,
  Clock,
  FileText,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleFiles, sampleRoster, sampleAnnouncements, currentUser } from "@/data/sampleData";

const Dashboard = () => {
  const today = new Date();
  const todayStr = format(today, "yyyy-MM-dd");
  const upcomingDuties = sampleRoster.filter((r) => r.person === currentUser.name).slice(0, 3);
  const recentFiles = sampleFiles.slice(0, 4);
  const latestAnnouncements = sampleAnnouncements.slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Greeting */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          Welcome back, {currentUser.name.split(" ")[0]} 🌿
        </h1>
        <p className="text-muted-foreground mt-1 text-lg">
          {format(today, "EEEE, d MMMM yyyy")}
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link to="/my-schedule">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 rounded-xl bg-warm-gold-light flex items-center justify-center">
                <CalendarDays className="text-foreground" size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingDuties.length}</p>
                <p className="text-sm text-muted-foreground">Upcoming duties</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/files">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 rounded-xl bg-soft-green flex items-center justify-center">
                <FolderOpen className="text-foreground" size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{sampleFiles.length}</p>
                <p className="text-sm text-muted-foreground">Files available</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link to="/announcements">
          <Card className="hover:shadow-md transition-shadow cursor-pointer border-border">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="w-12 h-12 rounded-xl bg-soft-blue flex items-center justify-center">
                <Megaphone className="text-foreground" size={22} />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{sampleAnnouncements.length}</p>
                <p className="text-sm text-muted-foreground">Announcements</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Important announcements */}
      {latestAnnouncements.filter((a) => a.important).length > 0 && (
        <Card className="border-warm-gold bg-warm-gold-light/30">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertCircle size={20} className="text-warm-gold" />
              Important Updates
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {latestAnnouncements
              .filter((a) => a.important)
              .map((a) => (
                <div key={a.id} className="flex items-start gap-3">
                  <Badge variant="secondary" className="bg-warm-gold-light text-foreground mt-0.5 shrink-0">
                    {format(new Date(a.date), "d MMM")}
                  </Badge>
                  <div>
                    <p className="font-medium text-foreground">{a.title}</p>
                    <p className="text-sm text-muted-foreground">{a.content}</p>
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My upcoming duties */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">My Upcoming Duties</CardTitle>
            <Link to="/my-schedule" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {upcomingDuties.length === 0 ? (
              <p className="text-muted-foreground py-4 text-center">No upcoming duties 🎉</p>
            ) : (
              upcomingDuties.map((duty) => (
                <div key={duty.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-warm-gold-light flex items-center justify-center">
                    <Clock size={18} className="text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground">{duty.role}</p>
                    <p className="text-sm text-muted-foreground">{duty.ministry}</p>
                  </div>
                  <Badge variant="outline" className="shrink-0">
                    {format(new Date(duty.date), "d MMM")}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent files */}
        <Card className="border-border">
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <CardTitle className="text-lg">Recent Files</CardTitle>
            <Link to="/files" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
              View all <ChevronRight size={14} />
            </Link>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentFiles.map((file) => (
              <div key={file.id} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                <div className="w-10 h-10 rounded-lg bg-soft-blue flex items-center justify-center">
                  <FileText size={18} className="text-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground text-sm truncate">{file.name}</p>
                  <p className="text-xs text-muted-foreground">{file.ministry} · {file.uploadedBy}</p>
                </div>
                <span className="text-xs text-muted-foreground shrink-0">{file.size}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
