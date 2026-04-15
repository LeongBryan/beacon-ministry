// ===== Types =====

export type EngagementLevel = "regular" | "infrequent" | "missing";
export type MeetingFrequency = "regular" | "infrequent" | "rarely";
export type GroupAttendance = "regular" | "infrequent" | "missing";
export type GroupRole = "leader" | "partner";

export interface Person {
  id: string;
  name: string;
  engagement: EngagementLevel;
  roles: string[];
  tags: string[];
  notes: string;
  followUpNotes: string;
  ministries: string[];
}

export interface GroupType {
  id: string;
  label: string;
  color: string;
}

export interface GroupMemberMeta {
  attendance?: GroupAttendance;
  role?: GroupRole;
}

export interface Group {
  id: string;
  typeId: string;
  name: string;
  members: string[];
  memberMeta: Record<string, GroupMemberMeta>;
}

export interface OneToOne {
  id: string;
  personA: string;
  personB: string;
  frequency: MeetingFrequency;
  notes: string;
}

// ===== Labels & Colors =====

export const engagementLabels: Record<EngagementLevel, string> = {
  regular: "Regular",
  infrequent: "Infrequent",
  missing: "Missing",
};

export const engagementColors: Record<EngagementLevel, string> = {
  regular: "bg-success text-success-foreground",
  infrequent: "bg-warm-gold text-primary-foreground",
  missing: "bg-destructive text-destructive-foreground",
};

export const engagementDotColors: Record<EngagementLevel, string> = {
  regular: "bg-success",
  infrequent: "bg-warm-gold",
  missing: "bg-destructive",
};

export const engagementBorderColors: Record<EngagementLevel, string> = {
  regular: "border-success/40",
  infrequent: "border-warm-gold/60",
  missing: "border-destructive/40",
};

export const groupAttendanceLabels: Record<GroupAttendance, string> = {
  regular: "Regular",
  infrequent: "Infrequent",
  missing: "Missing",
};

export const groupAttendanceDotColors: Record<GroupAttendance, string> = {
  regular: "bg-success",
  infrequent: "bg-warm-gold",
  missing: "bg-destructive",
};

