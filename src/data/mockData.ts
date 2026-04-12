// ===== Types =====

export type EngagementLevel = "leader" | "partner" | "regular" | "infrequent" | "missing";
export type MeetingFrequency = "regular" | "infrequent" | "rarely";
export type GroupType = "cell" | "resonate" | "yag";

export interface Person {
  id: string;
  name: string;
  engagement: EngagementLevel;
  tags: string[];
  notes: string;
  followUpNotes: string;
  ministries: string[];
}

export interface Group {
  id: string;
  type: GroupType;
  name: string;
  members: string[]; // person ids
}

export interface OneToOne {
  id: string;
  personA: string; // person id
  personB: string; // person id
  frequency: MeetingFrequency;
  notes: string;
}

// ===== Labels & Colors =====

export const engagementLabels: Record<EngagementLevel, string> = {
  leader: "Leader",
  partner: "Partner",
  regular: "Regular",
  infrequent: "Infrequent",
  missing: "Missing",
};

export const engagementColors: Record<EngagementLevel, string> = {
  leader: "bg-primary text-primary-foreground",
  partner: "bg-soft-blue text-foreground",
  regular: "bg-success text-success-foreground",
  infrequent: "bg-warm-gold text-primary-foreground",
  missing: "bg-destructive text-destructive-foreground",
};

export const engagementDotColors: Record<EngagementLevel, string> = {
  leader: "bg-primary",
  partner: "bg-soft-blue",
  regular: "bg-success",
  infrequent: "bg-warm-gold",
  missing: "bg-destructive",
};

export const engagementBorderColors: Record<EngagementLevel, string> = {
  leader: "border-primary/40",
  partner: "border-soft-blue",
  regular: "border-success/40",
  infrequent: "border-warm-gold/60",
  missing: "border-destructive/40",
};

export const ministries = [
  "Worship", "Pulpit", "Welcoming", "Bible Quest", "Read & Learn",
  "YAG", "Resonate", "Cell Groups", "Church Camps", "Media / AV",
  "Prayer", "Children's Ministry", "Youth", "Missions", "Admin",
];

export const groupTypeLabels: Record<GroupType, string> = {
  cell: "Cell Group",
  resonate: "Resonate",
  yag: "YAG",
};

export const groupTypeColors: Record<GroupType, string> = {
  cell: "bg-soft-blue text-foreground",
  resonate: "bg-soft-green text-foreground",
  yag: "bg-warm-gold-light text-foreground",
};

export const frequencyColors: Record<MeetingFrequency, string> = {
  regular: "bg-success text-success-foreground",
  infrequent: "bg-warm-gold text-primary-foreground",
  rarely: "bg-muted text-muted-foreground",
};

export const frequencyLabels: Record<MeetingFrequency, string> = {
  regular: "Regular",
  infrequent: "Infrequent",
  rarely: "Rarely",
};

export const predefinedTags = [
  "guys-121", "girls-121", "newcomer", "baptized", "serving",
  "student", "working-adult", "overseas", "ns", "married",
];

// ===== Mock Data =====

