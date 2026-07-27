import { useState } from 'react';
import { ChevronLeft, ChevronRight, Briefcase, X, CheckCircle, Circle, PlusCircle, Edit2, Eye, Trash2 } from 'lucide-react';
import ApplicationTable from './ApplicationTable';
import TaskForm from './TaskForm';

function CalendarView({ applications, tasks, onAppClick, onAddTask, onEditTask, onDeleteTask, onToggleTask }) {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 6, 1)); 
  const [selectedDay, setSelectedDay] = useState(null); // { dateString, apps, tasks }
  
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfMonth(year, month);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let d = 1; d <= daysInMonth; d++) {
    const cellDate = new Date(year, month, d);
    const isPastDay = cellDate < today;
    const isToday = cellDate.getTime() === today.getTime();
    
    const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
    const dayApps = applications.filter(app => app.appliedDate === dateString);
    const dayTasks = tasks.filter(task => task.date === dateString);

    days.push(
      <div 
        key={`day-${d}`} 
        className={`calendar-day glass glass-panel calendar-day-hover ${isPastDay ? 'past-day' : ''} ${isToday ? 'today' : ''}`} 
        onClick={() => {
          if (dayApps.length > 0 || dayTasks.length > 0) {
            setSelectedDay({ dateString, apps: dayApps, tasks: dayTasks });
          }
        }}
        style={{ 
          cursor: (dayApps.length > 0 || dayTasks.length > 0) ? 'pointer' : 'default', 
          position: 'relative',
          opacity: isPastDay ? 0.6 : 1
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', marginBottom: '8px', gap: '8px' }}>
          {!isPastDay && (
            <button 
              className="quick-add-btn"
              onClick={(e) => {
                e.stopPropagation();
                setEditingTask(null);
                setIsTaskFormOpen(dateString);
              }}
              title="Add Task for this date"
            >
              <PlusCircle size={14} />
            </button>
          )}
          <span 
            className="day-number" 
            style={{ 
              margin: 0, 
              textDecoration: isPastDay ? 'line-through' : 'none',
              color: isToday ? 'var(--accent-cyan)' : 'inherit',
              fontWeight: isToday ? 'bold' : 'normal'
            }}
          >
            {d}
          </span>
        </div>
        <div className="day-content">
          {dayTasks.map(task => (
            <div 
              key={task.id} 
              className={`calendar-app-badge`}
              style={{ 
                background: task.completed ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.1)', 
                color: task.completed ? '#86efac' : 'var(--text-main)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
              onClick={(e) => {
                e.stopPropagation();
                onToggleTask(task.id);
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflow: 'hidden' }}>
                {task.completed ? <CheckCircle size={12} style={{ flexShrink: 0 }} /> : <Circle size={12} style={{ flexShrink: 0 }} />}
                <span className="app-company" style={{ textDecoration: task.completed ? 'line-through' : 'none' }}>
                  {task.time && <strong style={{ marginRight: '4px' }}>{task.time}</strong>}
                  {task.title}
                </span>
              </div>
              <div style={{ display: 'flex', gap: '4px', flexShrink: 0 }} className="task-actions-inline">
                <button 
                  onClick={(e) => handleViewClick(task, e)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--accent-cyan)' }}
                  title="View Task"
                >
                  <Eye size={12} />
                </button>
                <button 
                  onClick={(e) => handleEditClick(task, e)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: 'var(--accent-purple)' }}
                  title="Edit Task"
                >
                  <Edit2 size={12} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this task?')) {
                      onDeleteTask(task.id);
                      if (selectedDay) {
                        setSelectedDay({
                          ...selectedDay,
                          tasks: selectedDay.tasks.filter(t => t.id !== task.id)
                        });
                      }
                    }
                  }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px', color: '#f87171' }}
                  title="Delete Task"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
          {dayApps.map(app => (
            <div 
              key={app.id} 
              className={`calendar-app-badge status-${app.status}`}
              onClick={(e) => {
                e.stopPropagation();
                onAppClick(app);
              }}
            >
              <Briefcase size={12} style={{ flexShrink: 0 }} />
              <span className="app-company">{app.website}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleEditClick = (task, e) => {
    e.stopPropagation();
    setEditingTask(task);
    setIsTaskFormOpen(true);
  };

  const handleViewClick = (task, e) => {
    e.stopPropagation();
    alert(`Task Details:\n\nTitle: ${task.title}\nDate: ${task.date}\nTime: ${task.time || 'Not set'}\nStatus: ${task.completed ? 'Completed' : 'Pending'}`);
  };

  return (
    <div className="calendar-container">
      <div className="calendar-header glass glass-panel">
        <button className="btn btn-secondary" onClick={handlePrevMonth} style={{ padding: '8px' }}>
          <ChevronLeft size={20} />
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h2 style={{ margin: 0 }}>{monthNames[month]} {year}</h2>
          <input 
            type="month" 
            className="form-control" 
            style={{ width: 'auto', padding: '6px 12px' }}
            value={`${year}-${String(month + 1).padStart(2, '0')}`}
            onChange={(e) => {
              if (e.target.value) {
                const [y, m] = e.target.value.split('-');
                setCurrentDate(new Date(parseInt(y), parseInt(m) - 1, 1));
              }
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button className="btn btn-primary" onClick={() => { setEditingTask(null); setIsTaskFormOpen(true); }} style={{ padding: '8px 16px', fontSize: '0.9rem' }}>
            <PlusCircle size={16} /> New Task
          </button>
          <button className="btn btn-secondary" onClick={handleNextMonth} style={{ padding: '8px' }}>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="calendar-grid">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="calendar-weekday">
            {day}
          </div>
        ))}
        {days}
      </div>

      {isTaskFormOpen && (
        <TaskForm 
          initialTask={editingTask}
          initialDate={typeof isTaskFormOpen === 'string' ? isTaskFormOpen : null}
          onClose={() => {
            setIsTaskFormOpen(false);
            setEditingTask(null);
          }}
          onSubmit={(task) => {
            if (editingTask) {
              onEditTask(task);
              // Update selectedDay if it's currently open
              if (selectedDay) {
                setSelectedDay({
                  ...selectedDay,
                  tasks: selectedDay.tasks.map(t => t.id === task.id ? task : t)
                });
              }
            } else {
              onAddTask(task);
            }
            setIsTaskFormOpen(false);
            setEditingTask(null);
          }}
        />
      )}

      {selectedDay && (
        <div className="modal-overlay" onClick={() => setSelectedDay(null)}>
          <div className="glass modal-content glass-panel" style={{ maxWidth: '800px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setSelectedDay(null)}>
              <X size={24} />
            </button>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Schedule for {selectedDay.dateString}</h2>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  setEditingTask(null);
                  setIsTaskFormOpen(selectedDay.dateString);
                }}
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <PlusCircle size={16} /> Add Task
              </button>
            </div>
            
            {selectedDay.tasks && selectedDay.tasks.length > 0 && (
              <div style={{ marginBottom: '30px' }}>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Tasks</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {selectedDay.tasks.map(task => (
                    <div 
                      key={task.id} 
                      className="glass glass-panel"
                      style={{ 
                        padding: '12px 16px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between',
                        gap: '12px',
                        opacity: task.completed ? 0.6 : 1
                      }}
                    >
                      <div 
                        style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer', flex: 1 }}
                        onClick={() => {
                          onToggleTask(task.id);
                          setSelectedDay({
                            ...selectedDay,
                            tasks: selectedDay.tasks.map(t => t.id === task.id ? { ...t, completed: !t.completed } : t)
                          });
                        }}
                      >
                        {task.completed ? <CheckCircle size={20} color="#86efac" /> : <Circle size={20} color="var(--text-muted)" />}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span style={{ fontSize: '1rem', color: 'var(--text-main)', textDecoration: task.completed ? 'line-through' : 'none' }}>
                            {task.title}
                          </span>
                          {task.time && (
                            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                              {task.time}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={(e) => handleViewClick(task, e)}
                          className="btn btn-secondary" 
                          style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', border: 'none' }}
                          title="View Task"
                        >
                          <Eye size={16} color="var(--accent-cyan)" />
                        </button>
                        <button 
                          onClick={(e) => handleEditClick(task, e)}
                          className="btn btn-secondary" 
                          style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', border: 'none' }}
                          title="Edit Task"
                        >
                          <Edit2 size={16} color="var(--accent-purple)" />
                        </button>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete this task?')) {
                              onDeleteTask(task.id);
                              setSelectedDay({
                                ...selectedDay,
                                tasks: selectedDay.tasks.filter(t => t.id !== task.id)
                              });
                            }
                          }}
                          className="btn btn-secondary" 
                          style={{ padding: '6px', background: 'rgba(255,255,255,0.05)', border: 'none' }}
                          title="Delete Task"
                        >
                          <Trash2 size={16} color="#f87171" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedDay.apps && selectedDay.apps.length > 0 && (
              <div>
                <h3 style={{ color: 'var(--text-main)', marginBottom: '12px', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Applications</h3>
                <ApplicationTable 
                  applications={selectedDay.apps} 
                  onAppClick={(app) => {
                    setSelectedDay(null);
                    onAppClick(app);
                  }} 
                />
              </div>
            )}
            
            {selectedDay.apps.length === 0 && selectedDay.tasks.length === 0 && (
              <p style={{ color: 'var(--text-muted)' }}>Nothing scheduled for this day.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default CalendarView;
