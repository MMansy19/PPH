'use client';
import { useTasks } from '@/hooks/useTasks';
import { EventCard } from '@/components/calendar/EventCard';

export function ListView() {
  const { tasks } = useTasks();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Task List ({tasks.length})</h2>
      <div className="grid gap-4">
        {tasks.map((task) => (
          <EventCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );
}
