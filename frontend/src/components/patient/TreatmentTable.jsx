import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Search, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Filter, Calendar, X, Eye, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDate } from '../../utils/formatDate';
import { useMyTreatments } from '../../hooks/usePatients';

const outcomeColors = { improved: 'success', recovered: 'success', stable: 'warning', worsened: 'danger', referred: 'info', ONGOING: 'info', RESOLVED: 'success', REFERRED: 'warning', FOLLOW_UP: 'warning' };

const TreatmentTable = () => {
  const { data: treatmentData, isLoading } = useMyTreatments({ limit: 100 });

  const treatments = useMemo(() => {
    if (!treatmentData?.treatments) return [];
    return treatmentData.treatments.map(t => ({
      id: t._id,
      visitDate: t.visitDate,
      doctor: t.doctorId ? `Dr. ${t.doctorId.firstName} ${t.doctorId.lastName}` : 'N/A',
      diagnosis: t.diagnosis,
      outcome: t.outcomeStatus || 'ONGOING',
      followUp: t.followUpDate || null,
    }));
  }, [treatmentData]);

  const [sorting, setSorting] = useState([{ id: 'visitDate', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [doctorFilter, setDoctorFilter] = useState('');
  const [diagnosisFilter, setDiagnosisFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const uniqueDoctors = useMemo(() => [...new Set(treatments.map(t => t.doctor))], [treatments]);
  const uniqueDiagnoses = useMemo(() => [...new Set(treatments.map(t => t.diagnosis))], [treatments]);

  const activeFilterCount = [doctorFilter, diagnosisFilter, dateFrom, dateTo].filter(Boolean).length;

  const filteredData = useMemo(() => {
    return treatments.filter(t => {
      if (doctorFilter && t.doctor !== doctorFilter) return false;
      if (diagnosisFilter && t.diagnosis !== diagnosisFilter) return false;
      if (dateFrom && new Date(t.visitDate) < new Date(dateFrom)) return false;
      if (dateTo && new Date(t.visitDate) > new Date(dateTo)) return false;
      return true;
    });
  }, [treatments, doctorFilter, diagnosisFilter, dateFrom, dateTo]);

  const clearFilters = () => {
    setDoctorFilter('');
    setDiagnosisFilter('');
    setDateFrom('');
    setDateTo('');
  };

  const columns = useMemo(() => [
    {
      accessorKey: 'visitDate',
      header: 'Visit Date',
      cell: info => <span className="font-medium">{formatDate(info.getValue())}</span>,
    },
    {
      accessorKey: 'doctor',
      header: 'Doctor',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary-100 flex items-center justify-center text-xs font-semibold text-primary-600">
            {info.getValue().split(' ').pop().charAt(0)}
          </div>
          <span>{info.getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'diagnosis',
      header: 'Diagnosis',
    },
    {
      accessorKey: 'outcome',
      header: 'Outcome',
      cell: info => <Badge variant={outcomeColors[info.getValue()] || 'default'} size="sm" dot>{info.getValue()}</Badge>,
    },
    {
      accessorKey: 'followUp',
      header: 'Follow Up',
      cell: info => info.getValue() ? (
        <span className="flex items-center gap-1.5 text-sm">
          <Calendar className="w-3.5 h-3.5 text-surface-400" />
          {formatDate(info.getValue())}
        </span>
      ) : <span className="text-surface-400">—</span>,
    },
    {
      id: 'actions',
      header: '',
      cell: info => (
        <Link to={`/patient/treatments/${info.row.original.id}`}>
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
    initialState: { pagination: { pageSize: 5 } },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
          <p className="text-surface-500 text-sm">Loading treatments...</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-surface-200/60 shadow-card overflow-hidden">
      {/* Toolbar */}
      <div className="p-4 border-b border-surface-100">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
            <input
              value={globalFilter ?? ''}
              onChange={e => setGlobalFilter(e.target.value)}
              placeholder="Search by diagnosis, doctor, keywords..."
              className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={showFilters ? 'primary' : 'outline'}
              size="sm"
              icon={Filter}
              onClick={() => setShowFilters(!showFilters)}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1.5 w-5 h-5 rounded-full bg-white/20 text-xs flex items-center justify-center font-bold">
                  {activeFilterCount}
                </span>
              )}
            </Button>
            {activeFilterCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" /> Clear
              </Button>
            )}
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-4 pt-4 border-t border-surface-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Date From</label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={e => setDateFrom(e.target.value)}
                    className="input-base text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Date To</label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={e => setDateTo(e.target.value)}
                    className="input-base text-sm"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Doctor</label>
                  <select
                    value={doctorFilter}
                    onChange={e => setDoctorFilter(e.target.value)}
                    className="input-base text-sm"
                  >
                    <option value="">All Doctors</option>
                    {uniqueDoctors.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-surface-500 uppercase tracking-wider">Diagnosis</label>
                  <select
                    value={diagnosisFilter}
                    onChange={e => setDiagnosisFilter(e.target.value)}
                    className="input-base text-sm"
                  >
                    <option value="">All Diagnoses</option>
                    {uniqueDiagnoses.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50/80">
            {table.getHeaderGroups().map(headerGroup => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map(header => (
                  <th
                    key={header.id}
                    className="table-header cursor-pointer select-none hover:text-surface-700"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center gap-1.5">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getIsSorted() === 'asc' ? <ChevronUp className="w-3.5 h-3.5" /> :
                       header.column.getIsSorted() === 'desc' ? <ChevronDown className="w-3.5 h-3.5" /> : null}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-12 text-surface-400">
                  <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-medium">No treatments found</p>
                  <p className="text-xs mt-1">Try adjusting your filters or search query</p>
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map(row => (
                <tr key={row.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                  {row.getVisibleCells().map(cell => (
                    <td key={cell.id} className="table-cell">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="px-4 py-3 border-t border-surface-100 flex items-center justify-between">
        <p className="text-sm text-surface-500">
          Showing {table.getFilteredRowModel().rows.length === 0 ? 0 : table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1} to{' '}
          {Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, table.getFilteredRowModel().rows.length)} of{' '}
          {table.getFilteredRowModel().rows.length} results
        </p>
        <div className="flex items-center gap-1">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40">
            <ChevronsLeft className="w-4 h-4" />
          </button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 text-sm font-medium text-surface-700">
            {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40">
            <ChevronRight className="w-4 h-4" />
          </button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40">
            <ChevronsRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TreatmentTable;
