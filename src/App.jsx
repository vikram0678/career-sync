import { useState, useEffect, useRef } from 'react';
import { PlusCircle, Briefcase, BarChart3, TrendingUp, Filter, LogOut, Moon, Sun, RotateCcw } from 'lucide-react';
import { supabase } from './supabase';
import ApplicationForm from './components/ApplicationForm';
import ApplicationDetails from './components/ApplicationDetails';
import ApplicationTable from './components/ApplicationTable';
import CalendarView from './components/CalendarView';
import GoalCountdown from './components/GoalCountdown';
import GoalForm from './components/GoalForm';

function FilterPanel({ filters, setFilters, availableRoles }) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Keep local state in sync if parent resets filters
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleChange = (e) => {
    setLocalFilters({ ...localFilters, [e.target.name]: e.target.value });
  };

  const handleApply = () => {
    setFilters(localFilters);
  };

  const handleClear = () => {
    const empty = { startDate: '', endDate: '', salary: '', role: '' };
    setLocalFilters(empty);
    setFilters(empty);
  };

  return (
    <div style={{ padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '120px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Start Date</label>
        <input type="date" name="startDate" value={localFilters.startDate} onChange={handleChange} className="form-control" style={{ padding: '6px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '120px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>End Date</label>
        <input type="date" name="endDate" value={localFilters.endDate} onChange={handleChange} className="form-control" style={{ padding: '6px' }} />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '100px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Role</label>
        <select name="role" value={localFilters.role} onChange={handleChange} className="form-control" style={{ padding: '6px' }}>
          <option value="">All Roles</option>
          {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', flex: 1, minWidth: '100px' }}>
        <label style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Min Salary</label>
        <input type="text" name="salary" value={localFilters.salary} onChange={handleChange} className="form-control" placeholder="e.g. 100k" style={{ padding: '6px' }} />
      </div>
      
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px' }}>
        <button onClick={handleApply} className="btn btn-primary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Apply</button>
        {Object.values(localFilters).some(v => v !== '') && (
          <button onClick={handleClear} className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Clear</button>
        )}
      </div>
    </div>
  );
}

function LoginScreen() {
  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({ 
      provider: 'google',
      options: {
        queryParams: {
          prompt: 'select_account'
        }
      }
    });
    if (error) console.error("Login error", error);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: 'var(--bg-gradient)', backgroundSize: '200% 200%', animation: 'auroraFlow 20s ease infinite' }}>
      <div className="glass glass-panel" style={{ textAlign: 'center', padding: '48px', maxWidth: '400px', width: '90%' }}>
        <h1 style={{ marginBottom: '16px' }}>CareerSync</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>Organize your job hunt and track your momentum.</p>
        <button className="btn btn-primary" onClick={handleLogin} style={{ width: '100%', fontSize: '1.1rem', padding: '16px' }}>
          Sign in with Google
        </button>
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formType, setFormType] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  const [goal, setGoal] = useState(null);
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);
  
  const [recentlyDeleted, setRecentlyDeleted] = useState(null);
  const deleteTimerRef = useRef(null);
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);
  
  const [collegeFilters, setCollegeFilters] = useState({ startDate: '', endDate: '', salary: '', role: '' });
  const [selfFilters, setSelfFilters] = useState({ startDate: '', endDate: '', salary: '', role: '' });
  
  const [showCollegeFilters, setShowCollegeFilters] = useState(false);
  const [showSelfFilters, setShowSelfFilters] = useState(false);

  useEffect(() => {
    let applicationsChannel = null;

    const fetchApplications = async (userId) => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('userId', userId);
      if (data && !error) setApplications(data);
    };

    const fetchGoal = async (userId) => {
      const { data } = await supabase
        .from('user_preferences')
        .select('goal')
        .eq('userId', userId)
        .maybeSingle();
      if (data && data.goal) {
        setGoal(data.goal);
      } else {
        setGoal({ title: 'Land a Developer Role', targetDate: '2026-12-31T00:00' });
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if(!session) setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
      setAuthLoading(false);
      
      if (currentUser) {
        fetchApplications(currentUser.id);
        fetchGoal(currentUser.id);

        applicationsChannel = supabase.channel('public:applications')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `userId=eq.${currentUser.id}` }, payload => {
            fetchApplications(currentUser.id);
          })
          .subscribe();
      } else {
        setApplications([]);
        if (applicationsChannel) supabase.removeChannel(applicationsChannel);
      }
    });
    
    setTasks([
      { id: 't1', title: 'Follow up with Google recruiter', date: '2026-07-22', time: '10:00', completed: true },
      { id: 't2', title: 'Prepare for LinkedIn interview', date: '2026-07-16', time: '14:30', completed: false }
    ]);
    
    return () => {
      subscription?.unsubscribe();
      if (applicationsChannel) supabase.removeChannel(applicationsChannel);
    };
  }, []);

  const handleAddApplication = async (newApp, resumeFileObj, screenshotFileObjs) => {
    if (!user) return;
    
    let finalResumeUrl = newApp.resumeUrl || '';
    let finalScreenshots = [];

    const uploadToSupabase = async (file) => {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user.id}/${fileName}`;
      
      const { error } = await supabase.storage.from('resumes').upload(filePath, file);
      if (error) throw error;
      
      const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
      return data.publicUrl;
    };

    try {
      if (resumeFileObj) {
        finalResumeUrl = await uploadToSupabase(resumeFileObj);
      }
      if (screenshotFileObjs && screenshotFileObjs.length > 0) {
        for (const file of screenshotFileObjs) {
          const url = await uploadToSupabase(file);
          finalScreenshots.push(url);
        }
      }
    } catch (uploadError) {
      console.error("Supabase upload failed", uploadError);
      throw new Error("File upload failed. Please try again or submit without files.");
    }

    try {
      const { error } = await supabase.from('applications').insert([{
        ...newApp,
        resumeUrl: finalResumeUrl,
        screenshots: finalScreenshots,
        userId: user.id,
        addedAt: Date.now()
      }]);
      if (error) throw error;
      setFormType(false);
    } catch (error) {
      console.error("Error adding application: ", error);
      throw new Error("Failed to save application to database.");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await supabase.from('applications').update({ status: newStatus }).eq('id', id);
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp({ ...selectedApp, status: newStatus });
      }
    } catch (error) {
      console.error("Error updating status: ", error);
    }
  };

  const handleDelete = async (app) => {
    try {
      await supabase.from('applications').delete().eq('id', app.id);
      setRecentlyDeleted(app);
      if (selectedApp && selectedApp.id === app.id) setSelectedApp(null);
      
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
      deleteTimerRef.current = setTimeout(() => {
        setRecentlyDeleted(null);
      }, 20000); // 20 seconds to undo
    } catch (err) {
      console.error("Error deleting", err);
    }
  };

  const handleUndoDelete = async () => {
    if (!recentlyDeleted) return;
    try {
      await supabase.from('applications').insert([{ ...recentlyDeleted }]);
      setRecentlyDeleted(null);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    } catch (err) {
      console.error("Error undoing", err);
    }
  };

  const handleGoalSave = async (newGoal) => {
    setGoal(newGoal);
    if (user) {
      try {
        await supabase.from('user_preferences').upsert([{ userId: user.id, goal: newGoal }], { onConflict: 'userId' });
      } catch (error) {
        console.error("Error saving goal: ", error);
      }
    }
    setIsGoalFormOpen(false);
  };

  const handleAddTask = (newTask) => {
    setTasks([...tasks, newTask]);
  };

  const handleEditTask = (updatedTask) => {
    setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteTask = (taskId) => {
    setTasks(tasks.filter(t => t.id !== taskId));
  };

  const handleToggleTask = (taskId) => {
    setTasks(tasks.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  const stats = {
    total: applications.length,
    interviews: applications.filter(a => a.status === 'interview').length,
    offers: applications.filter(a => a.status === 'offer').length
  };

  const applyFilters = (apps, filters) => {
    return apps.filter(app => {
      if (filters.startDate && new Date(app.appliedDate) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(app.appliedDate) > new Date(filters.endDate)) return false;
      if (filters.role && app.role !== filters.role) return false;
      // Basic text inclusion check for salary
      if (filters.salary && !(app.salary || '').toLowerCase().includes(filters.salary.toLowerCase())) return false;
      return true;
    });
  };

  const sortedApplications = [...applications].sort((a, b) => b.addedAt - a.addedAt);
  
  const rawCollegeApps = sortedApplications.filter(a => a.applicationType === 'college');
  const collegeApps = applyFilters(rawCollegeApps, collegeFilters);
  const collegeRoles = Array.from(new Set(rawCollegeApps.map(a => a.role)));

  const rawSelfApps = sortedApplications.filter(a => a.applicationType === 'self' || !a.applicationType);
  const selfApps = applyFilters(rawSelfApps, selfFilters);
  const selfRoles = Array.from(new Set(rawSelfApps.map(a => a.role)));

  if (authLoading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white' }}>Loading CareerSync...</div>;
  if (!user) return <LoginScreen />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        borderBottom: '1px solid var(--glass-border)',
        padding: '0 32px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '72px',
        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '1.8rem', letterSpacing: '-0.5px' }}>CareerSync</h1>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
          <div style={{ 
            display: 'flex', 
            background: 'var(--glass-border)', 
            padding: '4px', 
            borderRadius: '12px',
            width: '280px',
            justifyContent: 'space-between'
          }}>
            <button 
              onClick={() => setActiveTab('dashboard')}
              style={{ 
                background: activeTab === 'dashboard' ? 'var(--glass-bg)' : 'transparent',
                color: activeTab === 'dashboard' ? 'var(--accent-blue)' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 0',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1,
                boxShadow: activeTab === 'dashboard' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Dashboard
            </button>
            <button 
              onClick={() => setActiveTab('calendar')}
              style={{ 
                background: activeTab === 'calendar' ? 'var(--glass-bg)' : 'transparent',
                color: activeTab === 'calendar' ? 'var(--accent-blue)' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 0',
                borderRadius: '8px',
                fontWeight: '700',
                fontSize: '0.95rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1,
                boxShadow: activeTab === 'calendar' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none'
              }}
            >
              Calendar
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '16px', flex: 1 }}>
          <button 
            onClick={() => setIsDarkMode(!isDarkMode)} 
            className="btn btn-secondary" 
            style={{ padding: '8px', minWidth: 'auto', background: 'var(--glass-bg)', border: 'none', boxShadow: 'none' }} 
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} color="var(--accent-orange)" /> : <Moon size={18} color="var(--text-muted)" />}
          </button>
          <span style={{ fontWeight: '600', color: 'var(--text-main)', fontSize: '0.95rem' }}>
            {user.user_metadata?.full_name?.split(' ')[0] || 'User'}
          </span>
          <img src={user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User'} alt="Profile" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid white', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
          <button onClick={() => supabase.auth.signOut()} className="btn btn-secondary" style={{ padding: '8px', minWidth: 'auto', background: 'var(--glass-bg)', border: 'none', boxShadow: 'none' }} title="Log out">
            <LogOut size={18} color="var(--text-muted)" />
          </button>
        </div>
      </nav>

      <div className="app-container" style={{ flex: 1 }}>

      {activeTab === 'dashboard' ? (
        <>
          <GoalCountdown goal={goal} onEditClick={() => setIsGoalFormOpen(true)} />
          <div className="stats-container">
            <div className="glass glass-panel stat-card">
              <span className="stat-label">Total Applied</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Briefcase size={28} color="var(--accent-cyan)" />
                <span className="stat-value">{stats.total}</span>
              </div>
            </div>
            <div className="glass glass-panel stat-card">
              <span className="stat-label">Interviews</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <BarChart3 size={28} color="var(--accent-purple)" />
                <span className="stat-value">{stats.interviews}</span>
              </div>
            </div>
            <div className="glass glass-panel stat-card">
              <span className="stat-label">Offers</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrendingUp size={28} color="var(--accent-green)" />
                <span className="stat-value">{stats.offers}</span>
              </div>
            </div>
          </div>

          <main>
            <div className="split-view">
              {/* College Column */}
              <div className="split-column glass glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <h2 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0, color: 'var(--accent-cyan)' }}>College Tracking</h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.85rem' }} onClick={() => setShowCollegeFilters(!showCollegeFilters)}>
                      <Filter size={16} /> Filters
                    </button>
                    <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '0.85rem' }} onClick={() => setFormType('college')}>
                      <PlusCircle size={16} /> New
                    </button>
                  </div>
                </div>
                
                {showCollegeFilters && (
                  <FilterPanel filters={collegeFilters} setFilters={setCollegeFilters} availableRoles={collegeRoles} />
                )}
                
                <ApplicationTable applications={collegeApps} onAppClick={setSelectedApp} onDelete={handleDelete} />
              </div>
              
              {/* Self Column */}
              <div className="split-column glass glass-panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
                  <h2 style={{ borderBottom: 'none', paddingBottom: 0, margin: 0, color: 'var(--accent-purple)' }}>Self Tracking</h2>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button className="btn btn-secondary" style={{ padding: '6px 10px', fontSize: '0.85rem' }} onClick={() => setShowSelfFilters(!showSelfFilters)}>
                      <Filter size={16} /> Filters
                    </button>
                    <button className="btn btn-primary" style={{ padding: '6px 10px', fontSize: '0.85rem' }} onClick={() => setFormType('self')}>
                      <PlusCircle size={16} /> New
                    </button>
                  </div>
                </div>

                {showSelfFilters && (
                  <FilterPanel filters={selfFilters} setFilters={setSelfFilters} availableRoles={selfRoles} />
                )}

                <ApplicationTable applications={selfApps} onAppClick={setSelectedApp} onDelete={handleDelete} />
              </div>
            </div>
          </main>
        </>
      ) : (
        <main>
          <CalendarView 
            applications={sortedApplications} 
            tasks={tasks}
            onAppClick={setSelectedApp} 
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onToggleTask={handleToggleTask}
          />
        </main>
      )}

      {isGoalFormOpen && (
        <GoalForm 
          initialGoal={goal} 
          onClose={() => setIsGoalFormOpen(false)} 
          onSubmit={handleGoalSave} 
        />
      )}

      {formType && (
        <ApplicationForm 
          onClose={() => setFormType(false)} 
          onSubmit={handleAddApplication} 
          initialType={formType}
        />
      )}

      {selectedApp && (
        <ApplicationDetails 
          app={selectedApp} 
          onClose={() => setSelectedApp(null)}
          onUpdateStatus={handleUpdateStatus}
        />
      )}

      {recentlyDeleted && (
        <div style={{
          position: 'fixed', bottom: '24px', left: '50%', transform: 'translateX(-50%)',
          background: '#ffffff', color: '#0f172a', padding: '12px 24px',
          borderRadius: '999px', display: 'flex', alignItems: 'center', gap: '16px', zIndex: 9999,
          boxShadow: '0 8px 32px rgba(0,0,0,0.4)', border: '2px solid var(--accent-cyan)'
        }}>
          <span>Deleted application for <strong>{recentlyDeleted.company}</strong></span>
          <button 
            onClick={handleUndoDelete}
            style={{ 
              background: 'var(--accent-cyan)', border: 'none', color: '#ffffff', 
              fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px',
              padding: '6px 14px', borderRadius: '999px'
            }}
          >
            <RotateCcw size={16} /> Undo
          </button>
        </div>
      )}
      </div>
    </div>
  );
}

export default App;
