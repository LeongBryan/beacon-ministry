// ===== Types =====

export type PersonCategory = "regular" | "irregular" | "newcomer" | "leader" | "partner";
export type PersonStatus = "active" | "inactive" | "follow-up" | "on-leave";

export interface Person {
  id: string;
  name: string;
  category: PersonCategory;
  status: PersonStatus;
  tags: string[];
  notes: string;
  followUpNotes: string;
  assignments: PersonAssignment[];
}

export interface PersonAssignment {
  ministry: string;
  leader: string;
  role: string;
}

export interface Room {
  id: string;
  name: string;
  description: string;
}

export interface Booking {
  id: string;
  roomId: string;
  date: string;
  startTime: string;
  endTime: string;
  bookedBy: string;
  ministry: string;
  notes: string;
  recurring: boolean;
  recurrenceEnd?: string;
}

export interface ScheduleSlot {
  id: string;
  date: string;
  ministry: string;
  role: string;
  people: string[];
  notes: string;
  linkedRoom?: string;
}

// ===== Mock Data =====

export const rooms: Room[] = [
  { id: "creche-1", name: "Crèche 1", description: "Ground floor crèche room" },
  { id: "creche-2", name: "Crèche 2", description: "Second crèche room" },
  { id: "recording-studio", name: "Recording Studio", description: "Audio/video recording space" },
  { id: "computer-inner", name: "Computer Inner", description: "Inner computer room" },
  { id: "computer-outer", name: "Computer Outer", description: "Outer computer room" },
  { id: "unit38-entrance", name: "Unit 38 Entrance", description: "Entrance area of Unit 38" },
  { id: "unit38-inner", name: "Unit 38 Inner", description: "Inner area of Unit 38" },
];

export const ministries = [
  "Worship", "Pulpit", "Welcoming", "Bible Quest", "Read & Learn",
  "YAG", "Resonate", "Cell Groups", "Church Camps", "Media / AV",
  "Prayer", "Children's Ministry", "Youth", "Missions", "Admin",
];

export const people: Person[] = [
  {
    id: "1", name: "Sarah Tan", category: "leader", status: "active",
    tags: ["worship-team", "cell-leader"], notes: "Worship ministry lead", followUpNotes: "",
    assignments: [
      { ministry: "Worship", leader: "Pastor James", role: "Worship Leader" },
      { ministry: "Cell Groups", leader: "Elder Ruth", role: "Cell Leader" },
    ],
  },
  {
    id: "2", name: "David Lee", category: "regular", status: "active",
    tags: ["usher", "cell-member"], notes: "", followUpNotes: "",
    assignments: [
      { ministry: "Welcoming", leader: "Grace Wong", role: "Usher" },
      { ministry: "Cell Groups", leader: "Sarah Tan", role: "Member" },
    ],
  },
  {
    id: "3", name: "Emily Loh", category: "regular", status: "active",
    tags: ["pianist", "worship-team"], notes: "Also helps with children's ministry occasionally", followUpNotes: "",
    assignments: [
      { ministry: "Worship", leader: "Sarah Tan", role: "Pianist" },
    ],
  },
  {
    id: "4", name: "Mark Chen", category: "regular", status: "active",
    tags: ["av-team", "guitarist"], notes: "", followUpNotes: "",
    assignments: [
      { ministry: "Media / AV", leader: "Joshua Lim", role: "Sound Engineer" },
      { ministry: "Worship", leader: "Sarah Tan", role: "Guitarist" },
    ],
  },
  {
    id: "5", name: "Rachel Ng", category: "leader", status: "active",
    tags: ["camp-coordinator"], notes: "Leading church camp 2026 planning", followUpNotes: "",
    assignments: [
      { ministry: "Church Camps", leader: "Pastor James", role: "Coordinator" },
      { ministry: "Welcoming", leader: "Grace Wong", role: "Usher" },
    ],
  },
  {
    id: "6", name: "Joshua Lim", category: "leader", status: "active",
    tags: ["av-lead", "yag-member"], notes: "AV team lead", followUpNotes: "",
    assignments: [
      { ministry: "Media / AV", leader: "Pastor James", role: "Team Lead" },
      { ministry: "YAG", leader: "Elder Ruth", role: "Member" },
    ],
  },
  {
    id: "7", name: "Grace Wong", category: "leader", status: "active",
    tags: ["welcoming-lead", "bible-quest"], notes: "", followUpNotes: "",
    assignments: [
      { ministry: "Welcoming", leader: "Pastor James", role: "Ministry Lead" },
      { ministry: "Bible Quest", leader: "Elder Ruth", role: "Facilitator" },
    ],
  },
  {
    id: "8", name: "Anna Koh", category: "regular", status: "active",
    tags: ["children", "sunday-school"], notes: "Sunday school teacher", followUpNotes: "",
    assignments: [
      { ministry: "Children's Ministry", leader: "Grace Wong", role: "Teacher" },
    ],
  },
  {
    id: "9", name: "Peter Sim", category: "newcomer", status: "follow-up",
    tags: ["newcomer"], notes: "Visited 3 times", followUpNotes: "Follow up on cell group interest. Spoke to him on Apr 6.",
    assignments: [],
  },
  {
    id: "10", name: "Mei Ling Ong", category: "irregular", status: "active",
    tags: ["prayer-team"], notes: "Attends about once a month", followUpNotes: "Check in after Easter",
    assignments: [
      { ministry: "Prayer", leader: "Elder Ruth", role: "Intercessor" },
    ],
  },
  {
    id: "11", name: "James Teo", category: "regular", status: "on-leave",
    tags: ["resonate", "media"], notes: "On study leave until June", followUpNotes: "",
    assignments: [
      { ministry: "Resonate", leader: "Joshua Lim", role: "Content Creator" },
    ],
  },
  {
    id: "12", name: "Ruth Cheng", category: "partner", status: "active",
    tags: ["missions"], notes: "Missions partner - monthly support", followUpNotes: "",
    assignments: [
      { ministry: "Missions", leader: "Pastor James", role: "Partner" },
    ],
  },
];

