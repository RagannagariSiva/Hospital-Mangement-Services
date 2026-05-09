import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  FiHome, FiCalendar, FiUsers, FiLogOut, FiMenu, FiX,
  FiBarChart2, FiUser, FiList, FiGrid, FiBell
} from 'react-icons/fi';

// ==================== NAVBAR ====================
export function Navbar() {
  const { user, logout } = useAuth();
  const navigate         = useNavigate();
  const [open, setOpen]  = useState(false);

  const handleLogout = () => { logout(); navigate('/login'); setOpen(false); };

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-blue-700 font-black text-xl">
          <span className="text-2xl">🏨</span> HotelPro
        </Link>

        <div className="hidden md:flex items-center gap-1">
          <Link to="/hotels" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors">Hotels</Link>
          <Link to="/search" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors">Search</Link>
          {user ? (
            <>
              <Link to="/bookings" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors">My Bookings</Link>
              {user.role === 'ADMIN' && <Link to="/admin" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors">Admin</Link>}
              {(user.role === 'STAFF' || user.role === 'ADMIN') && <Link to="/staff" className="px-4 py-2 text-sm text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl font-medium transition-colors">Staff</Link>}
              <div className="ml-2 flex items-center gap-2 border-l border-gray-200 pl-4">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </div>
                <span className="text-sm font-semibold text-gray-700">{user.firstName}</span>
                <button onClick={handleLogout} className="ml-1 text-gray-400 hover:text-red-500 transition-colors p-1 rounded-lg hover:bg-red-50" title="Logout">
                  <FiLogOut size={16} />
                </button>
              </div>
            </>
          ) : (
            <div className="flex gap-2 ml-2">
              <Link to="/login" className="px-4 py-2 text-sm text-gray-700 font-semibold border border-gray-200 rounded-xl hover:border-blue-400 hover:text-blue-600 transition-colors">Login</Link>
              <Link to="/register" className="px-4 py-2 text-sm text-white font-semibold bg-blue-600 rounded-xl hover:bg-blue-700 transition-colors">Sign Up</Link>
            </div>
          )}
        </div>

        <button className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors" onClick={() => setOpen(!open)}>
          {open ? <FiX size={22} /> : <FiMenu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-3 space-y-1 shadow-lg">
          <Link to="/hotels"  onClick={()=>setOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">🏨 Hotels</Link>
          <Link to="/search"  onClick={()=>setOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">🔍 Search</Link>
          {user ? (
            <>
              <Link to="/bookings" onClick={()=>setOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">📋 My Bookings</Link>
              {user.role === 'ADMIN' && <Link to="/admin" onClick={()=>setOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">⚙️ Admin</Link>}
              {(user.role === 'STAFF'||user.role==='ADMIN') && <Link to="/staff" onClick={()=>setOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">👤 Staff</Link>}
              <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-red-500 hover:bg-red-50 rounded-xl font-medium">🚪 Logout</button>
            </>
          ) : (
            <>
              <Link to="/login"    onClick={()=>setOpen(false)} className="block px-4 py-2.5 text-gray-700 hover:bg-gray-50 rounded-xl font-medium">Login</Link>
              <Link to="/register" onClick={()=>setOpen(false)} className="block px-4 py-2.5 text-blue-600 hover:bg-blue-50 rounded-xl font-semibold">Sign Up Free</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

// ==================== ADMIN SIDEBAR ====================
export function AdminSidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to:'/admin',          icon:FiBarChart2, label:'Dashboard' },
    { to:'/admin/hotels',   icon:FiHome,     label:'Hotels' },
    { to:'/admin/rooms',    icon:FiHome,       label:'Rooms' },
    { to:'/admin/bookings', icon:FiCalendar,   label:'Bookings' },
    { to:'/admin/users',    icon:FiUsers,      label:'Users' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-gray-900 text-white flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-gray-800">
        <div className="flex items-center gap-2 text-lg font-black text-white mb-1">
          <span className="text-xl">🏨</span> HotelPro
        </div>
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wider">Admin Panel</div>
      </div>

      <div className="px-2 py-4 flex-1">
        <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider px-3 mb-3">Navigation</p>
        <nav className="space-y-0.5">
          {links.map(({ to, icon:Icon, label }) => {
            const active = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                }`}>
                <Icon size={17} /> {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-semibold text-white truncate">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-gray-400">Administrator</div>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 text-gray-400 hover:text-white w-full px-3 py-2 text-sm rounded-xl hover:bg-gray-800 transition-colors">
          <FiLogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// ==================== STAFF SIDEBAR ====================
export function StaffSidebar() {
  const location = useLocation();
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const links = [
    { to:'/staff',          icon:FiHome,     label:'Dashboard' },
    { to:'/staff/bookings', icon:FiCalendar, label:'Bookings' },
    { to:'/staff/rooms',    icon:FiGrid,     label:'Room Status' },
  ];

  return (
    <aside className="w-64 min-h-screen bg-blue-900 text-white flex flex-col flex-shrink-0">
      <div className="p-5 border-b border-blue-800">
        <div className="flex items-center gap-2 text-lg font-black text-white mb-1">
          <span className="text-xl">🏨</span> HotelPro
        </div>
        <div className="text-xs text-blue-400 font-medium uppercase tracking-wider">Staff Portal</div>
      </div>

      <div className="px-2 py-4 flex-1">
        <nav className="space-y-0.5">
          {links.map(({ to, icon:Icon, label }) => {
            const active = location.pathname === to || (to !== '/staff' && location.pathname.startsWith(to));
            return (
              <Link key={to} to={to}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  active ? 'bg-blue-600 text-white' : 'text-blue-200 hover:bg-blue-800 hover:text-white'
                }`}>
                <Icon size={17} /> {label}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-4 border-t border-blue-800">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">{user?.firstName} {user?.lastName}</div>
            <div className="text-xs text-blue-300">Staff Member</div>
          </div>
        </div>
        <button onClick={() => { logout(); navigate('/login'); }}
          className="flex items-center gap-2 text-blue-300 hover:text-white w-full px-3 py-2 text-sm rounded-xl hover:bg-blue-800 transition-colors">
          <FiLogOut size={15} /> Sign Out
        </button>
      </div>
    </aside>
  );
}

// ==================== LOADING SPINNER ====================
export function LoadingSpinner({ size = 'md', text = '' }) {
  const sizes = { sm:'w-5 h-5', md:'w-8 h-8 border-4', lg:'w-12 h-12 border-4' };
  return (
    <div className="flex flex-col items-center justify-center p-10 gap-3">
      <div className={`${sizes[size]} border-blue-200 border-t-blue-600 rounded-full animate-spin`} />
      {text && <p className="text-sm text-gray-500">{text}</p>}
    </div>
  );
}

// ==================== STATUS BADGE ====================
export function StatusBadge({ status }) {
  const map = {
    PENDING:    'badge-yellow',
    CONFIRMED:  'badge-blue',
    CHECKED_IN: 'badge-green',
    CHECKED_OUT:'badge-gray',
    CANCELLED:  'badge-red',
    NO_SHOW:    'badge-red',
    AVAILABLE:  'badge-green',
    OCCUPIED:   'badge-red',
    MAINTENANCE:'badge-yellow',
    RESERVED:   'badge-blue',
    COMPLETED:  'badge-green',
    FAILED:     'badge-red',
    REFUNDED:   'badge-yellow',
    ACTIVE:     'badge-green',
    INACTIVE:   'badge-red',
    ADMIN:      'badge-purple',
    STAFF:      'badge-blue',
    CUSTOMER:   'badge-gray',
  };
  if (!status) return null;
  return (
    <span className={map[status] || 'badge-gray'}>
      {status.replace(/_/g, ' ')}
    </span>
  );
}

// ==================== STAT CARD ====================
export function StatCard({ icon:Icon, label, value, color = 'blue', subtitle }) {
  const colors = {
    blue:  'bg-blue-100 text-blue-700',
    green: 'bg-green-100 text-green-700',
    yellow:'bg-amber-100 text-amber-700',
    red:   'bg-red-100 text-red-700',
    purple:'bg-purple-100 text-purple-700',
    orange:'bg-orange-100 text-orange-700',
  };
  return (
    <div className="stat-card">
      <div className={`p-3 rounded-xl ${colors[color] || colors.blue} flex-shrink-0`}>
        <Icon size={22} />
      </div>
      <div className="min-w-0">
        <p className="text-sm text-gray-500 truncate">{label}</p>
        <p className="text-2xl font-black text-gray-900 leading-tight">{value}</p>
        {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

// ==================== EMPTY STATE ====================
export function EmptyState({ message = 'No data found', icon: Icon = FiList, action, actionLabel }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-gray-400">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon size={28} className="opacity-60" />
      </div>
      <p className="text-gray-600 font-semibold">{message}</p>
      {action && (
        <button onClick={action} className="mt-4 text-blue-600 hover:underline text-sm font-medium">{actionLabel}</button>
      )}
    </div>
  );
}

// ==================== PAGINATION ====================
export function Pagination({ page, totalPages, onPage }) {
  if (!totalPages || totalPages <= 1) return null;
  const pages = Math.min(totalPages, 7);
  return (
    <div className="flex items-center justify-center gap-1.5 mt-8">
      <button onClick={() => onPage(page-1)} disabled={page===0}
        className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-blue-400 transition-colors">← Prev</button>
      {[...Array(pages)].map((_,i) => (
        <button key={i} onClick={() => onPage(i)}
          className={`w-9 h-9 rounded-xl text-sm font-semibold transition-colors ${i===page?'bg-blue-600 text-white shadow-sm':'bg-white border border-gray-200 text-gray-600 hover:border-blue-400'}`}>
          {i+1}
        </button>
      ))}
      <button onClick={() => onPage(page+1)} disabled={page>=totalPages-1}
        className="px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm font-medium disabled:opacity-40 hover:border-blue-400 transition-colors">Next →</button>
    </div>
  );
}
