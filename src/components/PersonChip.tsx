import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import {
  type Person, type EngagementLevel,
  engagementLabels, engagementColors, engagementDotColors, engagementBorderColors,
} from "@/data/mockData";

interface PersonChipProps {
  person: Person;
  onUpdatePerson: (p: Person) => void;
  draggable?: boolean;
  onDragStart?: () => void;
  onDragEnd?: () => void;
  compact?: boolean;
  tags?: string[];
}

const PersonChip = ({
  person,
  onUpdatePerson,
  draggable = false,
  onDragStart,
  onDragEnd,
  compact = false,
  tags = [],
}: PersonChipProps) => {
  const [open, setOpen] = useState(false);

  const handleSetEngagement = (level: EngagementLevel) => {
    onUpdatePerson({ ...person, engagement: level });
  };

  const toggleTag = (tag: string) => {
    const has = person.tags.includes(tag);
    const newTags = has ? person.tags.filter(t => t !== tag) : [...person.tags, tag];
    onUpdatePerson({ ...person, tags: newTags });
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
            engagementBorderColors[person.engagement]
          }`}
        >
          <div className={`w-2.5 h-2.5 rounded-full ${engagementDotColors[person.engagement]}`} />
          <span className={`font-medium text-foreground ${compact ? "text-xs" : ""}`}>{person.name}</span>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-72 p-3" align="start">
        <div className="space-y-3">
          <div>
            <p className="font-semibold text-sm text-foreground">{person.name}</p>
            {person.roles.length > 0 && (
              <p className="text-xs text-muted-foreground mt-0.5">
                {person.roles.join(", ")}
              </p>
            )}
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

          {tags.length > 0 && (
            <div>
              <p className="text-xs font-medium text-muted-foreground mb-1.5">Tags</p>
              <div className="flex flex-wrap gap-1.5">
                {tags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`text-xs px-2 py-0.5 rounded-full border transition-all ${
                      person.tags.includes(tag)
                        ? "bg-primary/10 border-primary/40 text-primary"
                        : "bg-muted/50 border-border text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {person.tags.includes(tag) ? "✓ " : ""}{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default PersonChip;
