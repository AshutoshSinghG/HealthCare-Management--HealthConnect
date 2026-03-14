import AuditLogTable from '../../components/admin/AuditLogTable';
const AuditLogs = () => (
  <div className="space-y-6">
    <div>
      <h1 className="page-title">Audit Logs</h1>
      <p className="text-surface-500 mt-1">Track all system activity and user actions</p>
    </div>
    <AuditLogTable />
  </div>
);
export default AuditLogs;