export const groupRoleLabels: Record<GroupRole, string> = {
  leader: "Leader",
  partner: "Partner",
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

export const defaultMinistries = [
  "Admin", "Bible Quest", "Cell Groups", "Children's Ministry",
  "Church Camps", "Media / AV", "Missions", "Prayer",
  "Pulpit", "Read & Learn", "Resonate", "Welcoming",
  "Worship", "YAG", "Youth",
];

export const defaultRoles = [
  "Assistant Leader", "Leader", "Member", "Mentor", "Volunteer",
];

export const defaultGroupTypes: GroupType[] = [
  { id: "cell", label: "Cell Group", color: "bg-soft-blue" },
  { id: "resonate", label: "Resonate", color: "bg-soft-green" },
  { id: "yag", label: "YAG", color: "bg-warm-gold-light" },
];

export const defaultTags = [
  "baptized", "girls-121", "guys-121", "married", "newcomer",
  "ns", "overseas", "serving", "student", "working-adult",
];

// ===== Mock Data =====

const makePerson = (id: string, name: string, engagement: EngagementLevel = "regular", extras: Partial<Person> = {}): Person => ({
  id, name, engagement, roles: [], tags: [], notes: "", followUpNotes: "", ministries: [], ...extras,
});

export const people: Person[] = [
  makePerson("1", "Leon", "regular", { tags: ["guys-121"], ministries: ["Worship"], roles: ["Leader"] }),
  makePerson("2", "Shawna", "regular", { ministries: ["Welcoming"] }),
  makePerson("3", "Jeremiah", "regular", { ministries: ["YAG"], roles: ["Leader"] }),
  makePerson("4", "Josh", "regular", { ministries: ["Resonate"] }),
  makePerson("5", "Jobo", "regular", { ministries: ["Cell Groups"] }),
  makePerson("6", "Mei Yun", "regular", { ministries: ["Prayer"] }),
  makePerson("7", "Zhang Teng"),
  makePerson("8", "Leslie"),
  makePerson("9", "Celine"),
  makePerson("10", "Angeline"),
  makePerson("11", "Daniel", "regular", { ministries: ["Media / AV"] }),
  makePerson("12", "Esther"),
  makePerson("13", "Kenneth"),
  makePerson("14", "Brendan", "infrequent", { tags: ["newcomer"] }),
  makePerson("15", "Reeve"),
  makePerson("16", "Eugene", "infrequent", { tags: ["newcomer"] }),
  makePerson("17", "Charissa"),
  makePerson("18", "Job"),
  makePerson("19", "Jerry"),
  makePerson("20", "Jayne Lim"),
  makePerson("21", "Hannah"),
  makePerson("22", "Amanda G"),
  makePerson("23", "Pris"),
  makePerson("24", "Jeremy Yap"),
  makePerson("25", "Oli"),
  makePerson("26", "Valery"),
  makePerson("27", "Dave"),
  makePerson("28", "Zech"),
  makePerson("29", "Dylan", "infrequent"),
  makePerson("30", "Amanda T"),
  makePerson("31", "Kitty"),
  makePerson("32", "Kell"),
  makePerson("33", "Wei Ying", "infrequent", { notes: "Irregular (50%)" }),
  makePerson("34", "Joanne T"),
  makePerson("35", "Ian"),
  makePerson("36", "Keziah"),
  makePerson("37", "Teddy"),
  makePerson("38", "Joey"),
  makePerson("39", "Denise Lee"),
  makePerson("40", "Stella"),
  makePerson("41", "Janan"),
  makePerson("42", "Jess"),
  makePerson("43", "Chia Chiu"),
  makePerson("44", "Kah Yee"),
  makePerson("45", "Cody"),
  makePerson("46", "Joel"),
  makePerson("47", "Shaun"),
  makePerson("48", "Calvin", "missing"),
  makePerson("49", "Charlston"),
  makePerson("50", "Charmaine"),
  makePerson("51", "Mark"),
  makePerson("52", "Lun", "missing"),
  makePerson("53", "Sharne"),
  makePerson("54", "Bry"),
  makePerson("55", "Net"),
  makePerson("56", "Kit Mun"),
  makePerson("57", "Rachel"),
  makePerson("58", "Debs"),
  makePerson("59", "Ame"),
  makePerson("60", "Anderson"),
  makePerson("61", "Jia Hong"),
  makePerson("62", "Ashur"),
  makePerson("63", "Yuxin"),
  makePerson("64", "Kai Yue"),
  makePerson("65", "Titus"),
  makePerson("66", "Jun Fu"),
  makePerson("67", "Scarlett (NYP)", "infrequent"),
  makePerson("68", "Symphonie"),
  makePerson("69", "Calista"),
  makePerson("70", "Natalie"),
  makePerson("71", "Nathan"),
  makePerson("72", "Thaddeus"),
  makePerson("73", "Elijah"),
  makePerson("74", "Nigel"),
  makePerson("75", "Lincoln", "regular", { tags: ["guys-121"], roles: ["Leader"] }),
  makePerson("76", "Jayne Lee"),
  makePerson("77", "Wen Jun"),
  makePerson("78", "Matthew"),
  makePerson("79", "Kai Yat"),
  makePerson("80", "Shaoqi"),
  makePerson("81", "Gladys"),
  makePerson("82", "Azel"),
  makePerson("83", "Renae"),
  makePerson("84", "Alfred"),
  makePerson("85", "Jia Jun"),
  makePerson("86", "Luke", "missing"),
  makePerson("87", "Shin"),
  makePerson("88", "Brendan K"),
  makePerson("89", "Terence", "regular", { tags: ["guys-121"], roles: ["Leader"] }),
  makePerson("90", "Grace Mao"),
  makePerson("91", "Grace Seah"),
  makePerson("92", "Beat"),
  makePerson("93", "Cephas"),
  makePerson("94", "Jolynn"),
  makePerson("95", "Derek"),
  makePerson("96", "Wen Hong"),
  makePerson("97", "Ryan"),
  makePerson("98", "Joyce"),
  makePerson("99", "Stephilma"),
  makePerson("100", "Wen Jing"),
  makePerson("101", "Hannah T"),
  makePerson("102", "Shang Ji"),
  makePerson("103", "Samuel"),
  makePerson("104", "Andre", "infrequent"),
  makePerson("105", "Bingwen"),
];

export const groups: Group[] = [
  { id: "cg1", typeId: "cell", name: "Cell Group 1", members: ["1", "5", "10", "15", "20"], memberMeta: {} },
  { id: "cg2", typeId: "cell", name: "Cell Group 2", members: ["2", "6", "11", "16", "21"], memberMeta: {} },
  { id: "cg3", typeId: "cell", name: "Cell Group 3", members: ["3", "7", "12", "17", "22"], memberMeta: {} },
  { id: "r1", typeId: "resonate", name: "Resonate Group 1", members: ["4", "8", "13", "18", "23"], memberMeta: {} },
  { id: "r2", typeId: "resonate", name: "Resonate Group 2", members: ["9", "14", "19", "24", "25"], memberMeta: {} },
  { id: "r3", typeId: "resonate", name: "Resonate Group 3", members: ["26", "27", "28", "29", "30"], memberMeta: {} },
  { id: "y1", typeId: "yag", name: "YAG Group 1", members: ["3", "31", "32", "37", "38"], memberMeta: {} },
  { id: "y2", typeId: "yag", name: "YAG Group 2", members: ["33", "34", "39", "40", "41"], memberMeta: {} },
  { id: "y3", typeId: "yag", name: "YAG Group 3", members: ["42", "43", "44", "45", "46"], memberMeta: {} },
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
