import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  type Person, type EngagementLevel,
  engagementLabels, engagementColors, engagementDotColors,
} from "@/data/mockData";

interface PersonChipProps {
  person: Person;
  onUpdatePerson: (p: Person) => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  compact?: boolean;
}

const PersonChip = ({
  person,
  onUpdatePerson,
  draggable = false,
  onDragStart,
  onDragEnd,
  compact = false,
}: PersonChipProps) => {
  const [open, setOpen] = useState(false);

  const handleSetEngagement = (level: EngagementLevel) => {
    onUpdatePerson({ ...person, engagement: level });
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div
          draggable={draggable}
          onDragStart={(e) => {
            e.dataTransfer.setData("text/plain", person.id);
            onDragStart?.();
          }}
          onDragEnd={onDragEnd}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 bg-background border rounded-full text-sm cursor-pointer select-none transition-all hover:shadow-sm active:cursor-grabbing ${
            engagementBorderClass(person.engagement)
          }`}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${engagementDotColors[person.engagement]}`} />
          {!compact && (
            <span className="font-medium text-foreground">{person.name}</span>
          )}
          {compact && (
            <span className="font-medium text-foreground text-xs">{person.name}</span>
          )}
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-3" align="start">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-sm text-foreground">{person.name}</p>
            {person.ministries.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {person.ministries.join(", ")}
              </p>
            )}
            {person.notes && (
              <p className="text-xs text-muted-foreground mt-1">{person.notes}</p>
            )}
          </div>

          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1.5">Engagement Level</p>
            <div className="flex flex-wrap gap-1.5">
              {(Object.keys(engagementLabels) as EngagementLevel[]).map((level) => (
                <button
                  key={level}
                  onClick={() => handleSetEngagement(level)}
                  className={`text-xs px-2.5 py-1 rounded-full transition-all ${
                    person.engagement === level
                      ? engagementColors[level]
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {engagementLabels[level]}
                </button>
              ))}
            </div>
          </div>

          {person.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {person.tags.map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

function engagementBorderClass(level: EngagementLevel): string {
  const map: Record<EngagementLevel, string> = {
    leader: "border-primary/50",
    partner: "border-[hsl(200,40%,70%)]",
    regular: "border-success/40",
    infrequent: "border-[hsl(45,70%,60%)]",
    missing: "border-destructive/40",
  };
  return map[level];
}

export default PersonChip;
