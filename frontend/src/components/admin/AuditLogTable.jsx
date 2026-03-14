import { useState, useMemo } from 'react';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Search, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Filter, Download } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDateTime } from '../../utils/formatDate';

const mockLogs = [
  { id: 1, timestamp: '2026-03-05T14:32:00Z', user: 'Dr. Michael Chen', role: 'doctor', action: 'create', entity: 'Treatment #1247', ipAddress: '192.168.1.100' },
  { id: 2, timestamp: '2026-03-05T14:28:00Z', user: 'Sarah Johnson', role: 'patient', action: 'view', entity: 'Treatment History', ipAddress: '10.0.0.45' },
  { id: 3, timestamp: '2026-03-05T14:15:00Z', user: 'Admin User', role: 'admin', action: 'export', entity: 'Audit Logs', ipAddress: '192.168.1.1' },
  { id: 4, timestamp: '2026-03-05T13:50:00Z', user: 'Dr. Priya Sharma', role: 'doctor', action: 'update', entity: 'Patient #892', ipAddress: '172.16.0.22' },
  { id: 5, timestamp: '2026-03-05T13:45:00Z', user: 'Robert Williams', role: 'patient', action: 'login', entity: 'System', ipAddress: '10.0.0.78' },
  { id: 6, timestamp: '2026-03-05T13:30:00Z', user: 'Dr. Michael Chen', role: 'doctor', action: 'create', entity: 'Prescription #456', ipAddress: '192.168.1.100' },
  { id: 7, timestamp: '2026-03-05T13:20:00Z', user: 'Dr. Sarah Wilson', role: 'doctor', action: 'view', entity: 'Patient #1102', ipAddress: '192.168.1.105' },
  { id: 8, timestamp: '2026-03-05T12:55:00Z', user: 'Admin User', role: 'admin', action: 'update', entity: 'System Config', ipAddress: '192.168.1.1' },
  { id: 9, timestamp: '2026-03-05T12:40:00Z', user: 'Emily Davis', role: 'patient', action: 'view', entity: 'Unsuitable Medicines', ipAddress: '10.0.0.92' },
  { id: 10, timestamp: '2026-03-05T12:30:00Z', user: 'Dr. James Park', role: 'doctor', action: 'delete', entity: 'Draft Treatment', ipAddress: '172.16.0.35' },
  { id: 11, timestamp: '2026-03-05T12:15:00Z', user: 'Lisa Anderson', role: 'patient', action: 'login', entity: 'System', ipAddress: '10.0.0.110' },
  { id: 12, timestamp: '2026-03-05T11:50:00Z', user: 'Admin User', role: 'admin', action: 'create', entity: 'User Account', ipAddress: '192.168.1.1' },
];

const actionColors = { login: 'info', logout: 'default', create: 'success', update: 'warning', delete: 'danger', view: 'default', export: 'info' };
const roleColors = { doctor: 'info', patient: 'success', admin: 'warning' };

const AuditLogTable = () => {
  const [sorting, setSorting] = useState([{ id: 'timestamp', desc: true }]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [actionFilter, setActionFilter] = useState('');

  const filteredData = useMemo(() => {
    if (!actionFilter) return mockLogs;
    return mockLogs.filter(l => l.action === actionFilter);
  }, [actionFilter]);

  const columns = useMemo(() => [
    {
      accessorKey: 'timestamp',
      header: 'Timestamp',
      cell: info => <span className="font-mono text-xs">{formatDateTime(info.getValue())}</span>,
    },
    {
      accessorKey: 'user',
      header: 'User',
      cell: info => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center text-xs font-semibold text-surface-600">
            {info.getValue().charAt(0)}
          </div>
          <span className="font-medium">{info.getValue()}</span>
        </div>
      ),
    },
    {
      accessorKey: 'role',
      header: 'Role',
      cell: info => <Badge variant={roleColors[info.getValue()]} size="sm">{info.getValue()}</Badge>,
    },
    {
      accessorKey: 'action',
      header: 'Action',
      cell: info => <Badge variant={actionColors[info.getValue()]} size="sm" dot>{info.getValue()}</Badge>,
    },
    {
      accessorKey: 'entity',
      header: 'Entity',
      cell: info => <span className="text-surface-600">{info.getValue()}</span>,
    },
    {
      accessorKey: 'ipAddress',
      header: 'IP Address',
      cell: info => <span className="font-mono text-xs text-surface-500">{info.getValue()}</span>,
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
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-surface-200/60 shadow-card overflow-hidden">
      <div className="p-4 border-b border-surface-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            value={globalFilter ?? ''}
            onChange={e => setGlobalFilter(e.target.value)}
            placeholder="Search logs..."
            className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <select
            value={actionFilter}
            onChange={e => setActionFilter(e.target.value)}
            className="px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Actions</option>
            <option value="login">Login</option>
            <option value="create">Create</option>
            <option value="update">Update</option>
            <option value="delete">Delete</option>
            <option value="view">View</option>
            <option value="export">Export</option>
          </select>
          <Button variant="outline" size="sm" icon={Download}>Export</Button>
        </div>
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
            {table.getRowModel().rows.map(row => (
              <tr key={row.id} className="border-b border-surface-50 hover:bg-surface-50/50 transition-colors">
                {row.getVisibleCells().map(cell => (
                  <td key={cell.id} className="table-cell">{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-3 border-t border-surface-100 flex items-center justify-between">
        <p className="text-sm text-surface-500">{filteredData.length} log entries</p>
        <div className="flex items-center gap-1">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronsLeft className="w-4 h-4" /></button>
          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
          <span className="px-3 py-1 text-sm font-medium text-surface-700">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronsRight className="w-4 h-4" /></button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditLogTable;
