import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, Save, ArrowLeft, AlertTriangle, Loader2 } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MedicationForm from './MedicationForm';
import { TREATMENT_OUTCOMES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '../../utils/errorUtils';
import { useTreatmentForEdit, useUpdateTreatment } from '../../hooks/useDoctors';
import { useEffect } from 'react';

const treatmentSchema = z.object({
  visitDate: z.string().min(1, 'Visit date is required'),
  chiefComplaint: z.string().min(1, 'Chief complaint is required'),
  diagnosis: z.string().min(1, 'Diagnosis is required'),
  icdCode: z.string().optional(),
  treatmentPlan: z.string().min(1, 'Treatment plan is required'),
  followUpDate: z.string().optional(),
  instructions: z.string().optional(),
  outcome: z.string().min(1, 'Outcome status is required'),
  notes: z.string().optional(),
  medications: z.array(z.object({
    name: z.string().min(1, 'Medicine name is required'),
    dosage: z.string().min(1, 'Dosage is required'),
    frequency: z.string().optional(),
    duration: z.string().optional(),
    route: z.string().optional(),
    notes: z.string().optional(),
  })).optional(),
});

const EditTreatmentForm = () => {
  const { treatmentId } = useParams();
  const navigate = useNavigate();
  const { data: treatment, isLoading, isError } = useTreatmentForEdit(treatmentId);
  const updateMutation = useUpdateTreatment();

  const { register, handleSubmit, control, reset, formState: { errors, isSubmitting, isDirty } } = useForm({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      visitDate: '', chiefComplaint: '', diagnosis: '', icdCode: '',
      treatmentPlan: '', followUpDate: '', instructions: '', outcome: '', notes: '', medications: [],
    },
  });

  useEffect(() => {
    if (treatment) {
      reset({
        visitDate: treatment.visitDate ? new Date(treatment.visitDate).toISOString().split('T')[0] : '',
        chiefComplaint: treatment.chiefComplaint || '',
        diagnosis: treatment.diagnosis || '',
        icdCode: treatment.icdCode || '',
        treatmentPlan: treatment.treatmentPlan || '',
        followUpDate: treatment.followUpDate ? new Date(treatment.followUpDate).toISOString().split('T')[0] : '',
        instructions: treatment.instructions || '',
        outcome: treatment.outcomeStatus || treatment.outcome || '',
        notes: treatment.notes || '',
        medications: treatment.medications || [],
      });
    }
  }, [treatment, reset]);

  const { fields, append, remove } = useFieldArray({ control, name: 'medications' });

  const onSubmit = async (data) => {
    try {
      await updateMutation.mutateAsync({ id: treatmentId, data });
      toast.success('Treatment record updated successfully!');
      navigate(-1);
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to update treatment. Please check your input.'));
    }
  };

  if (isLoading) return <div className="flex items-center justify-center min-h-[40vh]"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (isError) return <div className="text-center py-20 text-surface-500">Failed to load treatment data.</div>;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" icon={ArrowLeft} onClick={() => navigate(-1)}>Back</Button>
          <div>
            <h1 className="page-title">Edit Treatment</h1>
            <p className="text-sm text-surface-500">Treatment ID: {treatmentId} — Only your own records can be edited</p>
          </div>
        </div>
        <Badge variant="warning" size="sm">Edit Mode</Badge>
      </div>

      <div className="bg-primary-50 border border-primary-100 rounded-2xl p-3 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-primary-500 mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-sm font-medium text-primary-800">Editing Allowed Fields</p>
          <p className="text-xs text-primary-700 mt-0.5">You can edit: Diagnosis, Treatment Plan, Follow-up, Medications, Outcome, and Notes. Visit date and chief complaint are read-only after creation.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Visit Information */}
        <Card>
          <h3 className="section-title mb-4">Visit Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input label="Visit Date" type="date" error={errors.visitDate?.message} {...register('visitDate')} />
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Outcome Status</label>
              <select {...register('outcome')} className="input-base">
                <option value="">Select outcome...</option>
                {TREATMENT_OUTCOMES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              {errors.outcome && <p className="text-xs text-danger-500">{errors.outcome.message}</p>}
            </div>
          </div>
        </Card>

        {/* Clinical Details */}
        <Card>
          <h3 className="section-title mb-4">Clinical Details</h3>
          <div className="space-y-4">
            <Input label="Chief Complaint" placeholder="Primary reason for visit" error={errors.chiefComplaint?.message} {...register('chiefComplaint')} />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Diagnosis" placeholder="Primary diagnosis" error={errors.diagnosis?.message} {...register('diagnosis')} />
              <Input label="ICD Code" placeholder="e.g., J06.9" {...register('icdCode')} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Treatment Plan</label>
              <textarea {...register('treatmentPlan')} rows={3} className="input-base resize-none" placeholder="Describe the treatment plan..." />
              {errors.treatmentPlan && <p className="text-xs text-danger-500">{errors.treatmentPlan.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input label="Follow Up Date" type="date" {...register('followUpDate')} />
              <Input label="Instructions" placeholder="Patient instructions" {...register('instructions')} />
            </div>
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-surface-700">Clinical Notes</label>
              <textarea {...register('notes')} rows={2} className="input-base resize-none" placeholder="Any additional notes..." />
            </div>
          </div>
        </Card>

        {/* Medications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Medications</h3>
            <Button type="button" variant="outline" size="sm" icon={Plus}
              onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', route: '', notes: '' })}
            >Add Medication</Button>
          </div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <motion.div key={field.id} initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
                <MedicationForm index={index} register={register} remove={remove} errors={errors} />
              </motion.div>
            ))}
            {fields.length === 0 && (
              <div className="text-center py-8 text-surface-400">
                <p className="text-sm">No medications</p>
                <Button type="button" variant="ghost" size="sm" icon={Plus} className="mt-2"
                  onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', route: '', notes: '' })}
                >Add Medication</Button>
              </div>
            )}
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" loading={isSubmitting || updateMutation.isPending} icon={Save} size="lg" disabled={!isDirty}>
            Update Treatment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default EditTreatmentForm;
