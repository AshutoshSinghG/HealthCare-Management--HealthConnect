import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { Trash2 } from 'lucide-react';
import { MEDICATION_ROUTES, MEDICATION_FREQUENCIES } from '../../utils/constants';

const MedicationForm = ({ index, register, remove, errors }) => {
  const prefix = `medications.${index}`;

  return (
    <div className="p-4 rounded-xl border border-surface-200 bg-surface-50/30 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-surface-700">Medication #{index + 1}</p>
        <Button variant="ghost" size="sm" onClick={() => remove(index)} className="text-danger-500 hover:text-danger-600 hover:bg-danger-50">
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <Input
          label="Medicine Name"
          placeholder="e.g., Amoxicillin"
          error={errors?.medications?.[index]?.name?.message}
          {...register(`${prefix}.name`)}
        />
        <Input
          label="Dosage"
          placeholder="e.g., 500mg"
          error={errors?.medications?.[index]?.dosage?.message}
          {...register(`${prefix}.dosage`)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-surface-700">Frequency</label>
          <select {...register(`${prefix}.frequency`)} className="input-base">
            <option value="">Select...</option>
            {MEDICATION_FREQUENCIES.map(f => <option key={f.value} value={f.value}>{f.label}</option>)}
          </select>
        </div>
        <Input
          label="Duration"
          placeholder="e.g., 7 days"
          {...register(`${prefix}.duration`)}
        />
        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-surface-700">Route</label>
          <select {...register(`${prefix}.route`)} className="input-base">
            <option value="">Select...</option>
            {MEDICATION_ROUTES.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
          </select>
        </div>
      </div>

      <Input
        label="Notes"
        placeholder="Special instructions..."
        {...register(`${prefix}.notes`)}
      />
    </div>
  );
};

export default MedicationForm;
