import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Search, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Eye, Filter, X, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatDate';
import { useDoctorPatients } from '../../hooks/useDoctors';
const statusColors = { active: 'info', 'follow-up': 'warning', stable: 'success', recovered: 'success', ONGOING: 'info', FOLLOW_UP: 'warning', RESOLVED: 'success', REFERRED: 'warning' };

const PatientList = () => {
  const [sorting, setSorting] = useState([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const [diagnosisFilter, setDiagnosisFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: patientsData, isLoading, isError } = useDoctorPatients();

  const patients = useMemo(() => {
    if (!patientsData) return [];
    const list = patientsData.patients || patientsData;
    return (Array.isArray(list) ? list : []).map(p => ({
      id: p._id,
      name: `${p.firstName} ${p.lastName}`,
      email: p.contactEmail || '',
      bloodGroup: p.bloodGroup || '',
      dob: p.dateOfBirth || '',
      phone: p.contactPhone || '',
      status: p.lastTreatment?.outcomeStatus?.toLowerCase() || 'active',
      lastVisit: p.lastTreatment?.visitDate || '',
      conditions: p.chronicConditions || [],
      diagnosis: p.lastTreatment?.diagnosis || '',
    }));
  }, [patientsData]);

  const uniqueStatuses = useMemo(() => [...new Set(patients.map(p => p.status))], [patients]);
  const uniqueDiagnoses = useMemo(() => [...new Set(patients.map(p => p.diagnosis).filter(Boolean))], [patients]);

  const activeFilterCount = [statusFilter, diagnosisFilter, dateFrom, dateTo].filter(Boolean).length;

  const filteredData = useMemo(() => {
    return patients.filter(p => {
      if (statusFilter && p.status !== statusFilter) return false;
      if (diagnosisFilter && p.diagnosis !== diagnosisFilter) return false;
      if (dateFrom && p.lastVisit < dateFrom) return false;
      if (dateTo && p.lastVisit > dateTo) return false;
      return true;
    });
  }, [patients, statusFilter, diagnosisFilter, dateFrom, dateTo]);

  const clearFilters = () => { setStatusFilter(''); setDiagnosisFilter(''); setDateFrom(''); setDateTo(''); };

  const columns = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'Patient ID',
      cell: info => <span className="font-mono text-xs text-surface-500">{String(info.getValue()).slice(-8)}</span>,
    },
    {
      accessorKey: 'name',
      header: 'Patient',
      cell: info => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-xs font-semibold">
            {info.getValue().split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <p className="font-medium text-surface-800">{info.getValue()}</p>
            <p className="text-xs text-surface-500">{info.row.original.email}</p>
          </div>
        </div>
      ),
    },
    {
      accessorKey: 'lastVisit',
      header: 'Last Visit',
      cell: info => <span className="text-sm">{info.getValue() ? formatDate(info.getValue()) : 'N/A'}</span>,
    },
    {
      accessorKey: 'diagnosis',
      header: 'Diagnosis',
      cell: info => <span className="text-sm text-surface-700">{info.getValue() || 'N/A'}</span>,
    },
    { accessorKey: 'status', header: 'Status', cell: info => <Badge variant={statusColors[info.getValue()] || 'default'} size="sm" dot>{info.getValue()}</Badge> },
    {
      id: 'actions',
      header: '',
      cell: info => (
        <Link to={`/doctor/patients/${info.row.original.id}`}>
          <Button variant="ghost" size="sm" icon={Eye}>View</Button>
        </Link>
      ),
    },
  ], []);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 6 } },
  });

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary-500" /></div>;
  if (isError) return <div className="text-center py-20 text-surface-500">Failed to load patients.</div>;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-surface-200/60 shadow-card overflow-hidden">
      <div className="p-4 border-b border-surface-100">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search by name, patient ID, DOB..."
              className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button variant={showFilters ? 'primary' : 'outline'} size="sm" icon={Filter} onClick={() => setShowFilters(!showFilters)}>
              Filters {activeFilterCount > 0 && <span className="ml-1 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-bold">{activeFilterCount}</span>}
            </Button>
            {activeFilterCount > 0 && <Button variant="ghost" size="sm" onClick={clearFilters}><X className="w-4 h-4 mr-1" /> Clear</Button>}
            <Link to="/doctor/treatments/create"><Button size="sm">+ New Treatment</Button></Link>
          </div>
        </div>

        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
              <div className="mt-4 pt-4 border-t border-surface-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Date From</label>
                  <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-base text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Date To</label>
                  <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-base text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Status</label>
                  <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-base text-sm">
                    <option value="">All Statuses</option>
                    {uniqueStatuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Diagnosis</label>
                  <select value={diagnosisFilter} onChange={e => setDiagnosisFilter(e.target.value)} className="input-base text-sm">
                    <option value="">All Diagnoses</option>
                    {uniqueDiagnoses.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50/80">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="table-header cursor-pointer select-none hover:text-surface-700" onClick={h.column.getToggleSortingHandler()}>
                    <div className="flex items-center gap-1.5">
                      {flexRender(h.column.columnDef.header, h.getContext())}
                      {h.column.getIsSorted() === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> : h.column.getIsSorted() === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-surface-400"><Search className="w-8 h-8 mx-auto mb-2 opacity-50" /><p className="text-sm font-medium">No patients found</p></td></tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="table-cell">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-surface-100 flex items-center justify-between">
        <p className="text-sm text-surface-500">{table.getFilteredRowModel().rows.length} patients</p>
        <div className="flex items-center gap-1">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronsLeft className="w-4 h-4" /></button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
          <span className="px-3 py-1 text-sm font-medium text-surface-700">{table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronsRight className="w-4 h-4" /></button>
        </div>
      </div>
    </motion.div>
  );
};

export default PatientList;
