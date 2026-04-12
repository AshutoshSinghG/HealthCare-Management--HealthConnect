export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const ROLES = {
  ADMIN: 'ADMIN',
  DOCTOR: 'DOCTOR',
  PATIENT: 'PATIENT',
};

export const ROUTES = {
  LOGIN: '/login',
  SIGNUP: '/signup',
  MFA: '/mfa',
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  PATIENT_DASHBOARD: '/patient/dashboard',
  PATIENT_TREATMENTS: '/patient/treatments',
  PATIENT_TREATMENT_DETAIL: '/patient/treatments/:id',
  PATIENT_UNSUITABLE_MEDICINES: '/patient/unsuitable-medicines',
  PATIENT_MEDICATIONS: '/patient/medications',
  PATIENT_EXPORT: '/patient/export',
  PATIENT_PROFILE: '/patient/profile',
  PATIENT_APPOINTMENTS: '/patient/appointments',
  PATIENT_BOOK_APPOINTMENT: '/patient/book-appointment',
  PATIENT_CHAT: '/patient/chat',
  DOCTOR_DASHBOARD: '/doctor/dashboard',
  DOCTOR_PATIENTS: '/doctor/patients',
  DOCTOR_PATIENT_DETAIL: '/doctor/patients/:id',
  DOCTOR_CREATE_TREATMENT: '/doctor/treatments/create',
  DOCTOR_EDIT_TREATMENT: '/doctor/treatments/edit/:treatmentId',
  DOCTOR_PROFILE: '/doctor/profile',
  DOCTOR_SLOTS: '/doctor/slots',
  DOCTOR_CHAT: '/doctor/chat',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_AUDIT_LOGS: '/admin/audit-logs',
  ADMIN_USERS: '/admin/users',
  ADMIN_DOCTORS: '/admin/doctors',
  ADMIN_PATIENTS: '/admin/patients',
  ADMIN_SECURITY: '/admin/security',
  ADMIN_MEDICINES: '/admin/medicines',
  ADMIN_EXPORT: '/admin/export',
};

export const TREATMENT_OUTCOMES = [
  { value: 'ONGOING', label: 'Ongoing' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'REFERRED', label: 'Referred' },
  { value: 'FOLLOW_UP', label: 'Follow Up' },
];

export const MEDICATION_ROUTES = [
  { value: 'ORAL', label: 'Oral' },
  { value: 'IV', label: 'Intravenous (IV)' },
  { value: 'IM', label: 'Intramuscular (IM)' },
  { value: 'TOPICAL', label: 'Topical' },
  { value: 'INHALATION', label: 'Inhalation' },
  { value: 'SUBLINGUAL', label: 'Sublingual' },
  { value: 'RECTAL', label: 'Rectal' },
  { value: 'OTHER', label: 'Other' },
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
  { value: 'LOGIN', label: 'Login' },
  { value: 'LOGOUT', label: 'Logout' },
  { value: 'CREATE', label: 'Create' },
  { value: 'READ', label: 'Read' },
  { value: 'UPDATE', label: 'Update' },
  { value: 'DELETE', label: 'Delete' },
  { value: 'EXPORT', label: 'Export' },
];
