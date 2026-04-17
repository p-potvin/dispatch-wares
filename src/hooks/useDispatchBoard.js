import { useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  reorderJobInRoute,
  removeJobFromRoute,
  addJobToRoute,
  moveJobBetweenRoutes,
} from '../store/slices/routesSlice';
import { removeFromPool, addToPool } from '../store/slices/jobsSlice';
import api from '../api/client';
import { optimize } from '../logic/optimizer';

export function useDispatchBoard() {
  const dispatch = useDispatch();
  const routes = useSelector((s) => s.routes.items);
  const pool = useSelector((s) => s.jobs.pool);
  const [optimizing, setOptimizing] = useState(null);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (!over || active.id === over.id) return;

      const fromRouteId = active.data.current?.routeId;
      const toRouteId = over.data.current?.routeId ?? over.id;

      if (!fromRouteId || !toRouteId) return;

      // Same container reorder (routes only)
      if (fromRouteId === toRouteId && fromRouteId !== 'pool') {
        const route = routes.find((r) => r.id === fromRouteId);
        if (!route) return;
        const oldIndex = route.jobs.findIndex((j) => j.id === active.id);
        const newIndex = route.jobs.findIndex((j) => j.id === over.id);
        if (oldIndex !== -1 && newIndex !== -1) {
          dispatch(reorderJobInRoute({ routeId: fromRouteId, oldIndex, newIndex }));
          api.patch(`/routes/${fromRouteId}/jobs/reorder`, { oldIndex, newIndex }).catch(() => {});
        }
        return;
      }

      // Find the job being dragged
      const job =
        fromRouteId === 'pool'
          ? pool.find((j) => j.id === active.id)
          : routes.find((r) => r.id === fromRouteId)?.jobs?.find((j) => j.id === active.id);

      if (!job) return;

      const toRoute = routes.find((r) => r.id === toRouteId);
      const toIndex = toRoute
        ? toRoute.jobs.findIndex((j) => j.id === over.id)
        : -1;
      const insertAt = toIndex >= 0 ? toIndex : undefined;

      // Optimistic update
      if (fromRouteId === 'pool' && toRouteId === 'pool') return;

      if (fromRouteId === 'pool') {
        dispatch(removeFromPool(active.id));
        dispatch(addJobToRoute({ job, routeId: toRouteId, toIndex: insertAt }));
        api.patch(`/routes/${toRouteId}/jobs`, { jobId: active.id, fromRouteId, toIndex: insertAt }).catch(() => {});
      } else if (toRouteId === 'pool') {
        dispatch(removeJobFromRoute({ jobId: active.id, routeId: fromRouteId }));
        dispatch(addToPool(job));
        api.patch(`/jobs/${active.id}/unassign`).catch(() => {});
      } else {
        dispatch(moveJobBetweenRoutes({ jobId: active.id, fromRouteId, toRouteId, toIndex: insertAt }));
        api.patch(`/routes/${toRouteId}/jobs`, { jobId: active.id, fromRouteId, toIndex: insertAt }).catch(() => {});
      }
    },
    [dispatch, routes, pool]
  );

  const optimizeRoute = useCallback(
    async (routeId) => {
      const route = routes.find((r) => r.id === routeId);
      if (!route?.jobs?.length) return;
      setOptimizing(routeId);
      try {
        const optimized = optimize(route.jobs);
        const snapshot = [...route.jobs];
        optimized.forEach((job, newIndex) => {
          const oldIndex = snapshot.findIndex((j) => j.id === job.id);
          if (oldIndex !== newIndex) {
            dispatch(reorderJobInRoute({ routeId, oldIndex, newIndex }));
          }
        });
        await api.put(`/routes/${routeId}/optimize`);
      } catch {
        // silently fail — server is optional
      } finally {
        setOptimizing(null);
      }
    },
    [dispatch, routes]
  );

  return { handleDragEnd, optimizeRoute, optimizing, routes, pool };
}
