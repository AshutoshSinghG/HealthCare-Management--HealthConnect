import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useReactTable, getCoreRowModel, getSortedRowModel, getFilteredRowModel, getPaginationRowModel, flexRender } from '@tanstack/react-table';
import { Search, ChevronDown, ChevronUp, ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Download, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { formatDateTime } from '../../utils/formatDate';
import { getAuditLogs } from '../../api/adminApi';
import { AUDIT_ACTIONS } from '../../utils/constants';

const actionColors = { LOGIN: 'info', LOGOUT: 'default', CREATE: 'success', READ: 'default', UPDATE: 'warning', DELETE: 'danger', EXPORT: 'info' };
const roleColors = { DOCTOR: 'info', PATIENT: 'success', ADMIN: 'warning' };

const AuditLogTable = () => {
  const [page, setPage] = useState(1);
  const [actionFilter, setActionFilter] = useState('');
  const [globalFilter, setGlobalFilter] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['admin', 'audit-logs', { page, limit: 10, actionType: actionFilter || undefined }],
    queryFn: () => getAuditLogs({ page, limit: 10, actionType: actionFilter || undefined }),
    retry: 1,
    keepPreviousData: true,
  });

  const logs = data?.logs || [];
  const pagination = data?.pagination || { page: 1, pages: 1, total: 0 };

  const columns = useMemo(() => [
    {
      accessorKey: 'occurredAt',
      header: 'Timestamp',
      cell: info => <span className="font-mono text-xs">{formatDateTime(info.getValue())}</span>,
    },
    {
      accessorKey: 'actorUserId',
      header: 'User',
      cell: info => {
        const actor = info.getValue();
        return (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-surface-100 flex items-center justify-center text-xs font-semibold text-surface-600">
              {actor?.email?.charAt(0)?.toUpperCase() || '?'}
            </div>
            <span className="font-medium">{actor?.email || 'Unknown'}</span>
          </div>
        );
      },
    },
    {
      accessorKey: 'actorRole',
      header: 'Role',
      cell: info => <Badge variant={roleColors[info.getValue()] || 'default'} size="sm">{info.getValue()}</Badge>,
    },
    {
      accessorKey: 'actionType',
      header: 'Action',
      cell: info => <Badge variant={actionColors[info.getValue()] || 'default'} size="sm" dot>{info.getValue()}</Badge>,
    },
    {
      accessorKey: 'entityType',
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
    data: logs,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: pagination.pages,
  });

  if (isLoading && logs.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

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
            onChange={e => { setActionFilter(e.target.value); setPage(1); }}
            className="px-3 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">All Actions</option>
            {AUDIT_ACTIONS.map(a => (
              <option key={a.value} value={a.value}>{a.label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-surface-50/80">
            {table.getHeaderGroups().map(hg => (
              <tr key={hg.id}>
                {hg.headers.map(h => (
                  <th key={h.id} className="table-header">
                    {flexRender(h.column.columnDef.header, h.getContext())}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr><td colSpan={columns.length} className="table-cell text-center text-surface-400 py-8">No audit logs found</td></tr>
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
        <p className="text-sm text-surface-500">{pagination.total} log entries</p>
        <div className="flex items-center gap-1">
          <button onClick={() => setPage(1)} disabled={page <= 1} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronsLeft className="w-4 h-4" /></button>
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page <= 1} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronLeft className="w-4 h-4" /></button>
          <span className="px-3 py-1 text-sm font-medium text-surface-700">{page} / {pagination.pages || 1}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page >= pagination.pages} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronRight className="w-4 h-4" /></button>
          <button onClick={() => setPage(pagination.pages)} disabled={page >= pagination.pages} className="p-1.5 rounded-lg text-surface-400 hover:bg-surface-100 disabled:opacity-40"><ChevronsRight className="w-4 h-4" /></button>
        </div>
      </div>
    </motion.div>
  );
};

export default AuditLogTable;
