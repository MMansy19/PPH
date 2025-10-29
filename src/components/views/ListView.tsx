'use client';
import { useTasksStore } from '@/store/useTasksStore';
import { EventCard } from '@/components/calendar/EventCard';

export function ListView() {
  const { tasks, currentWorkspaceId } = useTasksStore();
  
  // Filter tasks by current workspace
  const workspaceTasks = tasks.filter(t => t.workspace_id === currentWorkspaceId);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Task List ({workspaceTasks.length})</h2>
      <div className="grid gap-4">
        {workspaceTasks.map((task) => (
          <EventCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
