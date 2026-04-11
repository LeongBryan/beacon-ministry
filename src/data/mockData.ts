// ===== Types =====

export type PersonStatus = "active" | "inactive" | "follow-up" | "on-leave";
export type MeetingFrequency = "regular" | "infrequent" | "rarely";
export type GroupType = "cell" | "resonate" | "yag";

export interface Person {
  id: string;
  name: string;
  status: PersonStatus;
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

// ===== Mock Data =====

export const ministries = [
  "Worship", "Pulpit", "Welcoming", "Bible Quest", "Read & Learn",
  "YAG", "Resonate", "Cell Groups", "Church Camps", "Media / AV",
  "Prayer", "Children's Ministry", "Youth", "Missions", "Admin",
];

export const people: Person[] = [
  { id: "1", name: "Leon", status: "active", tags: ["guys-121"], notes: "", followUpNotes: "", ministries: ["Worship"] },
  { id: "2", name: "Shawna", status: "active", tags: [], notes: "", followUpNotes: "", ministries: ["Welcoming"] },
  { id: "3", name: "Jeremiah", status: "active", tags: [], notes: "", followUpNotes: "", ministries: ["YAG"] },
  { id: "4", name: "Josh", status: "active", tags: [], notes: "", followUpNotes: "", ministries: ["Resonate"] },
  { id: "5", name: "Jobo", status: "active", tags: [], notes: "", followUpNotes: "", ministries: ["Cell Groups"] },
  { id: "6", name: "Mei Yun", status: "active", tags: [], notes: "", followUpNotes: "", ministries: ["Prayer"] },
  { id: "7", name: "Zhang Teng", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "8", name: "Leslie", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "9", name: "Celine", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "10", name: "Angeline", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "11", name: "Daniel", status: "active", tags: [], notes: "", followUpNotes: "", ministries: ["Media / AV"] },
  { id: "12", name: "Esther", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "13", name: "Kenneth", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "14", name: "Brendan", status: "active", tags: ["newcomer"], notes: "", followUpNotes: "", ministries: [] },
  { id: "15", name: "Reeve", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "16", name: "Eugene", status: "active", tags: ["newcomer"], notes: "", followUpNotes: "", ministries: [] },
  { id: "17", name: "Charissa", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "18", name: "Job", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "19", name: "Jerry", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "20", name: "Jayne Lim", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "21", name: "Hannah", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "22", name: "Amanda G", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "23", name: "Pris", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "24", name: "Jeremy Yap", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "25", name: "Oli", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "26", name: "Valery", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "27", name: "Dave", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "28", name: "Zech", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "29", name: "Dylan", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "30", name: "Amanda T", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "31", name: "Kitty", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "32", name: "Kell", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "33", name: "Wei Ying", status: "active", tags: ["irregular-50"], notes: "Irregular (50%)", followUpNotes: "", ministries: [] },
  { id: "34", name: "Joanne T", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "35", name: "Ian", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "36", name: "Keziah", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "37", name: "Teddy", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "38", name: "Joey", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "39", name: "Denise Lee", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "40", name: "Stella", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "41", name: "Janan", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "42", name: "Jess", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "43", name: "Chia Chiu", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "44", name: "Kah Yee", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "45", name: "Cody", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "46", name: "Joel", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "47", name: "Shaun", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "48", name: "Calvin", status: "active", tags: ["unmet-regular"], notes: "", followUpNotes: "", ministries: [] },
  { id: "49", name: "Charlston", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "50", name: "Charmaine", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "51", name: "Mark", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "52", name: "Lun", status: "active", tags: ["unmet-regular"], notes: "", followUpNotes: "", ministries: [] },
  { id: "53", name: "Sharne", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "54", name: "Bry", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "55", name: "Net", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "56", name: "Kit Mun", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "57", name: "Rachel", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "58", name: "Debs", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "59", name: "Ame", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "60", name: "Anderson", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "61", name: "Jia Hong", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "62", name: "Ashur", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "63", name: "Yuxin", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "64", name: "Kai Yue", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "65", name: "Titus", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "66", name: "Jun Fu", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "67", name: "Scarlett (NYP)", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "68", name: "Symphonie", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "69", name: "Calista", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "70", name: "Natalie", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "71", name: "Nathan", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "72", name: "Thaddeus", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "73", name: "Elijah", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "74", name: "Nigel", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "75", name: "Lincoln", status: "active", tags: ["guys-121"], notes: "", followUpNotes: "", ministries: [] },
  { id: "76", name: "Jayne Lee", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "77", name: "Wen Jun", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "78", name: "Matthew", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "79", name: "Kai Yat", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "80", name: "Shaoqi", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "81", name: "Gladys", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "82", name: "Azel", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "83", name: "Renae", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "84", name: "Alfred", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "85", name: "Jia Jun", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "86", name: "Luke", status: "active", tags: ["unmet-irregular"], notes: "", followUpNotes: "", ministries: [] },
  { id: "87", name: "Shin", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "88", name: "Brendan K", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "89", name: "Terence", status: "active", tags: ["guys-121"], notes: "", followUpNotes: "", ministries: [] },
  { id: "90", name: "Grace Mao", status: "active", tags: ["partner"], notes: "", followUpNotes: "", ministries: [] },
  { id: "91", name: "Grace Seah", status: "active", tags: ["partner"], notes: "", followUpNotes: "", ministries: [] },
  { id: "92", name: "Beat", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "93", name: "Cephas", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "94", name: "Jolynn", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "95", name: "Derek", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "96", name: "Wen Hong", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "97", name: "Ryan", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "98", name: "Joyce", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "99", name: "Stephilma", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "100", name: "Wen Jing", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "101", name: "Hannah T", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "102", name: "Shang Ji", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "103", name: "Samuel", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "104", name: "Andre", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
  { id: "105", name: "Bingwen", status: "active", tags: [], notes: "", followUpNotes: "", ministries: [] },
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

// Helper
export const statusColors: Record<PersonStatus, string> = {
  active: "bg-success text-success-foreground",
  inactive: "bg-muted text-muted-foreground",
  "follow-up": "bg-warm-gold text-primary-foreground",
  "on-leave": "bg-soft-blue text-foreground",
};

export const statusLabels: Record<PersonStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  "follow-up": "Follow-up",
  "on-leave": "On Leave",
};

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
