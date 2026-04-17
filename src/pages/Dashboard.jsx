import React, { useState, useEffect } from 'react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import api from '../api/client';
import { optimizeRouteLocal } from '../logic/optimizer';

export default function Dashboard() {
  const [routes, setRoutes] = useState([]);
  const [pool, setPool] = useState([]);

  useEffect(() => {
    api.get('/dashboard/today').then(res => {
      setRoutes(res.data.routes);
      setPool(res.data.pool);
    });
  }, []);

  const handleOptimize = (routeId) => {
    const route = routes.find(r => r.id === routeId);
    const optimized = optimizeRouteLocal(route.deliveries);
    // Update State logic...
  };

  return (
    <div className="flex h-screen bg-vault-base text-vault-light p-6">
      <div className="w-1/4 bg-vault-slate p-4 rounded-xl mr-6">
        <h2 className="font-bold mb-4">The Pool ({pool.length})</h2>
        {/* Render Pool Items */}
      </div>
      <div className="flex-1 flex gap-4 overflow-x-auto">
        <DndContext collisionDetection={closestCenter}>
          {routes.map(route => (
            <div key={route.id} className="w-80 bg-vault-slate/80 p-4 rounded-xl">
               <button onClick={() => handleOptimize(route.id)}>⚡ Optimize</button>
               {/* Render Route Items */}
            </div>
          ))}
        </DndContext>
      </div>
    </div>
  );
}
