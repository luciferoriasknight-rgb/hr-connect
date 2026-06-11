import type {
  AuditLog, Attendance, Candidate, Company, CompanySettings, Department,
  DocumentItem, Employee, Evaluation, Interview, Invitation, JobOffer,
  LeaveRequest, Notification, Objective, Payment, PaymentMethod, Training, User,
} from "./types";

const KEYS = {
  companies: "hr.companies",
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
  invitations: "hr.invitations",
  notifications: "hr.notifications",
  paymentMethods: "hr.paymentMethods",
  payments: "hr.payments",
  session: "hr.session",
  theme: "hr.theme",
  lang: "hr.lang",
  activeCompany: "hr.activeCompanyId",
  seeded: "hr.seeded.v3",
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

export const makeInviteCode = () =>
  Array.from({ length: 8 }, () => "ABCDEFGHJKMNPQRSTUVWXYZ23456789"[Math.floor(Math.random() * 31)]).join("");

export function getActiveCompanyId(): string | null {
  if (!isBrowser()) return null;
  return localStorage.getItem(KEYS.activeCompany);
}
export function setActiveCompanyId(id: string | null) {
  if (!isBrowser()) return;
  if (id) localStorage.setItem(KEYS.activeCompany, id);
  else localStorage.removeItem(KEYS.activeCompany);
}

/** Scoped entity: filters by active companyId and protects saves from wiping other tenants. */
function scoped<T extends { id: string; companyId?: string }>(key: string) {
  return {
    raw: () => read<T[]>(key, []),
    all: () => {
      const cid = getActiveCompanyId();
      const items = read<T[]>(key, []);
      return cid ? items.filter((x) => x.companyId === cid) : items;
    },
    save: (items: T[]) => {
      const cid = getActiveCompanyId();
      const allItems = read<T[]>(key, []);
      if (cid) {
        const stamped = items.map((x) => (x.companyId ? x : { ...x, companyId: cid }));
        const others = allItems.filter((x) => x.companyId !== cid);
        write(key, [...stamped, ...others]);
      } else {
        write(key, items);
      }
    },
    get: (id: string) => read<T[]>(key, []).find((x) => x.id === id),
  };
}

export const db = {
  KEYS,
  companies: {
    all: () => read<Company[]>(KEYS.companies, []),
    save: (v: Company[]) => write(KEYS.companies, v),
    get: (id?: string) => (id ? read<Company[]>(KEYS.companies, []).find((c) => c.id === id) : undefined),
    byInvite: (code: string) =>
      read<Company[]>(KEYS.companies, []).find((c) => c.inviteCode.toUpperCase() === code.toUpperCase()),
  },
  users: scoped<User>(KEYS.users),
  employees: scoped<Employee>(KEYS.employees),
  departments: scoped<Department>(KEYS.departments),
  offers: scoped<JobOffer>(KEYS.offers),
  candidates: scoped<Candidate>(KEYS.candidates),
  interviews: scoped<Interview>(KEYS.interviews),
  leaves: scoped<LeaveRequest>(KEYS.leaves),
  attendance: scoped<Attendance>(KEYS.attendance),
  objectives: scoped<Objective>(KEYS.objectives),
  evaluations: scoped<Evaluation>(KEYS.evaluations),
  trainings: scoped<Training>(KEYS.trainings),
  documents: scoped<DocumentItem>(KEYS.documents),
  invitations: scoped<Invitation>(KEYS.invitations),
  notifications: scoped<Notification>(KEYS.notifications),
  paymentMethods: scoped<PaymentMethod>(KEYS.paymentMethods),
  payments: scoped<Payment>(KEYS.payments),
  audit: {
    all: () => {
      const cid = getActiveCompanyId();
      const items = read<AuditLog[]>(KEYS.audit, []);
      return cid ? items.filter((x) => x.companyId === cid) : items;
    },
    raw: () => read<AuditLog[]>(KEYS.audit, []),
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
        name: "RHConnect",
        email: "contact@rhconnect.io",
        address: "1 rue de la Paix, Paris",
        contracts: ["CDI", "CDD", "Stage", "Freelance", "Alternance"],
        positions: ["Développeur", "Designer", "Manager", "Commercial", "Comptable"],
      }),
    save: (v: CompanySettings) => write(KEYS.settings, v),
  },
};

