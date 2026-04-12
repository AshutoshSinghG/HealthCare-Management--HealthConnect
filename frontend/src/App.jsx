import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Layout
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Pages
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import MfaPage from './pages/auth/MfaPage';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import ResetPasswordPage from './pages/auth/ResetPasswordPage';

// Patient Pages
import PatientDashboard from './pages/patient/Dashboard';
import PatientTreatments from './pages/patient/Treatments';
import PatientTreatmentDetail from './pages/patient/TreatmentDetail';
import PatientMedications from './pages/patient/Medications';
import PatientUnsuitableMedicines from './pages/patient/UnsuitableMedicines';
import PatientExportRecords from './pages/patient/ExportRecords';
import PatientProfileEdit from './pages/patient/ProfileEdit';
import PatientMyAppointments from './pages/patient/Appointments';
import PatientBookAppointment from './pages/patient/BookAppointment';
import PatientChat from './pages/patient/Chat';

// Doctor Pages
import DoctorDashboard from './pages/doctor/Dashboard';
import DoctorPatients from './pages/doctor/Patients';
import DoctorPatientDetail from './pages/doctor/PatientDetail';
import DoctorCreateTreatment from './pages/doctor/CreateTreatment';
import DoctorEditTreatment from './pages/doctor/EditTreatment';
import DoctorProfileEdit from './pages/doctor/ProfileEdit';
import DoctorSlots from './pages/doctor/Slots';
import DoctorChat from './pages/doctor/Chat';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminAuditLogs from './pages/admin/AuditLogs';
import AdminUsers from './pages/admin/Users';
import AdminDoctors from './pages/admin/Doctors';
import AdminPatients from './pages/admin/Patients';
import AdminSecurity from './pages/admin/Security';
import AdminMedicines from './pages/admin/Medicines';
import AdminExport from './pages/admin/ExportRecords';

// Route Guards
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';

import { ROLES } from './utils/constants';

function App() {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#1E293B',
            borderRadius: '12px',
            border: '1px solid #E2E8F0',
            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.06)',
            fontSize: '14px',
            padding: '12px 16px',
          },
          success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
          error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
        }}
      />

      <Routes>
        {/* Public Auth Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/mfa" element={<MfaPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />

        {/* Patient Portal */}
        <Route
          element={
            <ProtectedRoute>
              <RoleRoute roles={[ROLES.PATIENT]}>
                <DashboardLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/patient/dashboard" element={<PatientDashboard />} />
          <Route path="/patient/treatments" element={<PatientTreatments />} />
          <Route path="/patient/treatments/:id" element={<PatientTreatmentDetail />} />
          <Route path="/patient/medications" element={<PatientMedications />} />
          <Route path="/patient/unsuitable-medicines" element={<PatientUnsuitableMedicines />} />
          <Route path="/patient/export" element={<PatientExportRecords />} />
          <Route path="/patient/profile" element={<PatientProfileEdit />} />
          <Route path="/patient/appointments" element={<PatientMyAppointments />} />
          <Route path="/patient/book-appointment" element={<PatientBookAppointment />} />
          <Route path="/patient/chat" element={<PatientChat />} />
        </Route>

        {/* Doctor Portal */}
        <Route
          element={
            <ProtectedRoute>
              <RoleRoute roles={[ROLES.DOCTOR]}>
                <DashboardLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/doctor/dashboard" element={<DoctorDashboard />} />
          <Route path="/doctor/patients" element={<DoctorPatients />} />
          <Route path="/doctor/patients/:id" element={<DoctorPatientDetail />} />
          <Route path="/doctor/treatments/create" element={<DoctorCreateTreatment />} />
          <Route path="/doctor/treatments/edit/:treatmentId" element={<DoctorEditTreatment />} />
          <Route path="/doctor/profile" element={<DoctorProfileEdit />} />
          <Route path="/doctor/slots" element={<DoctorSlots />} />
          <Route path="/doctor/chat" element={<DoctorChat />} />
        </Route>

        {/* Admin Portal */}
        <Route
          element={
            <ProtectedRoute>
              <RoleRoute roles={[ROLES.ADMIN]}>
                <DashboardLayout />
              </RoleRoute>
            </ProtectedRoute>
          }
        >
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/doctors" element={<AdminDoctors />} />
          <Route path="/admin/patients" element={<AdminPatients />} />
          <Route path="/admin/audit-logs" element={<AdminAuditLogs />} />
          <Route path="/admin/security" element={<AdminSecurity />} />
          <Route path="/admin/medicines" element={<AdminMedicines />} />
          <Route path="/admin/export" element={<AdminExport />} />
        </Route>

        {/* Default Redirect */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

export default App;
