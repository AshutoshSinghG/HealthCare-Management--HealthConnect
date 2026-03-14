import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

const barData = [
  { month: 'Jan', patients: 45 },
  { month: 'Feb', patients: 52 },
  { month: 'Mar', patients: 48 },
  { month: 'Apr', patients: 61 },
  { month: 'May', patients: 55 },
  { month: 'Jun', patients: 67 },
  { month: 'Jul', patients: 72 },
  { month: 'Aug', patients: 63 },
  { month: 'Sep', patients: 80 },
  { month: 'Oct', patients: 74 },
  { month: 'Nov', patients: 85 },
  { month: 'Dec', patients: 78 },
];

const pieData = [
  { name: 'Recovered', value: 45, color: '#10B981' },
  { name: 'Improved', value: 30, color: '#3B82F6' },
  { name: 'Stable', value: 15, color: '#F59E0B' },
  { name: 'Under Care', value: 10, color: '#8B5CF6' },
];

const CustomBarTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-surface-100">
        <p className="text-xs text-surface-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-surface-900">{payload[0].value} patients</p>
      </div>
    );
  }
  return null;
};

const PatientsBarChart = ({ data = barData, title = 'Patients Over Time' }) => (
  <div className="bg-white rounded-2xl border border-surface-200/60 shadow-card p-6">
    <h3 className="section-title mb-6">{title}</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
          <Tooltip content={<CustomBarTooltip />} />
          <Bar dataKey="patients" fill="#2563EB" radius={[6, 6, 0, 0]} barSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

const OutcomePieChart = ({ data = pieData, title = 'Treatment Outcomes' }) => (
  <div className="bg-white rounded-2xl border border-surface-200/60 shadow-card p-6">
    <h3 className="section-title mb-6">{title}</h3>
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={4} strokeWidth={0}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value, name) => [`${value}%`, name]}
            contentStyle={{ borderRadius: '12px', border: '1px solid #E2E8F0', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
          />
          <Legend iconType="circle" iconSize={8} formatter={(value) => <span className="text-sm text-surface-600 ml-1">{value}</span>} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export { PatientsBarChart, OutcomePieChart };
export default PatientsBarChart;
