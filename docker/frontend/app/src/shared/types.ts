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

export interface ProfileData {
  name: string;
  id: string;
  program: string;
  semester: number;
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
export interface User {
  id: string;
  name: string;
  email: string;
  program: string;
  carne: string;
}

export interface StoredUser extends User {
  password: string;
}
