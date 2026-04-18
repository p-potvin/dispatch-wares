import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { fetchRoutes } from '../store/slices/routesSlice';
import { fetchJobs } from '../store/slices/jobsSlice';
import { useDispatchBoard } from '../hooks/useDispatchBoard';
import JobCard from '../components/dispatch/JobCard';
import { Zap, Loader2 } from 'lucide-react';

function RouteColumn({ route, onOptimize, optimizing }) {
  const jobs = route.jobs || [];
  return (
    <div className="route-column">
      <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/50 bg-slate-900/50">
        <div>
          <p className="text-sm font-semibold text-slate-200">{route.name || `Route ${route.id}`}</p>
          {route.driverName && <p className="text-xs text-slate-500">{route.driverName}</p>}
        </div>
        <button
          onClick={() => onOptimize(route.id)}
          disabled={optimizing === route.id}
          title="Optimize route"
          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-400 hover:bg-emerald-500/10 transition-all disabled:opacity-40"
        >
          {optimizing === route.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
        </button>
      </div>
      <SortableContext items={jobs.map((j) => j.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[4rem]">
          {jobs.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-4">Drop jobs here</p>
          ) : (
            jobs.map((job) => <JobCard key={job.id} job={job} routeId={route.id} />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}

function JobPool({ pool }) {
  return (
    <div className="route-column">
      <div className="px-4 py-3 border-b border-slate-700/50 bg-slate-900/50">
        <p className="text-sm font-semibold text-slate-200">Job Pool</p>
        <p className="text-xs text-slate-500">{pool.length} unassigned</p>
      </div>
      <SortableContext items={pool.map((j) => j.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-[4rem]">
          {pool.length === 0 ? (
            <p className="text-xs text-slate-600 text-center py-4">No jobs in pool</p>
          ) : (
            pool.map((job) => <JobCard key={job.id} job={job} routeId="pool" />)
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function Dashboard() {
  const dispatch = useDispatch();
  const { selectedDate } = useSelector((s) => s.ui);
  const { loading: routesLoading } = useSelector((s) => s.routes);
  const { handleDragEnd, optimizeRoute, optimizing, routes, pool } = useDispatchBoard();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  useEffect(() => {
    dispatch(fetchRoutes(selectedDate));
    dispatch(fetchJobs(selectedDate));
  }, [dispatch, selectedDate]);

  if (routesLoading && routes.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-500">
        <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading dispatch board…
      </div>
    );
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex gap-4 p-4 h-full overflow-x-auto">
        <JobPool pool={pool} />
        {routes.map((route) => (
          <RouteColumn
            key={route.id}
            route={route}
            onOptimize={optimizeRoute}
            optimizing={optimizing}
          />
        ))}
      </div>
    </DndContext>
  );
}
