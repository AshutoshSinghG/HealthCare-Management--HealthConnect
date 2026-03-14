import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const DashboardLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-surface-50 medical-bg">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-surface-900/30 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar - desktop */}
      <div className="hidden lg:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Sidebar - mobile */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-y-0 left-0 z-40">
          <Sidebar collapsed={false} setCollapsed={() => setMobileOpen(false)} />
        </div>
      )}

      {/* Main content */}
      <div
        className="transition-all duration-300 lg:ml-[260px]"
        style={{ marginLeft: typeof window !== 'undefined' && window.innerWidth >= 1024 ? (collapsed ? 72 : 260) : 0 }}
      >
        <Navbar onMenuClick={() => setMobileOpen(true)} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
