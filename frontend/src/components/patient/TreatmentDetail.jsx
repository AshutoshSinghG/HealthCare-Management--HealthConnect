import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Stethoscope, FileText, Pill, ClipboardList, Loader2, AlertTriangle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatDate';
import { useTreatmentDetail } from '../../hooks/usePatients';

const outcomeColors = { improved: 'success', recovered: 'success', stable: 'warning', worsened: 'danger', referred: 'info', ONGOING: 'info', RESOLVED: 'success', REFERRED: 'warning', FOLLOW_UP: 'warning' };

const TreatmentDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useTreatmentDetail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading treatment details...</p>
        </div>
      </div>
    );
  }

  if (isError || !data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-warning-500 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-surface-800">Treatment not found</h3>
          <p className="text-surface-500 text-sm mt-1">This treatment record may not exist or you don't have access.</p>
          <Link to="/patient/treatments" className="mt-4 inline-block">
            <Button variant="outline" size="sm" icon={ArrowLeft}>Back to Treatments</Button>
          </Link>
        </div>
      </div>
    );
  }

  const treatment = data.treatment;
  const medications = data.medications || [];
  const doctorName = treatment.doctorId ? `Dr. ${treatment.doctorId.firstName} ${treatment.doctorId.lastName}` : 'Unknown Doctor';
  const doctorSpec = treatment.doctorId?.specialisation || 'General Medicine';

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/patient/treatments">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back</Button>
        </Link>
        <div>
          <h1 className="page-title">Treatment Details</h1>
          <p className="text-sm text-surface-500">Visit on {formatDate(treatment.visitDate)}</p>
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
                <p className="text-sm text-surface-700">{treatment.chiefComplaint}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Diagnosis</p>
                <p className="text-sm text-surface-700 font-medium">{treatment.diagnosis}</p>
              </div>
              {treatment.icdCode && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">ICD Code</p>
                  <Badge variant="info" size="sm">{treatment.icdCode}</Badge>
                </div>
              )}
              <div className="space-y-1">
                <p className="text-xs font-medium text-surface-400 uppercase tracking-wider">Outcome</p>
                <Badge variant={outcomeColors[treatment.outcomeStatus] || 'default'} size="sm" dot>{treatment.outcomeStatus}</Badge>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-surface-100 space-y-3">
              {treatment.treatmentPlan && (
                <div>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Treatment Plan</p>
                  <p className="text-sm text-surface-700">{treatment.treatmentPlan}</p>
                </div>
              )}
              {treatment.followUpInstructions && (
                <div>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Instructions</p>
                  <p className="text-sm text-surface-700">{treatment.followUpInstructions}</p>
                </div>
              )}
              {treatment.notes && (
                <div>
                  <p className="text-xs font-medium text-surface-400 uppercase tracking-wider mb-1">Notes</p>
                  <p className="text-sm text-surface-600 italic">{treatment.notes}</p>
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
              {medications.length === 0 ? (
                <p className="text-sm text-surface-400 text-center py-4">No medications prescribed for this visit</p>
              ) : (
                medications.map((med, i) => (
                  <motion.div
                    key={med._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="p-4 rounded-xl border border-surface-100 bg-surface-50/50 hover:bg-surface-50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-sm text-surface-800">{med.medicineName}</p>
                        <p className="text-xs text-surface-500">{med.routeOfAdmin}</p>
                      </div>
                      <Badge variant="info" size="sm">{med.dosage}</Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-surface-600">
                      <p><span className="text-surface-400">Frequency:</span> {med.frequency}</p>
                      <p><span className="text-surface-400">Duration:</span> {med.durationDays} days</p>
                    </div>
                    {med.notes && <p className="text-xs text-surface-500 mt-2 italic">{med.notes}</p>}
                  </motion.div>
                ))
              )}
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
                <p className="font-semibold text-surface-800">{doctorName}</p>
                <p className="text-xs text-surface-500">{doctorSpec}</p>
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
                <span className="text-sm font-medium text-surface-700">{formatDate(treatment.visitDate)}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-surface-500">Follow Up</span>
                <span className="text-sm font-medium text-surface-700">
                  {treatment.followUpDate ? formatDate(treatment.followUpDate) : '—'}
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TreatmentDetail;
