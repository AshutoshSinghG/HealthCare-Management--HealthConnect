import { Bell, Search, Menu } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

const Navbar = ({ onMenuClick }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-xl border-b border-surface-200/60 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl text-surface-500 hover:bg-surface-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
          <input
            type="text"
            placeholder="Search patients, records..."
            className="pl-10 pr-4 py-2 bg-surface-50 border border-surface-200 rounded-xl text-sm text-surface-700 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64 transition-all"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button className="relative p-2 rounded-xl text-surface-500 hover:bg-surface-100 transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger-500 rounded-full" />
        </button>
        <div className="h-8 w-px bg-surface-200" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-surface-800">{user?.name}</p>
            <p className="text-xs text-surface-500 capitalize">{user?.role}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center text-white font-semibold text-sm">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
