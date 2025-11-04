// Centralized app types to avoid ad-hoc 'any' and repeated literals

export type Difficulty = "Fácil" | "Intermedio" | "Difícil";

export type CourseKind = "obligatorio" | "electivo";

export interface Capacity {
  current: number;
  total: number;
}

export interface CourseSummary {
  code: string;
  name: string;
  credits: number;
  schedule?: string;
  professor?: string;
  description?: string;
  difficulty?: Difficulty;
  rating?: number;
  capacity?: Capacity;
  type?: CourseKind;
}

export type CourseStatus =
  | "not-coursed"
  | "in-progress"
  | "approved"
  | "failed";

// Scheduling models
export type DayName =
  | "Lunes"
  | "Martes"
  | "Miércoles"
  | "Jueves"
  | "Viernes"
  | "Sábado";

export interface TimeSlot {
  day: DayName;
  startTime: string; // HH:mm
  endTime: string; // HH:mm
}

export interface ScheduledCourse extends TimeSlot {
  id: string | number;
  code: string;
  name: string;
  professor: string;
  hasConflict: boolean;
  isCurrent: boolean;
  location?: string;
}

export interface DashboardMeeting {
  day: string;
  startTime: string;
  endTime: string;
}

export interface CourseGroup extends TimeSlot {
  id: number;
  name: string;
  schedule: string;
  location?: string;
}

export interface NextCourse {
  id: number;
  code: string;
  name: string;
  professor: string;
  dependsOn?: string[];
  credits?: number;
  groups: CourseGroup[];
}

// Authentication types
export interface UserProgramRef {
  code: string | null;
  name: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  program: UserProgramRef | null;
  carne: string;
}

export interface DashboardProgress {
  progress: number;
  completedCredits: number;
  totalCredits: number;
  currentSemester: number;
  remainingSemesters: number;
}

export interface DashboardCourse {
  code: string;
  name: string;
  term: string;
  section: string;
  professor: string;
  location?: string | null;
  meetings: DashboardMeeting[];
}

export interface DashboardEvent {
  id: number;
  title: string;
  description?: string | null;
  date: string;
  severity: "info" | "warning" | "danger";
  programCode?: string | null;
}

export interface DashboardResponse {
  user: User;
  progress: DashboardProgress;
  currentCourses: DashboardCourse[];
  upcomingEvents: DashboardEvent[];
}

export interface CurriculumCourse {
  code: string;
  name: string;
  credits: number;
  hours: number;
  requirements?: string;
  corequisites?: string;
  status: CourseStatus;
}

export interface CurriculumBlock {
  blockNumber: number;
  courses: CurriculumCourse[];
}

export interface ProgramDetails {
  code: string;
  name: string;
  jornada?: string | null;
  degree?: string | null;
  sedes: string[];
  lastUpdated?: string | null;
  totalCredits: number;
  numberOfSemesters: number;
}

export interface CurriculumResponse {
  program: ProgramDetails;
  progress: DashboardProgress;
  blocks: CurriculumBlock[];
}

export interface ProgramSummary {
  id: number;
  code: string;
  name: string;
  jornada?: string | null;
  degree?: string | null;
  sedes?: string[];
  lastUpdated?: string | null;
  totalCredits?: number;
  numberOfSemesters?: number;
}

export type ScheduleEntry = DashboardCourse;
}
