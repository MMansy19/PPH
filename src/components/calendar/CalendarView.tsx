'use client';
import { Calendar as BigCalendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTasks } from '@/hooks/useTasks';
import { Card, CardContent } from '@/components/ui/card';
import { getCategoryColor } from '@/utils/dates';
import { parseDuration } from '@/lib/utils';
import { Task } from '@/types';

const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
  resource: Task;
}

export function CalendarView() {
  const { tasks } = useTasks();

  const events: CalendarEvent[] = tasks.map((task) => {
    const startDate = task.start_date 
      ? new Date(task.start_date) 
      : task.created_at 
        ? new Date(task.created_at)
        : new Date();
    
    const durationHours = parseDuration(task.duration);
    const endDate = task.end_date
      ? new Date(task.end_date)
      : new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

    return {
      id: task.id,
      title: `${task.title} (${task.category?.replace('_', ' ')})`,
      start: startDate,
      end: endDate,
      resource: task,
    };
  });

  return (
    <Card className="w-full h-[700px]">
      <CardContent className="p-4 h-full">
        <BigCalendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          style={{ height: '100%' }}
          eventPropGetter={(event) => ({
            style: {
              backgroundColor: getCategoryColor(event.resource.category || 'other'),
              borderRadius: '5px',
              opacity: 0.8,
              color: 'white',
              border: '0px',
              display: 'block',
            },
          })}
          components={{
            event: ({ event }: { event: CalendarEvent }) => (
              <div className="cursor-pointer p-1">
                <div className="text-xs font-medium truncate">{event.title}</div>
                <div className="text-xs opacity-90">NPV: ${event.resource.npv}M</div>
              </div>
            ),
          }}
        />
      </CardContent>
    </Card>
  );
}
