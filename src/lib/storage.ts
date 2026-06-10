import type {
  AuditLog,
  Attendance,
  Candidate,
  CompanySettings,
  Department,
  DocumentItem,
  Employee,
  Evaluation,
  Interview,
  JobOffer,
  LeaveRequest,
  Objective,
  Training,
  User,
} from "./types";

const KEYS = {
  users: "hr.users",
  employees: "hr.employees",
  departments: "hr.departments",
  offers: "hr.offers",
  candidates: "hr.candidates",
  interviews: "hr.interviews",
  leaves: "hr.leaves",
  attendance: "hr.attendance",
  objectives: "hr.objectives",
  evaluations: "hr.evaluations",
  trainings: "hr.trainings",
  documents: "hr.documents",
  audit: "hr.audit",
  settings: "hr.settings",
  session: "hr.session",
  theme: "hr.theme",
  lang: "hr.lang",
  seeded: "hr.seeded.v1",
} as const;

const isBrowser = () => typeof window !== "undefined";

export function read<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;
  try {
    const v = localStorage.getItem(key);
    return v ? (JSON.parse(v) as T) : fallback;
  } catch {
    return fallback;
  }
}
export function write<T>(key: string, value: T) {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

export const uid = () => Math.random().toString(36).slice(2, 10) + Date.now().toString(36);

export const db = {
  KEYS,
  users: {
    all: () => read<User[]>(KEYS.users, []),
    save: (v: User[]) => write(KEYS.users, v),
  },
  employees: {
    all: () => read<Employee[]>(KEYS.employees, []),
    save: (v: Employee[]) => write(KEYS.employees, v),
  },
  departments: {
    all: () => read<Department[]>(KEYS.departments, []),
    save: (v: Department[]) => write(KEYS.departments, v),
  },
  offers: {
    all: () => read<JobOffer[]>(KEYS.offers, []),
    save: (v: JobOffer[]) => write(KEYS.offers, v),
  },
  candidates: {
    all: () => read<Candidate[]>(KEYS.candidates, []),
    save: (v: Candidate[]) => write(KEYS.candidates, v),
  },
  interviews: {
    all: () => read<Interview[]>(KEYS.interviews, []),
    save: (v: Interview[]) => write(KEYS.interviews, v),
  },
  leaves: {
    all: () => read<LeaveRequest[]>(KEYS.leaves, []),
    save: (v: LeaveRequest[]) => write(KEYS.leaves, v),
  },
  attendance: {
    all: () => read<Attendance[]>(KEYS.attendance, []),
    save: (v: Attendance[]) => write(KEYS.attendance, v),
  },
  objectives: {
    all: () => read<Objective[]>(KEYS.objectives, []),
    save: (v: Objective[]) => write(KEYS.objectives, v),
  },
  evaluations: {
    all: () => read<Evaluation[]>(KEYS.evaluations, []),
    save: (v: Evaluation[]) => write(KEYS.evaluations, v),
  },
  trainings: {
    all: () => read<Training[]>(KEYS.trainings, []),
    save: (v: Training[]) => write(KEYS.trainings, v),
  },
  documents: {
    all: () => read<DocumentItem[]>(KEYS.documents, []),
    save: (v: DocumentItem[]) => write(KEYS.documents, v),
  },
  audit: {
    all: () => read<AuditLog[]>(KEYS.audit, []),
    save: (v: AuditLog[]) => write(KEYS.audit, v),
    log: (entry: Omit<AuditLog, "id" | "date">) => {
      const list = read<AuditLog[]>(KEYS.audit, []);
      list.unshift({ ...entry, id: uid(), date: new Date().toISOString() });
      write(KEYS.audit, list.slice(0, 500));
    },
  },
  settings: {
    get: (): CompanySettings =>
      read<CompanySettings>(KEYS.settings, {
        name: "Acme RH",
        email: "contact@acme.fr",
        address: "1 rue de la Paix, Paris",
        contracts: ["CDI", "CDD", "Stage", "Freelance", "Alternance"],
        positions: ["Développeur", "Designer", "Manager", "Commercial", "Comptable"],
      }),
    save: (v: CompanySettings) => write(KEYS.settings, v),
  },
};

export function exportAll(): string {
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(KEYS)) {
    if (k === "session" || k === "theme" || k === "lang" || k === "seeded") continue;
    data[v] = read(v, null);
  }
  return JSON.stringify(data, null, 2);
}

