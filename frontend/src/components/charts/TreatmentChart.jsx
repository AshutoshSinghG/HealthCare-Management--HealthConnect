import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const sampleData = [
  { month: 'Jan', treatments: 4 },
  { month: 'Feb', treatments: 6 },
  { month: 'Mar', treatments: 3 },
  { month: 'Apr', treatments: 8 },
  { month: 'May', treatments: 5 },
  { month: 'Jun', treatments: 7 },
  { month: 'Jul', treatments: 9 },
  { month: 'Aug', treatments: 6 },
  { month: 'Sep', treatments: 11 },
  { month: 'Oct', treatments: 8 },
  { month: 'Nov', treatments: 10 },
  { month: 'Dec', treatments: 7 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-white px-4 py-3 rounded-xl shadow-lg border border-surface-100">
        <p className="text-xs text-surface-500 mb-1">{label}</p>
        <p className="text-sm font-semibold text-surface-900">{payload[0].value} treatments</p>
      </div>
    );
  }
  return null;
};

const TreatmentChart = ({ data = sampleData, title = 'Treatment History' }) => {
  return (
    <div className="bg-white rounded-2xl border border-surface-200/60 shadow-card p-6">
      <h3 className="section-title mb-6">{title}</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="treatmentGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563EB" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 12 }} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="treatments" stroke="#2563EB" strokeWidth={2.5} fill="url(#treatmentGradient)" dot={{ r: 0 }} activeDot={{ r: 5, fill: '#2563EB', stroke: '#fff', strokeWidth: 2 }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TreatmentChart;
