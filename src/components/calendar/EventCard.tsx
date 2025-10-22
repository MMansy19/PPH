'use client';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { formatDate, getCategoryColor } from '@/utils/dates';
import { Calendar, Clock } from 'lucide-react';

interface Props {
  task: Task;
}

export function EventCard({ task }: Props) {
  return (
    <div className="p-3 bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h4 className="font-medium text-sm">{task.title}</h4>
        <Badge style={{ backgroundColor: getCategoryColor(task.category || 'other') }}>
          {task.category?.replace('_', ' ')}
        </Badge>
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
        <Calendar className="h-3 w-3" />
        {formatDate(task.created_at || new Date().toISOString())}
        <Clock className="h-3 w-3 ml-2" />
        {task.duration}
      </div>
      <div className="text-xs text-gray-600">
        Value: {task.value} | Risk: {task.risk} | NPV: ${task.npv}M
      </div>
      {task.priority && (
        <div className="mt-2">
          <Badge variant="outline" className="text-xs">
            Priority: {task.priority}
          </Badge>
        </div>
      )}
    </div>
  );
}
