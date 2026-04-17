import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDrivers } from '../store/slices/driversSlice';
import { Users, Loader2 } from 'lucide-react';
import { DRIVER_STATUS_COLORS } from '../utils/constants';

export default function Drivers() {
  const dispatch = useDispatch();
  const { items: drivers, loading } = useSelector((s) => s.drivers);

  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-5 h-5 text-emerald-400" />
        <h1 className="text-xl font-bold text-slate-100">Drivers</h1>
        <span className="badge bg-slate-700/50 text-slate-400">{drivers.length}</span>
      </div>

      {loading && drivers.length === 0 ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading drivers…
        </div>
      ) : drivers.length === 0 ? (
        <p className="text-slate-500 text-sm">No drivers found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {drivers.map((driver) => (
            <div key={driver.id} className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-semibold text-sm">
                  {driver.name?.charAt(0)?.toUpperCase() || '?'}
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{driver.name}</p>
                  <p className="text-xs text-slate-500">{driver.licenseClass || 'Class C'}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className={`badge ${DRIVER_STATUS_COLORS[driver.status] || 'bg-slate-600/40 text-slate-400'}`}>
                  {driver.status || 'UNKNOWN'}
                </span>
                {driver.phone && <span className="text-slate-500">{driver.phone}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