export const people: Person[] = [
  { id: "1", name: "Leon", engagement: "leader", tags: ["guys-121"], notes: "", followUpNotes: "", ministries: ["Worship"] },
  { id: "2", name: "Shawna", engagement: "partner", tags: [], notes: "", followUpNotes: "", ministries: ["Welcoming"] },
  { id: "3", name: "Jeremiah", engagement: "leader", tags: [], notes: "", followUpNotes: "", ministries: ["YAG"] },
  { id: "4", name: "Josh", engagement: "partner", tags: [], notes: "", followUpNotes: "", ministries: ["Resonate"] },
  { id: "5", name: "Jobo", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: ["Cell Groups"] },
  { id: "6", name: "Mei Yun", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: ["Prayer"] },
  { id: "7", name: "Zhang Teng", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "8", name: "Leslie", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "9", name: "Celine", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "10", name: "Angeline", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "11", name: "Daniel", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: ["Media / AV"] },
  { id: "12", name: "Esther", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "13", name: "Kenneth", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "14", name: "Brendan", engagement: "infrequent", tags: ["newcomer"], notes: "", followUpNotes: "", ministries: [] },
  { id: "15", name: "Reeve", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "16", name: "Eugene", engagement: "infrequent", tags: ["newcomer"], notes: "", followUpNotes: "", ministries: [] },
  { id: "17", name: "Charissa", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "18", name: "Job", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "19", name: "Jerry", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "20", name: "Jayne Lim", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "21", name: "Hannah", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "22", name: "Amanda G", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "23", name: "Pris", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "24", name: "Jeremy Yap", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "25", name: "Oli", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "26", name: "Valery", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "27", name: "Dave", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "28", name: "Zech", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "29", name: "Dylan", engagement: "infrequent", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "30", name: "Amanda T", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "31", name: "Kitty", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "32", name: "Kell", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "33", name: "Wei Ying", engagement: "infrequent", tags: [], notes: "Irregular (50%)", followUpNotes: "", ministries: [] },
  { id: "34", name: "Joanne T", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "35", name: "Ian", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "36", name: "Keziah", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "37", name: "Teddy", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "38", name: "Joey", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "39", name: "Denise Lee", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "40", name: "Stella", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "41", name: "Janan", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "42", name: "Jess", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "43", name: "Chia Chiu", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "44", name: "Kah Yee", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "45", name: "Cody", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "46", name: "Joel", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "47", name: "Shaun", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "48", name: "Calvin", engagement: "missing", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "49", name: "Charlston", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "50", name: "Charmaine", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "51", name: "Mark", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "52", name: "Lun", engagement: "missing", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "53", name: "Sharne", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "54", name: "Bry", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "55", name: "Net", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "56", name: "Kit Mun", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "57", name: "Rachel", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "58", name: "Debs", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "59", name: "Ame", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "60", name: "Anderson", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "61", name: "Jia Hong", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "62", name: "Ashur", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "63", name: "Yuxin", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "64", name: "Kai Yue", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "65", name: "Titus", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "66", name: "Jun Fu", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "67", name: "Scarlett (NYP)", engagement: "infrequent", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "68", name: "Symphonie", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "69", name: "Calista", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "70", name: "Natalie", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "71", name: "Nathan", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "72", name: "Thaddeus", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "73", name: "Elijah", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "74", name: "Nigel", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "75", name: "Lincoln", engagement: "leader", tags: ["guys-121"], notes: "", followUpNotes: "", ministries: [] },
  { id: "76", name: "Jayne Lee", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "77", name: "Wen Jun", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "78", name: "Matthew", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "79", name: "Kai Yat", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "80", name: "Shaoqi", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "81", name: "Gladys", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "82", name: "Azel", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "83", name: "Renae", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "84", name: "Alfred", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "85", name: "Jia Jun", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "86", name: "Luke", engagement: "missing", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "87", name: "Shin", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "88", name: "Brendan K", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "89", name: "Terence", engagement: "leader", tags: ["guys-121"], notes: "", followUpNotes: "", ministries: [] },
  { id: "90", name: "Grace Mao", engagement: "partner", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "91", name: "Grace Seah", engagement: "partner", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "92", name: "Beat", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "93", name: "Cephas", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "94", name: "Jolynn", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "95", name: "Derek", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "96", name: "Wen Hong", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "97", name: "Ryan", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "98", name: "Joyce", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "99", name: "Stephilma", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "100", name: "Wen Jing", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "101", name: "Hannah T", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "102", name: "Shang Ji", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "103", name: "Samuel", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "104", name: "Andre", engagement: "infrequent", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "105", name: "Bingwen", engagement: "regular", tags: [], notes: "", followUpNotes: "", ministries: [] },
];

export const groups: Group[] = [
  { id: "cg1", type: "cell", name: "Cell Group 1", members: ["1", "5", "10", "15", "20"] },
  { id: "cg2", type: "cell", name: "Cell Group 2", members: ["2", "6", "11", "16", "21"] },
  { id: "cg3", type: "cell", name: "Cell Group 3", members: ["3", "7", "12", "17", "22"] },
  { id: "r1", type: "resonate", name: "Resonate Group 1", members: ["4", "8", "13", "18", "23"] },
  { id: "r2", type: "resonate", name: "Resonate Group 2", members: ["9", "14", "19", "24", "25"] },
  { id: "r3", type: "resonate", name: "Resonate Group 3", members: ["26", "27", "28", "29", "30"] },
  { id: "y1", type: "yag", name: "YAG Group 1", members: ["3", "31", "32", "37", "38"] },
  { id: "y2", type: "yag", name: "YAG Group 2", members: ["33", "34", "39", "40", "41"] },
  { id: "y3", type: "yag", name: "YAG Group 3", members: ["42", "43", "44", "45", "46"] },
];

export const oneToOnes: OneToOne[] = [
  { id: "121-1", personA: "89", personB: "1", frequency: "regular", notes: "" },
  { id: "121-2", personA: "89", personB: "75", frequency: "regular", notes: "" },
  { id: "121-3", personA: "4", personB: "19", frequency: "infrequent", notes: "" },
  { id: "121-4", personA: "3", personB: "24", frequency: "regular", notes: "" },
  { id: "121-5", personA: "89", personB: "104", frequency: "rarely", notes: "" },
  { id: "121-6", personA: "89", personB: "93", frequency: "infrequent", notes: "" },
  { id: "121-7", personA: "89", personB: "97", frequency: "rarely", notes: "" },
  { id: "121-8", personA: "75", personB: "4", frequency: "regular", notes: "" },
  { id: "121-9", personA: "75", personB: "27", frequency: "infrequent", notes: "" },
  { id: "121-10", personA: "1", personB: "51", frequency: "regular", notes: "" },
  { id: "121-11", personA: "1", personB: "103", frequency: "infrequent", notes: "" },
];
