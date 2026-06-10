export type Role = "admin" | "hr" | "manager" | "employee" | "candidate";

export interface User {
  id: string;
  email: string;
  password: string;
  fullName: string;
  role: Role;
  employeeId?: string;
  candidateId?: string;
  avatar?: string;
  createdAt: string;
}

export interface Department {
  id: string;
  name: string;
  managerId?: string;
}

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  photo?: string;
  position: string;
  departmentId: string;
  managerId?: string;
  hireDate: string;
  contractType: "CDI" | "CDD" | "Stage" | "Freelance" | "Alternance";
  salary: number;
  status: "active" | "onboarding" | "archived";
  leaveBalance: number;
}

export interface JobOffer {
  id: string;
  title: string;
  departmentId: string;
  contractType: "CDI" | "CDD" | "Stage" | "Freelance" | "Alternance";
  experienceLevel: "junior" | "intermediate" | "senior" | "lead";
  salaryMin?: number;
  salaryMax?: number;
  description: string;
  skills: string[];
  location: string;
  deadline?: string;
  status: "draft" | "published" | "archived";
  createdAt: string;
}

export type CandidateStage =
  | "received"
  | "analysis"
  | "shortlisted"
  | "technical_test"
  | "hr_interview"
  | "manager_interview"
  | "final_validation"
  | "hired"
  | "rejected"
  | "archived";

export interface Candidate {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  photo?: string;
  cv?: string; // text content or data url
  coverLetter?: string;
  skills: string[];
  experiences: string;
  education: string;
  jobOfferId?: string;
  stage: CandidateStage;
  rating?: number;
  tags: string[];
  favorite: boolean;
  notes: { id: string; author: string; text: string; date: string }[];
  history: { id: string; action: string; date: string }[];
  createdAt: string;
}

export interface Interview {
  id: string;
  candidateId: string;
  jobOfferId?: string;
  type: "hr" | "technical" | "manager" | "final";
  date: string;
  interviewers: string[];
  location: string;
  notes?: string;
  score?: number;
  decision?: "pass" | "fail" | "pending";
  status: "scheduled" | "done" | "cancelled";
}

export type LeaveType =
  | "annual"
  | "sick"
  | "maternity"
  | "paternity"
  | "exceptional"
  | "remote";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  reason?: string;
  status: "pending" | "manager_approved" | "approved" | "rejected" | "cancelled";
  createdAt: string;
}

export interface Attendance {
  id: string;
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: "present" | "late" | "absent" | "remote";
}

export interface Objective {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  dueDate: string;
  progress: number;
  status: "in_progress" | "done" | "cancelled";
}

export interface Evaluation {
  id: string;
  employeeId: string;
  period: string;
  selfScore?: number;
  managerScore?: number;
  hrScore?: number;
  comments?: string;
  date: string;
}

export interface Training {
  id: string;
  title: string;
  type: "internal" | "external";
  description: string;
  duration: string;
  enrolled: string[]; // employee ids
}

export interface DocumentItem {
  id: string;
  employeeId?: string;
  candidateId?: string;
  category: "contract" | "amendment" | "diploma" | "certificate" | "attestation" | "id" | "other";
  name: string;
  date: string;
  fileData?: string; // data url
}

export interface AuditLog {
  id: string;
  userId: string;
  userName: string;
  action: string;
  entity: string;
  date: string;
}

export interface CompanySettings {
  name: string;
  logo?: string;
  email: string;
  address: string;
  contracts: string[];
  positions: string[];
}
