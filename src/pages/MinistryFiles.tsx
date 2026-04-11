import { useState } from "react";
import { Search, FileText, Upload, FolderOpen, Filter } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ministries, sampleFiles } from "@/data/sampleData";
import { format } from "date-fns";

const MinistryFiles = () => {
  const [search, setSearch] = useState("");
  const [selectedMinistry, setSelectedMinistry] = useState<string | null>(null);

  const filteredFiles = sampleFiles.filter((file) => {
    const matchesSearch = file.name.toLowerCase().includes(search.toLowerCase());
    const matchesMinistry = !selectedMinistry || file.ministry === selectedMinistry;
    return matchesSearch && matchesMinistry;
  });

  const fileTypeColors: Record<string, string> = {
    PDF: "bg-destructive/10 text-destructive",
    Word: "bg-soft-blue text-foreground",
    Slides: "bg-warm-gold-light text-foreground",
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Ministry Files</h1>
          <p className="text-muted-foreground mt-1">All your ministry documents in one place</p>
        </div>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          <Upload size={18} />
          Upload File
        </Button>
      </div>

      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search files..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-card"
          />
        </div>
      </div>

      {/* Ministry filter chips */}
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
          .filter((m) => sampleFiles.some((f) => f.ministry === m.name))
          .map((ministry) => (
            <button
              key={ministry.id}
              onClick={() => setSelectedMinistry(ministry.name === selectedMinistry ? null : ministry.name)}
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

      {/* Files list */}
      <Card className="border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <FolderOpen size={20} />
            {selectedMinistry || "All Files"} ({filteredFiles.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFiles.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <FileText size={40} className="mx-auto mb-3 opacity-40" />
              <p>No files found</p>
              <p className="text-sm">Try a different search or ministry</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredFiles.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group"
                >
                  <div className="w-11 h-11 rounded-lg bg-soft-blue flex items-center justify-center shrink-0">
                    <FileText size={20} className="text-foreground" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {file.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {file.uploadedBy} · {format(new Date(file.uploadedAt), "d MMM yyyy")}
                    </p>
                  </div>
                  <Badge variant="secondary" className={`shrink-0 ${fileTypeColors[file.type] || ""}`}>
                    {file.type}
                  </Badge>
                  <span className="text-sm text-muted-foreground shrink-0 hidden sm:block">
                    {file.size}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Ministry sections */}
      <div>
        <h2 className="text-xl font-bold text-foreground mb-4">Browse by Ministry</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ministries.map((ministry) => {
            const fileCount = sampleFiles.filter((f) => f.ministry === ministry.name).length;
            return (
              <Card
                key={ministry.id}
                className="hover:shadow-md transition-shadow cursor-pointer border-border"
                onClick={() => setSelectedMinistry(ministry.name)}
              >
                <CardContent className="flex items-center gap-4 p-5">
                  <div className={`w-12 h-12 rounded-xl ${ministry.color} flex items-center justify-center`}>
                    <FolderOpen size={20} className="text-foreground" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-foreground">{ministry.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {fileCount} {fileCount === 1 ? "file" : "files"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MinistryFiles;
