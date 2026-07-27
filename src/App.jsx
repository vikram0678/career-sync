import { useState, useEffect } from 'react';
import { PlusCircle, Briefcase, BarChart3, TrendingUp, Filter } from 'lucide-react';
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

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formType, setFormType] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);
  
  const [goal, setGoal] = useState({ title: 'Land a Developer Role', targetDate: '2026-12-31T00:00' });
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);

  const [collegeFilters, setCollegeFilters] = useState({ startDate: '', endDate: '', salary: '', role: '' });
  const [selfFilters, setSelfFilters] = useState({ startDate: '', endDate: '', salary: '', role: '' });
  
  const [showCollegeFilters, setShowCollegeFilters] = useState(false);
  const [showSelfFilters, setShowSelfFilters] = useState(false);

  useEffect(() => {
    setApplications([
      {
        id: '1',
        addedAt: 1,
        applicationType: 'college',
        role: 'Frontend Engineer Intern',
        website: 'Google (Campus)',
        careerPageUrl: 'https://careers.google.com/',
        resumeUsed: 'Resume_v3_Tech.pdf',
        appliedDate: '2026-07-20',
        jobDescription: 'Build beautiful UIs...',
        status: 'applied',
        salary: '120k',
        screenshots: []
      },
      {
        id: '2',
        addedAt: 2,
        applicationType: 'self',
        role: 'Full Stack Developer',
        website: 'LinkedIn (Startup)',
        careerPageUrl: 'https://linkedin.com/jobs/view/12345',
        resumeUsed: 'Resume_v4_FullStack.pdf',
        appliedDate: '2026-07-15',
        jobDescription: 'Seeking a Full Stack Developer...',
        status: 'interview',
        salary: '140k',
        screenshots: []
      },
      {
        id: '3',
        addedAt: 3,
        applicationType: 'self',
        role: 'Associate Engineer - AI/ML with Python',
        website: 'HARMAN',
        careerPageUrl: 'https://jobsearch.harman.com/en_US/careers/ApplicationReview?jobId=32407',
        resumeUsed: '',
        appliedDate: new Date().toISOString().split('T')[0],
        jobDescription: 'Applied using protocol websites / job portal.',
        status: 'applied',
        salary: '',
        screenshots: []
      }
    ]);
    
    setTasks([
      { id: 't1', title: 'Follow up with Google recruiter', date: '2026-07-22', time: '10:00', completed: true },
      { id: 't2', title: 'Prepare for LinkedIn interview', date: '2026-07-16', time: '14:30', completed: false }
    ]);
  }, []);

  const handleAddApplication = (newApp) => {
    const appToAdd = { ...newApp, addedAt: Date.now() };
    setApplications([appToAdd, ...applications]);
    setFormType(false);
  };

  const handleUpdateStatus = (id, newStatus) => {
    setApplications(apps => apps.map(app => 
      app.id === id ? { ...app, status: newStatus } : app
    ));
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
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

  return (
    <div className="app-container">
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>CareerSync</h1>
        <div style={{ display: 'flex', gap: '8px', background: 'rgba(0,0,0,0.2)', padding: '4px', borderRadius: '8px' }}>
          <button 
            className={`btn ${activeTab === 'dashboard' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', border: 'none' }}
            onClick={() => setActiveTab('dashboard')}
          >
            Dashboard
          </button>
          <button 
            className={`btn ${activeTab === 'calendar' ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '8px 16px', border: 'none' }}
            onClick={() => setActiveTab('calendar')}
          >
            Calendar
          </button>
        </div>
      </header>

      <GoalCountdown goal={goal} onEditClick={() => setIsGoalFormOpen(true)} />

      {activeTab === 'dashboard' ? (
        <>
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
                
                <ApplicationTable applications={collegeApps} onAppClick={setSelectedApp} />
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

                <ApplicationTable applications={selfApps} onAppClick={setSelectedApp} />
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
          onSubmit={(newGoal) => { setGoal(newGoal); setIsGoalFormOpen(false); }} 
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
    </div>
  );
}

export default App;
