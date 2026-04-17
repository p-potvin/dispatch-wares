import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchTrucks } from '../store/slices/trucksSlice';
import { Truck, Loader2 } from 'lucide-react';

export default function Trucks() {
  const dispatch = useDispatch();
  const { items: trucks, loading } = useSelector((s) => s.trucks);

  useEffect(() => {
    dispatch(fetchTrucks());
  }, [dispatch]);

  return (
    <div className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <Truck className="w-5 h-5 text-emerald-400" />
        <h1 className="text-xl font-bold text-slate-100">Trucks</h1>
        <span className="badge bg-slate-700/50 text-slate-400">{trucks.length}</span>
      </div>

      {loading && trucks.length === 0 ? (
        <div className="flex items-center gap-2 text-slate-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading trucks…
        </div>
      ) : trucks.length === 0 ? (
        <p className="text-slate-500 text-sm">No trucks found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {trucks.map((truck) => (
            <div key={truck.id} className="glass-card p-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-xl bg-slate-700 flex items-center justify-center">
                  <Truck className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-200">{truck.plateNumber || truck.id}</p>
                  <p className="text-xs text-slate-500">{truck.model || 'Unknown model'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                {truck.capacity && <span>Capacity: {truck.capacity}kg</span>}
                {truck.year && <span>Year: {truck.year}</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
