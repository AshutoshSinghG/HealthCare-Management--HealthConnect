export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  ADMIN: 'admin',
  DOCTOR: 'doctor',
  PATIENT: 'patient',
};

export const ROUTES = {
  LOGIN: '/login',
  MFA: '/mfa',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_TREATMENTS: '/patient/treatments',
  PATIENT_TREATMENT_DETAIL: '/patient/treatments/:id',
  PATIENT_UNSUITABLE_MEDICINES: '/patient/unsuitable-medicines',
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  DOCTOR_PATIENTS: '/doctor/patients',
  DOCTOR_PATIENT_DETAIL: '/doctor/patients/:id',
  DOCTOR_CREATE_TREATMENT: '/doctor/treatments/create',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
};

export const TREATMENT_OUTCOMES = [
  { value: 'improved', label: 'Improved' },
  { value: 'stable', label: 'Stable' },
  { value: 'worsened', label: 'Worsened' },
  { value: 'recovered', label: 'Recovered' },
  { value: 'referred', label: 'Referred' },
];

export const MEDICATION_ROUTES = [
  { value: 'oral', label: 'Oral' },
  { value: 'iv', label: 'Intravenous (IV)' },
  { value: 'im', label: 'Intramuscular (IM)' },
  { value: 'sc', label: 'Subcutaneous (SC)' },
  { value: 'topical', label: 'Topical' },
  { value: 'inhalation', label: 'Inhalation' },
  { value: 'sublingual', label: 'Sublingual' },
  { value: 'rectal', label: 'Rectal' },
];

export const MEDICATION_FREQUENCIES = [
  { value: 'od', label: 'Once Daily (OD)' },
  { value: 'bd', label: 'Twice Daily (BD)' },
  { value: 'tds', label: 'Three Times Daily (TDS)' },
  { value: 'qid', label: 'Four Times Daily (QID)' },
  { value: 'prn', label: 'As Needed (PRN)' },
  { value: 'stat', label: 'Immediately (STAT)' },
  { value: 'weekly', label: 'Weekly' },
];

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export const AUDIT_ACTIONS = [
  { value: 'login', label: 'Login' },
  { value: 'logout', label: 'Logout' },
  { value: 'create', label: 'Create' },
  { value: 'update', label: 'Update' },
  { value: 'delete', label: 'Delete' },
  { value: 'view', label: 'View' },
  { value: 'export', label: 'Export' },
];
