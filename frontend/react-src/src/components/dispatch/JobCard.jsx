import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { MapPin, Weight, Clock, GripVertical, AlertTriangle } from 'lucide-react';
import { PRIORITY_COLORS, STATUS_COLORS } from '../../utils/constants';
import { truncate, formatWeight } from '../../utils/formatters';

export default function JobCard({ job, routeId }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: job.id,
    data: { routeId, job },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    zIndex: isDragging ? 50 : 'auto',
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <motion.div
        layout
        className={`job-card group hover:border-emerald-500/40 hover:bg-slate-700/80 transition-all duration-150 ${isDragging ? 'shadow-2xl shadow-emerald-500/20 border-emerald-500/40' : ''}`}
      >
        <div className="flex items-start gap-2">
          <div {...listeners} className="mt-0.5 text-slate-600 hover:text-slate-400 cursor-grab active:cursor-grabbing shrink-0">
            <GripVertical className="w-3.5 h-3.5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1.5">
              <p className="text-sm font-medium text-slate-200 leading-tight">{truncate(job.destName || job.name, 24)}</p>
              {job.priority && (
                <span className={`badge text-xs shrink-0 ${PRIORITY_COLORS[job.priority] || PRIORITY_COLORS.STANDARD}`}>
                  {job.priority === 'URGENT' && <AlertTriangle className="w-2.5 h-2.5" />}
                  {job.priority}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-500 mb-1">
              <MapPin className="w-3 h-3 shrink-0" />
              <span className="truncate">{truncate(job.destAddress || job.address, 28)}</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-500">
              {job.weight != null && (
                <span className="flex items-center gap-1"><Weight className="w-3 h-3" />{formatWeight(job.weight)}</span>
              )}
              {job.estimatedTime && (
                <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{job.estimatedTime}</span>
              )}
              {job.status && (
                <span className={`badge ${STATUS_COLORS[job.status] || ''}`}>{job.status}</span>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
