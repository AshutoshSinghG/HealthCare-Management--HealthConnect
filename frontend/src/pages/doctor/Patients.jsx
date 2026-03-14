import PatientList from '../../components/doctor/PatientList';
const Patients = () => (
  <div className="space-y-6">
    <div>
      <h1 className="page-title">My Patients</h1>
      <p className="text-surface-500 mt-1">Manage your patient records</p>
    </div>
    <PatientList />
  </div>
);
export default Patients;