export function importAll(json: string) {
  const data = JSON.parse(json) as Record<string, unknown>;
  for (const [k, v] of Object.entries(data)) {
    write(k, v);
  }
}

export function resetAll() {
  if (!isBrowser()) return;
  for (const v of Object.values(KEYS)) localStorage.removeItem(v);
}

export function seedIfEmpty() {
  if (!isBrowser()) return;
  if (localStorage.getItem(KEYS.seeded)) return;

  const departments: Department[] = [
    { id: "dep1", name: "Ingénierie" },
    { id: "dep2", name: "Produit" },
    { id: "dep3", name: "Marketing" },
    { id: "dep4", name: "Ressources Humaines" },
    { id: "dep5", name: "Ventes" },
  ];

  const employees: Employee[] = [
    {
      id: "emp1", firstName: "Sophie", lastName: "Martin", email: "sophie@acme.fr",
      phone: "+33 6 12 34 56 78", position: "Directrice RH", departmentId: "dep4",
      hireDate: "2018-03-15", contractType: "CDI", salary: 75000, status: "active", leaveBalance: 25,
    },
    {
      id: "emp2", firstName: "Lucas", lastName: "Dubois", email: "lucas@acme.fr",
      phone: "+33 6 23 45 67 89", position: "Lead Developer", departmentId: "dep1",
      managerId: "emp4", hireDate: "2019-09-01", contractType: "CDI", salary: 68000, status: "active", leaveBalance: 18,
    },
    {
      id: "emp3", firstName: "Emma", lastName: "Bernard", email: "emma@acme.fr",
      phone: "+33 6 34 56 78 90", position: "Product Designer", departmentId: "dep2",
      managerId: "emp4", hireDate: "2021-06-10", contractType: "CDI", salary: 52000, status: "active", leaveBalance: 22,
    },
    {
      id: "emp4", firstName: "Thomas", lastName: "Petit", email: "thomas@acme.fr",
      phone: "+33 6 45 67 89 01", position: "CTO", departmentId: "dep1",
      hireDate: "2017-01-20", contractType: "CDI", salary: 95000, status: "active", leaveBalance: 20,
    },
    {
      id: "emp5", firstName: "Camille", lastName: "Robert", email: "camille@acme.fr",
      phone: "+33 6 56 78 90 12", position: "Responsable Marketing", departmentId: "dep3",
      hireDate: "2020-04-12", contractType: "CDI", salary: 58000, status: "active", leaveBalance: 24,
    },
    {
      id: "emp6", firstName: "Hugo", lastName: "Moreau", email: "hugo@acme.fr",
      phone: "+33 6 67 89 01 23", position: "Commercial", departmentId: "dep5",
      managerId: "emp7", hireDate: "2022-02-01", contractType: "CDI", salary: 45000, status: "active", leaveBalance: 25,
    },
    {
      id: "emp7", firstName: "Léa", lastName: "Laurent", email: "lea@acme.fr",
      phone: "+33 6 78 90 12 34", position: "Directrice Commerciale", departmentId: "dep5",
      hireDate: "2019-11-05", contractType: "CDI", salary: 82000, status: "active", leaveBalance: 21,
    },
    {
      id: "emp8", firstName: "Nathan", lastName: "Simon", email: "nathan@acme.fr",
      phone: "+33 6 89 01 23 45", position: "Développeur Front-end", departmentId: "dep1",
      managerId: "emp2", hireDate: "2023-01-09", contractType: "CDI", salary: 48000, status: "active", leaveBalance: 25,
    },
  ];

  const users: User[] = [
    { id: "u1", email: "admin@acme.fr", password: "admin123", fullName: "Admin Système", role: "admin", createdAt: new Date().toISOString() },
    { id: "u2", email: "sophie@acme.fr", password: "rh123", fullName: "Sophie Martin", role: "hr", employeeId: "emp1", createdAt: new Date().toISOString() },
    { id: "u3", email: "thomas@acme.fr", password: "manager123", fullName: "Thomas Petit", role: "manager", employeeId: "emp4", createdAt: new Date().toISOString() },
    { id: "u4", email: "lucas@acme.fr", password: "emp123", fullName: "Lucas Dubois", role: "employee", employeeId: "emp2", createdAt: new Date().toISOString() },
    { id: "u5", email: "candidat@example.com", password: "cand123", fullName: "Julie Candidate", role: "candidate", createdAt: new Date().toISOString() },
  ];

  const offers: JobOffer[] = [
    {
      id: "off1", title: "Développeur Full-Stack Senior", departmentId: "dep1", contractType: "CDI",
      experienceLevel: "senior", salaryMin: 55000, salaryMax: 75000,
      description: "Nous recherchons un développeur Full-Stack expérimenté pour rejoindre notre équipe.",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL"], location: "Paris",
      deadline: "2026-08-15", status: "published", createdAt: new Date().toISOString(),
    },
    {
      id: "off2", title: "Product Designer", departmentId: "dep2", contractType: "CDI",
      experienceLevel: "intermediate", salaryMin: 45000, salaryMax: 60000,
      description: "Designer produit avec un sens aigu de l'UX/UI.",
      skills: ["Figma", "Design System", "User Research"], location: "Lyon",
      deadline: "2026-07-30", status: "published", createdAt: new Date().toISOString(),
    },
    {
      id: "off3", title: "Stagiaire Marketing", departmentId: "dep3", contractType: "Stage",
      experienceLevel: "junior", salaryMin: 1200, salaryMax: 1500,
      description: "Stage de 6 mois en marketing digital.",
      skills: ["SEO", "Google Analytics", "Réseaux sociaux"], location: "Remote",
      deadline: "2026-09-01", status: "draft", createdAt: new Date().toISOString(),
    },
  ];

  const candidates: Candidate[] = [
    {
      id: "cand1", firstName: "Julie", lastName: "Candidate", email: "candidat@example.com",
      phone: "+33 6 11 22 33 44", skills: ["React", "TypeScript", "Node.js"],
      experiences: "5 ans en développement web", education: "Master Informatique",
      jobOfferId: "off1", stage: "hr_interview", rating: 4, tags: ["top"], favorite: true,
      notes: [], history: [], createdAt: new Date().toISOString(),
    },
    {
      id: "cand2", firstName: "Marc", lastName: "Lefebvre", email: "marc.l@example.com",
      phone: "+33 6 22 33 44 55", skills: ["Figma", "Sketch"],
      experiences: "3 ans designer", education: "Bachelor Design",
      jobOfferId: "off2", stage: "analysis", rating: 3, tags: [], favorite: false,
      notes: [], history: [], createdAt: new Date().toISOString(),
    },
    {
      id: "cand3", firstName: "Aisha", lastName: "Diallo", email: "aisha.d@example.com",
      phone: "+33 6 33 44 55 66", skills: ["React", "Vue"],
      experiences: "2 ans junior dev", education: "Licence Info",
      jobOfferId: "off1", stage: "received", rating: 3, tags: [], favorite: false,
      notes: [], history: [], createdAt: new Date().toISOString(),
    },
    {
      id: "cand4", firstName: "Karim", lastName: "Benali", email: "karim.b@example.com",
      phone: "+33 6 44 55 66 77", skills: ["Node.js", "Python"],
      experiences: "8 ans backend", education: "Ingénieur",
      jobOfferId: "off1", stage: "shortlisted", rating: 5, tags: ["top", "senior"], favorite: true,
      notes: [], history: [], createdAt: new Date().toISOString(),
    },
    {
      id: "cand5", firstName: "Sarah", lastName: "Cohen", email: "sarah.c@example.com",
      phone: "+33 6 55 66 77 88", skills: ["UI", "UX"],
      experiences: "4 ans designer", education: "Master Design",
      jobOfferId: "off2", stage: "technical_test", rating: 4, tags: [], favorite: false,
      notes: [], history: [], createdAt: new Date().toISOString(),
    },
    {
      id: "cand6", firstName: "Antoine", lastName: "Mercier", email: "antoine.m@example.com",
      phone: "+33 6 66 77 88 99", skills: ["SEO", "Marketing"],
      experiences: "1 an stage", education: "Master Marketing",
      jobOfferId: "off3", stage: "manager_interview", rating: 4, tags: [], favorite: false,
      notes: [], history: [], createdAt: new Date().toISOString(),
    },
  ];

  const today = new Date();
  const inDays = (n: number) => {
    const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString();
  };

  const interviews: Interview[] = [
    {
      id: "iv1", candidateId: "cand1", jobOfferId: "off1", type: "hr",
      date: inDays(2), interviewers: ["emp1"], location: "Visioconférence",
      status: "scheduled", decision: "pending",
    },
    {
      id: "iv2", candidateId: "cand4", jobOfferId: "off1", type: "technical",
      date: inDays(5), interviewers: ["emp2"], location: "Sur site",
      status: "scheduled", decision: "pending",
    },
    {
      id: "iv3", candidateId: "cand6", jobOfferId: "off3", type: "manager",
      date: inDays(-3), interviewers: ["emp5"], location: "Sur site",
      score: 16, status: "done", decision: "pass", notes: "Bon profil junior.",
    },
  ];

  const leaves: LeaveRequest[] = [
    {
      id: "lv1", employeeId: "emp2", type: "annual", startDate: inDays(10),
      endDate: inDays(17), reason: "Vacances famille", status: "pending",
      createdAt: new Date().toISOString(),
    },
    {
      id: "lv2", employeeId: "emp3", type: "remote", startDate: inDays(1),
      endDate: inDays(1), reason: "Télétravail", status: "manager_approved",
      createdAt: new Date().toISOString(),
    },
    {
      id: "lv3", employeeId: "emp8", type: "sick", startDate: inDays(-2),
      endDate: inDays(-1), status: "approved",
      createdAt: new Date().toISOString(),
    },
  ];

  const attendance: Attendance[] = employees.flatMap((e) =>
    Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - i);
      return {
        id: uid(), employeeId: e.id, date: d.toISOString().slice(0, 10),
        checkIn: "09:0" + ((i + 1) % 6), checkOut: "18:0" + ((i + 2) % 6),
        status: (i === 2 && e.id === "emp3" ? "remote" : i === 1 && e.id === "emp6" ? "late" : "present") as Attendance["status"],
      };
    })
  );

  const objectives: Objective[] = [
    { id: "ob1", employeeId: "emp2", title: "Livrer v2 du produit", description: "MEP du projet refonte", dueDate: inDays(60), progress: 65, status: "in_progress" },
    { id: "ob2", employeeId: "emp3", title: "Refonte Design System", description: "", dueDate: inDays(45), progress: 80, status: "in_progress" },
    { id: "ob3", employeeId: "emp6", title: "+20% nouveaux clients", description: "", dueDate: inDays(90), progress: 40, status: "in_progress" },
  ];

  const evaluations: Evaluation[] = [
    { id: "ev1", employeeId: "emp2", period: "2025-S1", selfScore: 4, managerScore: 4.5, hrScore: 4.3, date: "2025-07-01", comments: "Excellent travail." },
    { id: "ev2", employeeId: "emp3", period: "2025-S1", selfScore: 4, managerScore: 4.2, hrScore: 4.1, date: "2025-07-01" },
  ];

  const trainings: Training[] = [
    { id: "tr1", title: "Formation TypeScript Avancé", type: "external", description: "3 jours de formation TS", duration: "21h", enrolled: ["emp2", "emp8"] },
    { id: "tr2", title: "Communication Interne", type: "internal", description: "Atelier soft skills", duration: "4h", enrolled: ["emp6", "emp3"] },
  ];

  db.users.save(users);
  db.employees.save(employees);
  db.departments.save(departments);
  db.offers.save(offers);
  db.candidates.save(candidates);
  db.interviews.save(interviews);
  db.leaves.save(leaves);
  db.attendance.save(attendance);
  db.objectives.save(objectives);
  db.evaluations.save(evaluations);
  db.trainings.save(trainings);
  db.documents.save([]);
  db.audit.save([]);
  db.settings.save(db.settings.get());

  localStorage.setItem(KEYS.seeded, "1");
}
