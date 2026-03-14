import TreatmentTable from '../../components/patient/TreatmentTable';
const Treatments = () => (
  <div className="space-y-6">
    <div>
      <h1 className="page-title">My Treatments</h1>
      <p className="text-surface-500 mt-1">View all your treatment records and history</p>
    </div>
    <TreatmentTable />
  </div>
);
export default Treatments;