export function notify(entry: Omit<Notification, "id" | "createdAt" | "read">) {
  const item: Notification = { ...entry, id: uid(), read: false, createdAt: new Date().toISOString() };
  // Bypass scope - notifications can target users in any company
  const all = read<Notification[]>(KEYS.notifications, []);
  all.unshift(item);
  write(KEYS.notifications, all.slice(0, 1000));
}

export function exportAll(): string {
  const data: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(KEYS)) {
    if (["session", "theme", "lang", "seeded", "activeCompany"].includes(k)) continue;
    data[v] = read(v, null);
  }
  return JSON.stringify(data, null, 2);
}

export function importAll(json: string) {
  const data = JSON.parse(json) as Record<string, unknown>;
  for (const [k, v] of Object.entries(data)) write(k, v);
}

export function resetAll() {
  if (!isBrowser()) return;
  for (const v of Object.values(KEYS)) localStorage.removeItem(v);
}

export function seedIfEmpty() {
  if (!isBrowser()) return;
  if (localStorage.getItem(KEYS.seeded)) return;
  // Wipe legacy versions
  ["hr.seeded.v1", "hr.seeded.v2"].forEach((k) => localStorage.removeItem(k));
  for (const v of Object.values(KEYS)) {
    if (v === KEYS.theme || v === KEYS.lang) continue;
    localStorage.removeItem(v);
  }

  const companies: Company[] = [
    { id: "co_acme", name: "Acme Corp", slug: "acme", inviteCode: "ACME2026", industry: "Tech", size: "51-200", country: "France", plan: "pro", createdAt: new Date().toISOString() },
    { id: "co_globex", name: "Globex SA", slug: "globex", inviteCode: "GLOBEX26", industry: "Industrie", size: "201-1000", country: "France", plan: "enterprise", createdAt: new Date().toISOString() },
  ];

  const cid = "co_acme";

  const departments: Department[] = [
    { id: "dep1", companyId: cid, name: "Ingénierie" },
    { id: "dep2", companyId: cid, name: "Produit" },
    { id: "dep3", companyId: cid, name: "Marketing" },
    { id: "dep4", companyId: cid, name: "Ressources Humaines" },
    { id: "dep5", companyId: cid, name: "Ventes" },
    { id: "dep_gx1", companyId: "co_globex", name: "Production" },
    { id: "dep_gx2", companyId: "co_globex", name: "Logistique" },
  ];

  const employees: Employee[] = [
    { id: "emp1", companyId: cid, firstName: "Sophie", lastName: "Martin", email: "sophie@acme.fr", phone: "+33 6 12 34 56 78", position: "Directrice RH", departmentId: "dep4", hireDate: "2018-03-15", contractType: "CDI", salary: 75000, status: "active", leaveBalance: 25 },
    { id: "emp2", companyId: cid, firstName: "Lucas", lastName: "Dubois", email: "lucas@acme.fr", phone: "+33 6 23 45 67 89", position: "Lead Developer", departmentId: "dep1", managerId: "emp4", hireDate: "2019-09-01", contractType: "CDI", salary: 68000, status: "active", leaveBalance: 18 },
    { id: "emp3", companyId: cid, firstName: "Emma", lastName: "Bernard", email: "emma@acme.fr", phone: "+33 6 34 56 78 90", position: "Product Designer", departmentId: "dep2", managerId: "emp4", hireDate: "2021-06-10", contractType: "CDI", salary: 52000, status: "active", leaveBalance: 22 },
    { id: "emp4", companyId: cid, firstName: "Thomas", lastName: "Petit", email: "thomas@acme.fr", phone: "+33 6 45 67 89 01", position: "CTO", departmentId: "dep1", hireDate: "2017-01-20", contractType: "CDI", salary: 95000, status: "active", leaveBalance: 20 },
    { id: "emp5", companyId: cid, firstName: "Camille", lastName: "Robert", email: "camille@acme.fr", phone: "+33 6 56 78 90 12", position: "Responsable Marketing", departmentId: "dep3", hireDate: "2020-04-12", contractType: "CDI", salary: 58000, status: "active", leaveBalance: 24 },
    { id: "emp6", companyId: cid, firstName: "Hugo", lastName: "Moreau", email: "hugo@acme.fr", phone: "+33 6 67 89 01 23", position: "Commercial", departmentId: "dep5", managerId: "emp7", hireDate: "2022-02-01", contractType: "CDI", salary: 45000, status: "active", leaveBalance: 25 },
    { id: "emp7", companyId: cid, firstName: "Léa", lastName: "Laurent", email: "lea@acme.fr", phone: "+33 6 78 90 12 34", position: "Directrice Commerciale", departmentId: "dep5", hireDate: "2019-11-05", contractType: "CDI", salary: 82000, status: "active", leaveBalance: 21 },
    { id: "emp8", companyId: cid, firstName: "Nathan", lastName: "Simon", email: "nathan@acme.fr", phone: "+33 6 89 01 23 45", position: "Développeur Front-end", departmentId: "dep1", managerId: "emp2", hireDate: "2023-01-09", contractType: "CDI", salary: 48000, status: "active", leaveBalance: 25 },
    { id: "emp_gx1", companyId: "co_globex", firstName: "Pierre", lastName: "Garnier", email: "pierre@globex.fr", phone: "+33 6 11 11 11 11", position: "Directeur Production", departmentId: "dep_gx1", hireDate: "2015-05-01", contractType: "CDI", salary: 88000, status: "active", leaveBalance: 22 },
  ];

  const users: User[] = [
    { id: "u0", email: "owner@rhconnect.io", password: "owner123", fullName: "Super Admin", role: "super_admin", createdAt: new Date().toISOString() },
    { id: "u1", email: "admin@acme.fr", password: "admin123", fullName: "Admin Acme", role: "admin", companyId: cid, createdAt: new Date().toISOString() },
    { id: "u2", email: "sophie@acme.fr", password: "rh123", fullName: "Sophie Martin", role: "hr", companyId: cid, employeeId: "emp1", createdAt: new Date().toISOString() },
    { id: "u3", email: "thomas@acme.fr", password: "manager123", fullName: "Thomas Petit", role: "manager", companyId: cid, employeeId: "emp4", createdAt: new Date().toISOString() },
    { id: "u4", email: "lucas@acme.fr", password: "emp123", fullName: "Lucas Dubois", role: "employee", companyId: cid, employeeId: "emp2", createdAt: new Date().toISOString() },
    { id: "u5", email: "candidat@example.com", password: "cand123", fullName: "Julie Candidate", role: "candidate", createdAt: new Date().toISOString() },
    { id: "u6", email: "admin@globex.fr", password: "admin123", fullName: "Admin Globex", role: "admin", companyId: "co_globex", createdAt: new Date().toISOString() },
  ];

  const offers: JobOffer[] = [
    { id: "off1", companyId: cid, title: "Développeur Full-Stack Senior", departmentId: "dep1", contractType: "CDI", experienceLevel: "senior", salaryMin: 55000, salaryMax: 75000, description: "Nous recherchons un développeur Full-Stack expérimenté.", skills: ["React", "Node.js", "TypeScript", "PostgreSQL"], location: "Paris", deadline: "2026-08-15", status: "published", createdAt: new Date().toISOString() },
    { id: "off2", companyId: cid, title: "Product Designer", departmentId: "dep2", contractType: "CDI", experienceLevel: "intermediate", salaryMin: 45000, salaryMax: 60000, description: "Designer produit avec un sens aigu de l'UX/UI.", skills: ["Figma", "Design System", "User Research"], location: "Lyon", deadline: "2026-07-30", status: "published", createdAt: new Date().toISOString() },
    { id: "off3", companyId: cid, title: "Stagiaire Marketing", departmentId: "dep3", contractType: "Stage", experienceLevel: "junior", salaryMin: 1200, salaryMax: 1500, description: "Stage de 6 mois en marketing digital.", skills: ["SEO", "Google Analytics", "Réseaux sociaux"], location: "Remote", deadline: "2026-09-01", status: "draft", createdAt: new Date().toISOString() },
  ];

  const candidates: Candidate[] = [
    { id: "cand1", companyId: cid, firstName: "Julie", lastName: "Candidate", email: "candidat@example.com", phone: "+33 6 11 22 33 44", skills: ["React", "TypeScript", "Node.js"], experiences: "5 ans en dev web", education: "Master Informatique", jobOfferId: "off1", stage: "hr_interview", rating: 4, tags: ["top"], favorite: true, notes: [], history: [], createdAt: new Date().toISOString() },
    { id: "cand2", companyId: cid, firstName: "Marc", lastName: "Lefebvre", email: "marc.l@example.com", phone: "+33 6 22 33 44 55", skills: ["Figma", "Sketch"], experiences: "3 ans designer", education: "Bachelor Design", jobOfferId: "off2", stage: "analysis", rating: 3, tags: [], favorite: false, notes: [], history: [], createdAt: new Date().toISOString() },
    { id: "cand3", companyId: cid, firstName: "Aisha", lastName: "Diallo", email: "aisha.d@example.com", phone: "+33 6 33 44 55 66", skills: ["React", "Vue"], experiences: "2 ans junior dev", education: "Licence Info", jobOfferId: "off1", stage: "received", rating: 3, tags: [], favorite: false, notes: [], history: [], createdAt: new Date().toISOString() },
    { id: "cand4", companyId: cid, firstName: "Karim", lastName: "Benali", email: "karim.b@example.com", phone: "+33 6 44 55 66 77", skills: ["Node.js", "Python"], experiences: "8 ans backend", education: "Ingénieur", jobOfferId: "off1", stage: "shortlisted", rating: 5, tags: ["top", "senior"], favorite: true, notes: [], history: [], createdAt: new Date().toISOString() },
  ];

  const today = new Date();
  const inDays = (n: number) => { const d = new Date(today); d.setDate(d.getDate() + n); return d.toISOString(); };

  const interviews: Interview[] = [
    { id: "iv1", companyId: cid, candidateId: "cand1", jobOfferId: "off1", type: "hr", date: inDays(2), interviewers: ["emp1"], location: "Visioconférence", status: "scheduled", decision: "pending" },
    { id: "iv2", companyId: cid, candidateId: "cand4", jobOfferId: "off1", type: "technical", date: inDays(5), interviewers: ["emp2"], location: "Sur site", status: "scheduled", decision: "pending" },
  ];

  const leaves: LeaveRequest[] = [
    { id: "lv1", companyId: cid, employeeId: "emp2", type: "annual", startDate: inDays(10), endDate: inDays(17), reason: "Vacances famille", status: "pending", createdAt: new Date().toISOString() },
    { id: "lv2", companyId: cid, employeeId: "emp3", type: "remote", startDate: inDays(1), endDate: inDays(1), reason: "Télétravail", status: "manager_approved", createdAt: new Date().toISOString() },
  ];

  const attendance: Attendance[] = employees.flatMap((e) =>
    Array.from({ length: 5 }).map((_, i) => {
      const d = new Date(today); d.setDate(d.getDate() - i);
      return {
        id: uid(), companyId: e.companyId, employeeId: e.id, date: d.toISOString().slice(0, 10),
        checkIn: "09:0" + ((i + 1) % 6), checkOut: "18:0" + ((i + 2) % 6),
        status: (i === 2 && e.id === "emp3" ? "remote" : i === 1 && e.id === "emp6" ? "late" : "present") as Attendance["status"],
      };
    })
  );

  const objectives: Objective[] = [
    { id: "ob1", companyId: cid, employeeId: "emp2", title: "Livrer v2 du produit", description: "MEP du projet refonte", dueDate: inDays(60), progress: 65, status: "in_progress" },
    { id: "ob2", companyId: cid, employeeId: "emp3", title: "Refonte Design System", description: "", dueDate: inDays(45), progress: 80, status: "in_progress" },
  ];

  const evaluations: Evaluation[] = [
    { id: "ev1", companyId: cid, employeeId: "emp2", period: "2025-S1", selfScore: 4, managerScore: 4.5, hrScore: 4.3, date: "2025-07-01", comments: "Excellent travail." },
  ];

  const trainings: Training[] = [
    { id: "tr1", companyId: cid, title: "Formation TypeScript Avancé", type: "external", description: "3 jours TS", duration: "21h", enrolled: ["emp2", "emp8"] },
    { id: "tr2", companyId: cid, title: "Communication Interne", type: "internal", description: "Atelier soft skills", duration: "4h", enrolled: ["emp6", "emp3"] },
  ];

  const invitations: Invitation[] = [
    { id: uid(), companyId: cid, email: "invite1@acme.fr", role: "employee", status: "pending", invitedBy: "Admin Acme", createdAt: new Date().toISOString() },
    { id: uid(), companyId: cid, email: "invite2@acme.fr", role: "hr", status: "pending", invitedBy: "Admin Acme", createdAt: new Date().toISOString() },
  ];

  const notifications: Notification[] = [
    { id: uid(), companyId: cid, userId: "u1", title: "Bienvenue sur RHConnect", message: "Découvrez les modules en explorant le menu latéral.", type: "info", read: false, createdAt: new Date().toISOString() },
    { id: uid(), companyId: cid, userId: "u1", title: "Nouvelle candidature", message: "Karim Benali a postulé pour Développeur Full-Stack Senior.", type: "success", read: false, link: "/candidates", createdAt: new Date().toISOString() },
    { id: uid(), companyId: cid, userId: "u2", title: "Congé en attente", message: "Lucas Dubois a demandé 7 jours de congés.", type: "warning", read: false, link: "/leaves", createdAt: new Date().toISOString() },
  ];

  const paymentMethods: PaymentMethod[] = [
    { id: uid(), companyId: cid, type: "card", label: "Visa pro", holder: "Acme Corp", last4: "4242", expiry: "12/27", isDefault: true, createdAt: new Date().toISOString() },
  ];

  const payments: Payment[] = [
    { id: uid(), companyId: cid, amount: 240, currency: "EUR", method: "card", description: "Abonnement Pro – Janvier", status: "succeeded", invoiceNumber: "INV-2026-001", date: inDays(-30) },
    { id: uid(), companyId: cid, amount: 240, currency: "EUR", method: "card", description: "Abonnement Pro – Février", status: "succeeded", invoiceNumber: "INV-2026-002", date: inDays(-1) },
  ];

  db.companies.save(companies);
  write(KEYS.users, users);
  write(KEYS.employees, employees);
  write(KEYS.departments, departments);
  write(KEYS.offers, offers);
  write(KEYS.candidates, candidates);
  write(KEYS.interviews, interviews);
  write(KEYS.leaves, leaves);
  write(KEYS.attendance, attendance);
  write(KEYS.objectives, objectives);
  write(KEYS.evaluations, evaluations);
  write(KEYS.trainings, trainings);
  write(KEYS.documents, []);
  write(KEYS.audit, []);
  write(KEYS.invitations, invitations);
  write(KEYS.notifications, notifications);
  write(KEYS.paymentMethods, paymentMethods);
  write(KEYS.payments, payments);
  db.settings.save(db.settings.get());

  localStorage.setItem(KEYS.seeded, "1");
}
