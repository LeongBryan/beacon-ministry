export interface Ministry {
  id: string;
  name: string;
  icon: string;
  color: string;
  description: string;
}

export interface FileItem {
  id: string;
  name: string;
  type: string;
  ministry: string;
  uploadedBy: string;
  uploadedAt: string;
  size: string;
}

export interface RosterEntry {
  id: string;
  date: string;
  ministry: string;
  role: string;
  person: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  author: string;
  important: boolean;
}

export const ministries: Ministry[] = [
  { id: "worship", name: "Worship", icon: "Music", color: "bg-warm-gold-light", description: "Leading the congregation in praise and worship" },
  { id: "bible-quest", name: "Bible Quest", icon: "BookOpen", color: "bg-soft-green", description: "Bible study and exploration" },
  { id: "read-learn", name: "Read & Learn", icon: "GraduationCap", color: "bg-soft-blue", description: "Educational programs and resources" },
  { id: "resonate", name: "Resonate", icon: "Radio", color: "bg-warm-gold-light", description: "Media and communications" },
  { id: "yag", name: "Young Adults Group", icon: "Users", color: "bg-soft-green", description: "Fellowship for young adults" },
  { id: "cell-groups", name: "Cell Groups", icon: "Home", color: "bg-soft-blue", description: "Small group gatherings" },
  { id: "pulpit", name: "Pulpit", icon: "Mic", color: "bg-warm-gold-light", description: "Preaching and teaching ministry" },
  { id: "welcoming", name: "Welcoming", icon: "HandHeart", color: "bg-soft-green", description: "Greeting and hospitality" },
  { id: "church-camps", name: "Church Camps", icon: "Tent", color: "bg-soft-blue", description: "Annual camps and retreats" },
  { id: "media-av", name: "Media / AV Team", icon: "Monitor", color: "bg-warm-gold-light", description: "Sound, visuals, and livestream" },
  { id: "prayer", name: "Prayer Ministry", icon: "Heart", color: "bg-soft-green", description: "Intercession and prayer support" },
  { id: "children", name: "Children's Ministry", icon: "Baby", color: "bg-soft-blue", description: "Sunday school and kids programs" },
  { id: "youth", name: "Youth Ministry", icon: "Sparkles", color: "bg-warm-gold-light", description: "Programs for teenagers" },
  { id: "missions", name: "Missions & Outreach", icon: "Globe", color: "bg-soft-green", description: "Community outreach and missions" },
  { id: "admin", name: "Admin & Operations", icon: "Settings", color: "bg-soft-blue", description: "Church administration" },
];

export const sampleFiles: FileItem[] = [
  { id: "1", name: "Worship Song List - April 2026.pdf", type: "PDF", ministry: "Worship", uploadedBy: "Sarah Tan", uploadedAt: "2026-04-08", size: "245 KB" },
  { id: "2", name: "Easter Service Run Sheet.docx", type: "Word", ministry: "Pulpit", uploadedBy: "Pastor James", uploadedAt: "2026-04-03", size: "128 KB" },
  { id: "3", name: "Cell Group Discussion Guide - Week 15.pdf", type: "PDF", ministry: "Cell Groups", uploadedBy: "David Lee", uploadedAt: "2026-04-07", size: "312 KB" },
  { id: "4", name: "Church Camp 2026 Schedule.pptx", type: "Slides", ministry: "Church Camps", uploadedBy: "Rachel Ng", uploadedAt: "2026-04-01", size: "1.2 MB" },
  { id: "5", name: "YAG Meeting Notes - March.pdf", type: "PDF", ministry: "Young Adults Group", uploadedBy: "Joshua Lim", uploadedAt: "2026-03-28", size: "89 KB" },
  { id: "6", name: "Bible Quest Lesson Plan Q2.pdf", type: "PDF", ministry: "Bible Quest", uploadedBy: "Grace Wong", uploadedAt: "2026-04-05", size: "456 KB" },
  { id: "7", name: "AV Equipment Guide.pdf", type: "PDF", ministry: "Media / AV Team", uploadedBy: "Mark Chen", uploadedAt: "2026-03-20", size: "2.1 MB" },
  { id: "8", name: "Children's Ministry Curriculum.docx", type: "Word", ministry: "Children's Ministry", uploadedBy: "Anna Koh", uploadedAt: "2026-04-02", size: "567 KB" },
];

export const sampleRoster: RosterEntry[] = [
  { id: "1", date: "2026-04-13", ministry: "Worship", role: "Worship Leader", person: "Sarah Tan" },
  { id: "2", date: "2026-04-13", ministry: "Worship", role: "Pianist", person: "Emily Loh" },
  { id: "3", date: "2026-04-13", ministry: "Worship", role: "Guitarist", person: "Mark Chen" },
  { id: "4", date: "2026-04-13", ministry: "Welcoming", role: "Usher", person: "David Lee" },
  { id: "5", date: "2026-04-13", ministry: "Welcoming", role: "Usher", person: "Rachel Ng" },
  { id: "6", date: "2026-04-13", ministry: "Pulpit", role: "Speaker", person: "Pastor James" },
  { id: "7", date: "2026-04-13", ministry: "Media / AV Team", role: "Sound Engineer", person: "Joshua Lim" },
  { id: "8", date: "2026-04-13", ministry: "Media / AV Team", role: "Slides Operator", person: "Grace Wong" },
  { id: "9", date: "2026-04-13", ministry: "Children's Ministry", role: "Teacher", person: "Anna Koh" },
  { id: "10", date: "2026-04-20", ministry: "Worship", role: "Worship Leader", person: "Emily Loh" },
  { id: "11", date: "2026-04-20", ministry: "Worship", role: "Pianist", person: "Sarah Tan" },
  { id: "12", date: "2026-04-20", ministry: "Welcoming", role: "Usher", person: "Joshua Lim" },
  { id: "13", date: "2026-04-20", ministry: "Pulpit", role: "Speaker", person: "Pastor James" },
  { id: "14", date: "2026-04-20", ministry: "Media / AV Team", role: "Sound Engineer", person: "Mark Chen" },
  { id: "15", date: "2026-04-27", ministry: "Worship", role: "Worship Leader", person: "Sarah Tan" },
  { id: "16", date: "2026-04-27", ministry: "Welcoming", role: "Usher", person: "David Lee" },
  { id: "17", date: "2026-04-27", ministry: "Pulpit", role: "Speaker", person: "Elder Ruth" },
];

export const sampleAnnouncements: Announcement[] = [
  { id: "1", title: "Good Friday Combined Service", content: "There will be one combined Good Friday service at 10:30am on April 3rd.", date: "2026-04-01", author: "Pastor James", important: true },
  { id: "2", title: "Easter Sunday Programme", content: "Easter Sunday services will run at the regular timings: 9:30am and 11:00am. Invite your friends and family!", date: "2026-04-02", author: "Church Office", important: true },
  { id: "3", title: "Church Camp 2026 Registration Open", content: "Church camp is scheduled for June 21, 2026. Please register by May 15. See Rachel Ng for details.", date: "2026-03-25", author: "Rachel Ng", important: false },
  { id: "4", title: "New Cell Group Starting", content: "A new cell group for young families will begin meeting on Wednesdays from April 15. Contact David Lee to join.", date: "2026-04-05", author: "David Lee", important: false },
  { id: "5", title: "Combined Sunday Service", content: "There will be one combined Sunday service at 10:30am on July 5.", date: "2026-04-08", author: "Church Office", important: false },
];

export const currentUser = {
  name: "Sarah Tan",
  email: "sarah.tan@email.com",
  role: "Ministry Leader",
  ministries: ["Worship"],
};
