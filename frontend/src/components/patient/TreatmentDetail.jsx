import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Stethoscope, FileText, Pill, ClipboardList } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatDate';

const mockTreatment = {
  id: '1',
  visitDate: '2026-03-05',
  doctor: 'Dr. Michael Chen',
  chiefComplaint: 'Persistent cough and mild fever for 3 days',
  diagnosis: 'Upper Respiratory Infection',
  icdCode: 'J06.9',
  treatmentPlan: 'Rest, hydration, and prescribed antibiotics. Monitor symptoms for 5 days.',
  followUpDate: '2026-03-19',
  instructions: 'Take medications as prescribed. Drink plenty of fluids. Rest for at least 3 days. Return if fever exceeds 102°F.',
  outcome: 'improved',
  notes: 'Patient responded well to initial treatment. Follow-up recommended.',
  medications: [
    { name: 'Amoxicillin', dosage: '500mg', frequency: 'Three Times Daily (TDS)', duration: '7 days', route: 'Oral', notes: 'Take after meals' },
    { name: 'Paracetamol', dosage: '650mg', frequency: 'As Needed (PRN)', duration: '5 days', route: 'Oral', notes: 'For fever above 100°F' },
    { name: 'Benadryl Cough Syrup', dosage: '10ml', frequency: 'Twice Daily (BD)', duration: '5 days', route: 'Oral', notes: 'Before bedtime' },
  ],
};

const TreatmentDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/patient/treatments">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back</Button>
        </Link>
        <div>
          <h1 className="page-title">Treatment Details</h1>
          <p className="text-sm text-surface-500">Visit on {formatDate(mockTreatment.visitDate)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary-500" />
              Clinical Information
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Chief Complaint</p>
                <p className="text-sm text-surface-700">{mockTreatment.chiefComplaint}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Diagnosis</p>
                <p className="text-sm text-surface-700 font-medium">{mockTreatment.diagnosis}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">ICD Code</p>
                <Badge variant="info" size="sm">{mockTreatment.icdCode}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Outcome</p>
                <Badge variant="success" size="sm" dot>{mockTreatment.outcome}</Badge>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-surface-100 space-y-3">
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Treatment Plan</p>
                <p className="text-sm text-surface-700">{mockTreatment.treatmentPlan}</p>
              </div>
              <div>
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Instructions</p>
                <p className="text-sm text-surface-700">{mockTreatment.instructions}</p>
              </div>
              {mockTreatment.notes && (
                <div>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-surface-600 italic">{mockTreatment.notes}</p>
                </div>
              )}
            </div>
          </Card>

          {/* Medications */}
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Pill className="w-5 h-5 text-success-500" />
              Prescribed Medications
            </h3>
            <div className="space-y-3">
              {mockTreatment.medications.map((med, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="p-4 rounded-xl border border-surface-100 bg-surface-50/50 hover:bg-surface-50 transition-colors"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="font-semibold text-sm text-surface-800">{med.name}</p>
                      <p className="text-xs text-surface-500">{med.route}</p>
                    </div>
                    <Badge variant="info" size="sm">{med.dosage}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-surface-600">
                    <p><span className="text-surface-400">Frequency:</span> {med.frequency}</p>
                    <p><span className="text-surface-400">Duration:</span> {med.duration}</p>
                  </div>
                  {med.notes && <p className="text-xs text-surface-500 mt-2 italic">{med.notes}</p>}
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary-500" />
              Doctor
            </h3>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center">
                <User className="w-6 h-6 text-primary-600" />
              </div>
              <div>
                <p className="font-semibold text-surface-800">{mockTreatment.doctor}</p>
                <p className="text-xs text-surface-500">General Medicine</p>
              </div>
            </div>
          </Card>

          <Card>
            <h3 className="section-title mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary-500" />
              Dates
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-surface-50">
                <span className="text-sm text-surface-500">Visit Date</span>
                <span className="text-sm font-medium text-surface-700">{formatDate(mockTreatment.visitDate)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-surface-500">Follow Up</span>
                <span className="text-sm font-medium text-surface-700">{formatDate(mockTreatment.followUpDate)}</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDetail;
