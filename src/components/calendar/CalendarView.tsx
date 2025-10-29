'use client';
import { useState, useCallback } from 'react';
import { Calendar as BigCalendar, momentLocalizer, Event, View, Views } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTasksStore } from '@/store/useTasksStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getCategoryColor } from '@/utils/dates';
import { parseDuration } from '@/lib/utils';
import { Task } from '@/types';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { TaskForm } from '@/components/forms/TaskForm';
import { Badge } from '@/components/ui/badge';
import { Calendar, ChevronLeft, ChevronRight, Clock, DollarSign, AlertCircle } from 'lucide-react';

const localizer = momentLocalizer(moment);

interface CalendarEvent extends Event {
  resource: Task;
}

export function CalendarView() {
  const { tasks, currentWorkspaceId } = useTasksStore();
  const [view, setView] = useState<View>(Views.MONTH);
  const [date, setDate] = useState(new Date());
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  
  // Filter tasks by current workspace
  const workspaceTasks = tasks.filter(t => t.workspace_id === currentWorkspaceId);

  const events: CalendarEvent[] = workspaceTasks.map((task) => {
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
      title: task.title,
      start: startDate,
      end: endDate,
      resource: task,
    };
  });

  const handleSelectEvent = useCallback((event: CalendarEvent) => {
    setSelectedTask(event.resource);
    setIsEditDialogOpen(true);
  }, []);

  const handleNavigate = useCallback((newDate: Date) => {
    setDate(newDate);
  }, []);

  const handleViewChange = useCallback((newView: View) => {
    setView(newView);
  }, []);

  const navigateToday = () => {
    setDate(new Date());
  };

  const navigatePrevious = () => {
    const newDate = new Date(date);
    if (view === Views.MONTH) {
      newDate.setMonth(date.getMonth() - 1);
    } else if (view === Views.WEEK) {
      newDate.setDate(date.getDate() - 7);
    } else {
      newDate.setDate(date.getDate() - 1);
    }
    setDate(newDate);
  };

  const navigateNext = () => {
    const newDate = new Date(date);
    if (view === Views.MONTH) {
      newDate.setMonth(date.getMonth() + 1);
    } else if (view === Views.WEEK) {
      newDate.setDate(date.getDate() + 7);
    } else {
      newDate.setDate(date.getDate() + 1);
    }
    setDate(newDate);
  };

  const getDateRangeText = () => {
    if (view === Views.MONTH) {
      return moment(date).format('MMMM YYYY');
    } else if (view === Views.WEEK) {
      const weekStart = moment(date).startOf('week');
      const weekEnd = moment(date).endOf('week');
      return `${weekStart.format('MMM D')} - ${weekEnd.format('MMM D, YYYY')}`;
    } else {
      return moment(date).format('MMMM D, YYYY');
    }
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Calendar View
            </CardTitle>
            
            <div className="flex flex-wrap items-center gap-2">
              {/* View Switcher */}
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant={view === Views.MONTH ? 'default' : 'ghost'}
                  onClick={() => setView(Views.MONTH)}
                  className="h-8 px-3"
                >
                  Month
                </Button>
                <Button
                  size="sm"
                  variant={view === Views.WEEK ? 'default' : 'ghost'}
                  onClick={() => setView(Views.WEEK)}
                  className="h-8 px-3"
                >
                  Week
                </Button>
                <Button
                  size="sm"
                  variant={view === Views.DAY ? 'default' : 'ghost'}
                  onClick={() => setView(Views.DAY)}
                  className="h-8 px-3"
                >
                  Day
                </Button>
              </div>

              {/* Navigation */}
              <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={navigatePrevious}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={navigateToday}
                  className="h-8 px-3"
                >
                  Today
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={navigateNext}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>

              <span className="text-sm font-medium text-gray-700 min-w-[200px] text-center">
                {getDateRangeText()}
              </span>
            </div>
          </div>
          
          {/* Legend */}
          <div className="flex flex-wrap gap-2 mt-4">
            <Badge style={{ backgroundColor: getCategoryColor('big_bets') }}>Big Bets</Badge>
            <Badge style={{ backgroundColor: getCategoryColor('line_extensions') }}>Line Extensions</Badge>
            <Badge style={{ backgroundColor: getCategoryColor('ltos') }}>LTOs</Badge>
            <Badge style={{ backgroundColor: getCategoryColor('other') }}>Other</Badge>
          </div>
        </CardHeader>
        
        <CardContent className="p-4">
          <div className="calendar-wrapper h-[600px] md:h-[700px]">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              view={view}
              date={date}
              onNavigate={handleNavigate}
              onView={handleViewChange}
              onSelectEvent={handleSelectEvent}
              style={{ height: '100%' }}
              toolbar={false}
              eventPropGetter={(event) => {
                const task = event.resource;
                const color = getCategoryColor(task.category || 'other');
                return {
                  style: {
                    backgroundColor: color,
                    borderRadius: '4px',
                    opacity: task.completed ? 0.6 : 0.9,
                    color: 'white',
                    border: 'none',
                    fontSize: '0.875rem',
                    padding: '2px 6px',
                    textDecoration: task.completed ? 'line-through' : 'none',
                  },
                };
              }}
              components={{
                event: ({ event }: { event: CalendarEvent }) => {
                  const task = event.resource;
                  return (
                    <div className="cursor-pointer hover:opacity-100 transition-opacity">
                      <div className="font-medium truncate">{task.title}</div>
                      {view !== Views.MONTH && (
                        <div className="text-xs opacity-90 flex items-center gap-1 mt-1">
                          <DollarSign className="h-3 w-3" />
                          ${task.npv}M
                          {task.priority === 'high' && (
                            <AlertCircle className="h-3 w-3 ml-1" />
                          )}
                        </div>
                      )}
                    </div>
                  );
                },
              }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
            <DialogDescription>
              Update task details
            </DialogDescription>
          </DialogHeader>
          {selectedTask && currentWorkspaceId && (
            <TaskForm 
              workspaceId={currentWorkspaceId}
              task={selectedTask}
              onClose={() => {
                setIsEditDialogOpen(false);
                setSelectedTask(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
