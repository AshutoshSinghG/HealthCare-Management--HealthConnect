import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Plus, Save, ArrowLeft } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Card from '../../components/ui/Card';
import MedicationForm from './MedicationForm';
import { TREATMENT_OUTCOMES } from '../../utils/constants';
import toast from 'react-hot-toast';
import { extractErrorMessage } from '../../utils/errorUtils';
import { useCreateTreatment, useDoctorPatients } from '../../hooks/useDoctors';
import { useState, useMemo } from 'react';

const treatmentSchema = z.object({
  patientId: z.string().min(1, 'Patient is required'),
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

const CreateTreatmentForm = () => {
  const navigate = useNavigate();
  const createMutation = useCreateTreatment();
  const { data: patientsData } = useDoctorPatients();
  const patients = useMemo(() => {
    if (!patientsData) return [];
    const list = patientsData.patients || patientsData;
    return Array.isArray(list) ? list : [];
  }, [patientsData]);

  const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(treatmentSchema),
    defaultValues: {
      patientId: '',
      visitDate: new Date().toISOString().split('T')[0],
      medications: [{ name: '', dosage: '', frequency: '', duration: '', route: '', notes: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'medications' });

  const onSubmit = async (data) => {
    try {
      const { patientId, ...treatmentData } = data;
      await createMutation.mutateAsync({ patientId, ...treatmentData });
      toast.success('Treatment created successfully!');
      navigate('/doctor/patients');
    } catch (err) {
      toast.error(extractErrorMessage(err, 'Failed to create treatment. Please check your input.'));
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-4">
        <Link to="/doctor/patients">
          <Button variant="ghost" size="sm" icon={ArrowLeft}>Back</Button>
        </Link>
        <div>
          <h1 className="page-title">Create Treatment</h1>
          <p className="text-sm text-surface-500">Record a new treatment visit</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Visit Information */}
        <Card>
          <h3 className="section-title mb-4">Visit Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5 sm:col-span-2">
              <label className="block text-sm font-medium text-surface-700">Select Patient</label>
              <select {...register('patientId')} className="input-base">
                <option value="">Select patient...</option>
                {patients.map(p => (
                  <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
              {errors.patientId && <p className="text-xs text-danger-500">{errors.patientId.message}</p>}
            </div>
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
              <label className="block text-sm font-medium text-surface-700">Additional Notes</label>
              <textarea {...register('notes')} rows={2} className="input-base resize-none" placeholder="Any additional notes..." />
            </div>
          </div>
        </Card>

        {/* Medications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="section-title">Medications</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              icon={Plus}
              onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', route: '', notes: '' })}
            >
              Add Medication
            </Button>
          </div>

          <div className="space-y-4">
            {fields.map((field, index) => (
              <motion.div
                key={field.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <MedicationForm index={index} register={register} remove={remove} errors={errors} />
              </motion.div>
            ))}
            {fields.length === 0 && (
              <div className="text-center py-8 text-surface-400">
                <p className="text-sm">No medications added yet</p>
                <Button type="button" variant="ghost" size="sm" icon={Plus} className="mt-2" onClick={() => append({ name: '', dosage: '', frequency: '', duration: '', route: '', notes: '' })}>
                  Add First Medication
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Link to="/doctor/patients">
            <Button variant="ghost">Cancel</Button>
          </Link>
          <Button type="submit" loading={isSubmitting || createMutation.isPending} icon={Save} size="lg">
            Save Treatment
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CreateTreatmentForm;
