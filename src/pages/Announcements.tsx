import { format } from "date-fns";
import { Megaphone, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { sampleAnnouncements } from "@/data/sampleData";

const Announcements = () => {
  const sorted = [...sampleAnnouncements].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">Announcements</h1>
        <p className="text-muted-foreground mt-1">Updates and news from the church</p>
      </div>

      <div className="space-y-4">
        {sorted.map((announcement) => (
          <Card
            key={announcement.id}
            className={`border-border ${announcement.important ? "border-warm-gold bg-warm-gold-light/20" : ""}`}
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                    announcement.important ? "bg-warm-gold-light" : "bg-muted"
                  }`}
                >
                  {announcement.important ? (
                    <AlertCircle size={20} className="text-warm-gold" />
                  ) : (
                    <Megaphone size={20} className="text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-3 mb-1">
                    <h3 className="font-semibold text-foreground text-lg">{announcement.title}</h3>
                    {announcement.important && (
                      <Badge className="bg-warm-gold-light text-foreground border-0 shrink-0">
                        Important
                      </Badge>
                    )}
                  </div>
                  <p className="text-foreground/80 mb-3 leading-relaxed">{announcement.content}</p>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <span>{announcement.author}</span>
                    <span>·</span>
                    <span>{format(new Date(announcement.date), "d MMMM yyyy")}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Announcements;
