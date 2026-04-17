import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Truck, Users, Settings, ShieldCheck, LogOut, Zap,
} from 'lucide-react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';

const NAV = [
  { to: '/', icon: LayoutDashboard, label: 'Dispatch' },
  { to: '/drivers', icon: Users, label: 'Drivers' },
  { to: '/trucks', icon: Truck, label: 'Trucks' },
  { to: '/settings', icon: Settings, label: 'Settings' },
  { to: '/admin', icon: ShieldCheck, label: 'Admin' },
];

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <motion.aside
      initial={{ x: -80, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="w-16 bg-vault-base border-r border-slate-800 flex flex-col items-center py-4 gap-2 z-30"
    >
      <div className="mb-4 flex items-center justify-center w-10 h-10 rounded-xl bg-vault-green/20 border border-emerald-500/40">
        <Zap className="w-5 h-5 text-vault-green" />
      </div>
      {NAV.map(({ to, icon: Icon, label }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          title={label}
          className={({ isActive }) =>
            `flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 group relative ` +
            (isActive
              ? 'bg-vault-green/20 text-vault-green border border-emerald-500/40'
              : 'text-slate-500 hover:text-vault-light hover:bg-vault-slate')
          }
        >
          <Icon className="w-5 h-5" />
          <span className="absolute left-14 bg-vault-slate border border-slate-700 text-vault-light text-xs px-2 py-1 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity">
            {label}
          </span>
        </NavLink>
      ))}
      <button
        onClick={() => { dispatch(logoutUser()); navigate('/login'); }}
        title="Logout"
        className="mt-auto flex items-center justify-center w-10 h-10 rounded-xl text-slate-600 hover:text-red-400 hover:bg-red-400/10 transition-all duration-200"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </motion.aside>
  );
}