export const bookings: Booking[] = [
  { id: "b1", roomId: "recording-studio", date: "2026-04-13", startTime: "09:00", endTime: "11:00", bookedBy: "Joshua Lim", ministry: "Resonate", notes: "Podcast recording", recurring: true, recurrenceEnd: "2026-06-30" },
  { id: "b2", roomId: "creche-1", date: "2026-04-13", startTime: "09:30", endTime: "11:30", bookedBy: "Anna Koh", ministry: "Children's Ministry", notes: "Sunday school", recurring: true, recurrenceEnd: "2026-12-31" },
  { id: "b3", roomId: "unit38-inner", date: "2026-04-14", startTime: "19:00", endTime: "21:00", bookedBy: "Sarah Tan", ministry: "Cell Groups", notes: "Cell group meeting", recurring: true, recurrenceEnd: "2026-06-30" },
  { id: "b4", roomId: "computer-inner", date: "2026-04-15", startTime: "10:00", endTime: "12:00", bookedBy: "Grace Wong", ministry: "Admin", notes: "Admin work", recurring: false },
  { id: "b5", roomId: "unit38-entrance", date: "2026-04-13", startTime: "08:30", endTime: "09:30", bookedBy: "Grace Wong", ministry: "Welcoming", notes: "Setup for service", recurring: true, recurrenceEnd: "2026-12-31" },
  { id: "b6", roomId: "creche-2", date: "2026-04-13", startTime: "09:30", endTime: "11:30", bookedBy: "Anna Koh", ministry: "Children's Ministry", notes: "Toddler care", recurring: true, recurrenceEnd: "2026-12-31" },
];

export const scheduleSlots: ScheduleSlot[] = [
  { id: "s1", date: "2026-04-13", ministry: "Worship", role: "Worship Leader", people: ["Sarah Tan"], notes: "" },
  { id: "s2", date: "2026-04-13", ministry: "Worship", role: "Pianist", people: ["Emily Loh"], notes: "" },
  { id: "s3", date: "2026-04-13", ministry: "Worship", role: "Guitarist", people: ["Mark Chen"], notes: "" },
  { id: "s4", date: "2026-04-13", ministry: "Welcoming", role: "Usher", people: ["David Lee", "Rachel Ng"], notes: "" },
  { id: "s5", date: "2026-04-13", ministry: "Pulpit", role: "Speaker", people: ["Pastor James"], notes: "Easter series part 2" },
  { id: "s6", date: "2026-04-13", ministry: "Media / AV", role: "Sound", people: ["Joshua Lim"], notes: "" },
  { id: "s7", date: "2026-04-13", ministry: "Media / AV", role: "Slides", people: ["Grace Wong"], notes: "" },
  { id: "s8", date: "2026-04-13", ministry: "Children's Ministry", role: "Teacher", people: ["Anna Koh"], notes: "", linkedRoom: "creche-1" },
  { id: "s9", date: "2026-04-20", ministry: "Worship", role: "Worship Leader", people: ["Emily Loh"], notes: "" },
  { id: "s10", date: "2026-04-20", ministry: "Worship", role: "Pianist", people: ["Sarah Tan"], notes: "" },
  { id: "s11", date: "2026-04-20", ministry: "Welcoming", role: "Usher", people: ["Joshua Lim", "David Lee"], notes: "" },
  { id: "s12", date: "2026-04-20", ministry: "Pulpit", role: "Speaker", people: ["Pastor James"], notes: "" },
  { id: "s13", date: "2026-04-20", ministry: "Media / AV", role: "Sound", people: ["Mark Chen"], notes: "" },
  { id: "s14", date: "2026-04-27", ministry: "Worship", role: "Worship Leader", people: ["Sarah Tan"], notes: "" },
  { id: "s15", date: "2026-04-27", ministry: "Welcoming", role: "Usher", people: ["David Lee", "Rachel Ng"], notes: "" },
  { id: "s16", date: "2026-04-27", ministry: "Pulpit", role: "Speaker", people: ["Elder Ruth"], notes: "Guest speaker series" },
];

// Helper
export const categoryColors: Record<PersonCategory, string> = {
  leader: "bg-primary text-primary-foreground",
  regular: "bg-soft-blue text-foreground",
  newcomer: "bg-warm-gold-light text-foreground",
  irregular: "bg-muted text-muted-foreground",
  partner: "bg-soft-green text-foreground",
};

export const statusColors: Record<PersonStatus, string> = {
  active: "bg-success text-success-foreground",
  inactive: "bg-muted text-muted-foreground",
  "follow-up": "bg-warm-gold text-primary-foreground",
  "on-leave": "bg-soft-blue text-foreground",
};

export const categoryLabels: Record<PersonCategory, string> = {
  leader: "Leader",
  regular: "Regular",
  newcomer: "Newcomer",
  irregular: "Irregular",
  partner: "Partner",
};

export const statusLabels: Record<PersonStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  "follow-up": "Follow-up",
  "on-leave": "On Leave",
};
