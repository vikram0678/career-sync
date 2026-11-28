import { useState, useEffect, useRef, useMemo } from 'react';
import { PlusCircle, Briefcase, BarChart3, TrendingUp, Filter, LogOut, Moon, Sun, RotateCcw, User, ChevronDown, Download, Search, X, LayoutGrid, Table, Building2, Check } from 'lucide-react';
import { supabase } from './supabase';
import ApplicationForm from './components/ApplicationForm';
import ApplicationDetails from './components/ApplicationDetails';
import ApplicationTable from './components/ApplicationTable';
import CalendarView from './components/CalendarView';
import CompanyAvatar from './components/CompanyAvatar';
import GoalCountdown from './components/GoalCountdown';
import GoalForm from './components/GoalForm';
import ProfilePage from './components/ProfilePage';
import KanbanBoard from './components/KanbanBoard';
import { getTodayISO } from './utils/dateUtils';

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
    const empty = { startDate: '', endDate: '', salary: '', role: '', jobType: '' };
    setLocalFilters(empty);
    setFilters(empty);
  };

  return (
    <div
      className="glass"
      style={{
        padding: '16px 20px',
        borderRadius: '16px',
        marginBottom: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '14px',
        alignItems: 'flex-end',
        background: 'var(--glass-card)',
        border: '1px solid var(--glass-border)',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '130px' }}>
        <label style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
          Start Date
        </label>
        <input
          type="date"
          name="startDate"
          value={localFilters.startDate}
          onChange={handleChange}
          className="form-control"
          style={{ padding: '7px 10px', fontSize: '0.85rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '130px' }}>
        <label style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
          End Date
        </label>
        <input
          type="date"
          name="endDate"
          value={localFilters.endDate}
          onChange={handleChange}
          className="form-control"
          style={{ padding: '7px 10px', fontSize: '0.85rem' }}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '130px' }}>
        <label style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
          Role
        </label>
        <select
          name="role"
          value={localFilters.role}
          onChange={handleChange}
          className="form-control"
          style={{ padding: '7px 10px', fontSize: '0.85rem' }}
        >
          <option value="">All Roles</option>
          {availableRoles.map(r => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '130px' }}>
        <label style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
          Position Type
        </label>
        <select
          name="jobType"
          value={localFilters.jobType || ''}
          onChange={handleChange}
          className="form-control"
          style={{ padding: '7px 10px', fontSize: '0.85rem' }}
        >
          <option value="">All Types</option>
          <option value="job">💼 Full-Time Job</option>
          <option value="internship">🎓 Internship</option>
          <option value="contract">🤝 Contract</option>
        </select>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', flex: 1, minWidth: '120px' }}>
        <label style={{ fontSize: '0.72rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
          Min Salary
        </label>
        <input
          type="text"
          name="salary"
          value={localFilters.salary}
          onChange={handleChange}
          className="form-control"
          placeholder="e.g. 100k"
          style={{ padding: '7px 10px', fontSize: '0.85rem' }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '1px' }}>
        <button
          onClick={handleApply}
          className="btn btn-primary"
          style={{ padding: '7px 16px', fontSize: '0.84rem', fontWeight: '700' }}
        >
          Apply Filters
        </button>
        {Object.values(localFilters).some(v => v !== '') && (
          <button
            onClick={handleClear}
            className="btn btn-secondary"
            style={{ padding: '7px 14px', fontSize: '0.84rem' }}
          >
            Reset
          </button>
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
        redirectTo: window.location.origin
      }
    });
    if (error) console.error("Login error", error);
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      padding: '24px'
    }}>
      <div className="glass glass-panel" style={{
        textAlign: 'center',
        padding: '48px 36px',
        maxWidth: '460px',
        width: '100%',
        borderRadius: '28px',
        border: '1px solid rgba(56, 189, 248, 0.3)',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Brand Icon Halo */}
        <div style={{
          width: '64px',
          height: '64px',
          borderRadius: '18px',
          background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.35)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px auto',
          boxShadow: '0 0 24px rgba(56, 189, 248, 0.25)'
        }}>
          <Briefcase size={30} color="var(--accent-cyan)" />
        </div>

        <h1 style={{ marginBottom: '8px', fontSize: '2.4rem' }}>CareerSync</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '0.95rem', lineHeight: '1.5' }}>
          Your intelligent job tracker, interview preparation studio, and AI career copilot.
        </p>

        {/* Feature Highlights */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          textAlign: 'left',
          background: 'rgba(0, 0, 0, 0.15)',
          padding: '14px 18px',
          borderRadius: '14px',
          marginBottom: '28px',
          border: '1px solid var(--glass-border)',
          fontSize: '0.84rem',
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>✦</span>
            <span><strong>AI Magic Paste:</strong> Auto-parse job postings in 1 second</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-purple)', fontWeight: 'bold' }}>✦</span>
            <span><strong>Interactive Kanban:</strong> Drag & drop pipeline tracking</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ color: 'var(--accent-green)', fontWeight: 'bold' }}>✦</span>
            <span><strong>Interview Simulator:</strong> Predicted tech & STAR questions</span>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleLogin}
          style={{
            width: '100%',
            fontSize: '0.98rem',
            padding: '14px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            borderRadius: '14px'
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.89c2.28-2.1 3.65-5.2 3.65-9.12z" />
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.89-3.03c-1.08.72-2.45 1.16-4.04 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.13C3.26 21.43 7.34 24 12 24z" />
            <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.57H1.24C.45 8.14 0 9.97 0 12s.45 3.86 1.24 5.43l4.04-3.14z" />
            <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.57 1.24 6.57l4.04 3.14c.95-2.83 3.6-4.96 6.72-4.96z" />
          </svg>
          Continue with Google
        </button>
      </div>
    </div>
  );
}

const EXTENDED_SCHEMA_COLS = ['jobType', 'bond', 'rejectedDate'];
const unsupportedDbCols = new Set();
const pendingInsertsByAddedAt = new Map();

function getLocalAppMeta() {
  try {
    return JSON.parse(localStorage.getItem('career_sync_app_meta') || '{}');
  } catch {
    return {};
  }
}

function saveLocalAppMeta(id, meta) {
  if (!id || !meta) return;
  try {
    const map = getLocalAppMeta();
    map[id] = { ...(map[id] || {}), ...meta };
    localStorage.setItem('career_sync_app_meta', JSON.stringify(map));
  } catch { }
}

function getEnrichedAppMeta(app) {
  if (app.addedAt && pendingInsertsByAddedAt.has(app.addedAt)) {
    const pendingMeta = pendingInsertsByAddedAt.get(app.addedAt);
    saveLocalAppMeta(app.id, pendingMeta);
    pendingInsertsByAddedAt.delete(app.addedAt);
  }
  const localMeta = getLocalAppMeta();
  let localJobTypes = {};
  try { localJobTypes = JSON.parse(localStorage.getItem('career_sync_job_types') || '{}'); } catch { }
  const appMeta = localMeta[app.id] || {};
  return {
    jobType: app.jobType || appMeta.jobType || localJobTypes[app.id] || (/(intern|internship|co-op|trainee)/i.test(app.role) ? 'internship' : 'job'),
    bond: app.bond || appMeta.bond || '',
    rejectedDate: app.status === 'rejected' ? (app.rejectedDate || appMeta.rejectedDate || '') : ''
  };
}

/**
 * Executes a Supabase write while automatically stripping extended columns
 * that do not yet exist in the remote PostgreSQL schema (PGRST204),
 * caching discovered missing columns for subsequent writes in the session.
 */
async function executeWithSchemaFallback(runQuery, payload) {
  const sanitized = { ...payload };
  for (const col of unsupportedDbCols) {
    delete sanitized[col];
  }

  for (let attempt = 0; attempt <= EXTENDED_SCHEMA_COLS.length; attempt++) {
    const result = await runQuery(sanitized);
    const { error } = result;
    if (!error) return result;

    const msg = String(error.message || '');
    const isSchemaError = error.code === 'PGRST204' || EXTENDED_SCHEMA_COLS.some(col => msg.includes(col));
    if (!isSchemaError) return result;

    const match = msg.match(/Could not find the '([^']+)' column/);
    const missingCol = match?.[1];
    if (missingCol && EXTENDED_SCHEMA_COLS.includes(missingCol) && missingCol in sanitized) {
      unsupportedDbCols.add(missingCol);
      delete sanitized[missingCol];
      continue;
    }

    let strippedAny = false;
    for (const col of EXTENDED_SCHEMA_COLS) {
      if (col in sanitized) {
        unsupportedDbCols.add(col);
        delete sanitized[col];
        strippedAny = true;
      }
    }
    if (!strippedAny) return result;
  }

  return runQuery(sanitized);
}

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('dashboard');
  const [applications, setApplications] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [formType, setFormType] = useState(false);
  const [selectedApp, setSelectedApp] = useState(null);

  const [collegeFilters, setCollegeFilters] = useState({ startDate: '', endDate: '', salary: '', role: '', jobType: '' });
  const [selfFilters, setSelfFilters] = useState({ startDate: '', endDate: '', salary: '', role: '', jobType: '' });
  const [selectedJobType, setSelectedJobType] = useState('all');
  const [selectedCompany, setSelectedCompany] = useState('');
  const [isCompanyDropdownOpen, setIsCompanyDropdownOpen] = useState(false);
  const [companySearchQuery, setCompanySearchQuery] = useState('');
  const companyDropdownRef = useRef(null);

  const [showCollegeFilters, setShowCollegeFilters] = useState(false);
  const [showSelfFilters, setShowSelfFilters] = useState(false);

  const [goal, setGoal] = useState(() => {
    try {
      const saved = localStorage.getItem('career_sync_goal');
      return saved ? JSON.parse(saved) : { title: 'Land a Developer Role', targetDate: '2026-12-31T00:00' };
    } catch {
      return { title: 'Land a Developer Role', targetDate: '2026-12-31T00:00' };
    }
  });
  const [isGoalFormOpen, setIsGoalFormOpen] = useState(false);

  // Profile states
  const [profile, setProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('career_sync_profile');
      return saved ? JSON.parse(saved) : {
        headline: 'Software Engineer & Builder',
        githubUrl: '',
        linkedinUrl: '',
        portfolioUrl: '',
        targetSalary: '',
        skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL'],
        masterResumeUrl: '',
        masterResumeName: ''
      };
    } catch {
      return {
        headline: 'Software Engineer & Builder',
        githubUrl: '',
        linkedinUrl: '',
        portfolioUrl: '',
        targetSalary: '',
        skills: ['React', 'JavaScript', 'Node.js', 'PostgreSQL'],
        masterResumeUrl: '',
        masterResumeName: ''
      };
    }
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('career_sync_view_mode') || 'table';
  });
  const searchInputRef = useRef(null);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const profileHoverTimeoutRef = useRef(null);

  const handleProfileMouseEnter = () => {
    if (profileHoverTimeoutRef.current) {
      clearTimeout(profileHoverTimeoutRef.current);
    }
    setIsProfileMenuOpen(true);
  };

  const handleProfileMouseLeave = () => {
    profileHoverTimeoutRef.current = setTimeout(() => {
      setIsProfileMenuOpen(false);
    }, 250);
  };

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

  useEffect(() => {
    localStorage.setItem('career_sync_view_mode', viewMode);
  }, [viewMode]);

  // Global keyboard shortcuts (/ to search, n for new, esc to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      const activeEl = document.activeElement;
      const isInputActive = activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || activeEl.tagName === 'SELECT');

      if (e.key === 'Escape') {
        if (formType) setFormType(false);
        if (selectedApp) setSelectedApp(null);
        if (isGoalFormOpen) setIsGoalFormOpen(false);
        if (isCompanyDropdownOpen) setIsCompanyDropdownOpen(false);
        return;
      }

      if (isInputActive) return;

      if (e.key === '/') {
        e.preventDefault();
        if (activeTab !== 'dashboard') setActiveTab('dashboard');
        setTimeout(() => {
          searchInputRef.current?.focus();
        }, 50);
      }

      if (e.key === 'n' || e.key === 'N') {
        e.preventDefault();
        setFormType('self');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [formType, selectedApp, isGoalFormOpen, isCompanyDropdownOpen, activeTab]);

  // Click outside to close profile dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Click outside to close company dropdown popover
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (companyDropdownRef.current && !companyDropdownRef.current.contains(event.target)) {
        setIsCompanyDropdownOpen(false);
      }
    };
    if (isCompanyDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isCompanyDropdownOpen]);

  useEffect(() => {
    let applicationsChannel = null;

    const fetchApplications = async (userId) => {
      const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('userId', userId);
      if (data && !error) {
        const enriched = data.map(app => {
          const meta = getEnrichedAppMeta(app);
          return {
            ...app,
            jobType: meta.jobType,
            bond: meta.bond,
            rejectedDate: meta.rejectedDate
          };
        });
        setApplications(enriched);
      }
    };

    const fetchTasks = async (userId) => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('userId', userId);
      if (data && !error) setTasks(data);
    };

    const fetchPreferences = async (userId) => {
      try {
        const { data, error } = await supabase
          .from('user_preferences')
          .select('*')
          .eq('userId', userId)
          .maybeSingle();

        if (data && !error) {
          if (data.goal && data.goal.title && data.goal.targetDate) {
            setGoal(data.goal);
            localStorage.setItem('career_sync_goal', JSON.stringify(data.goal));
          }
          if (data.profile) {
            setProfile(data.profile);
            localStorage.setItem('career_sync_profile', JSON.stringify(data.profile));
          }
        }
      } catch (err) {
        console.warn("Could not fetch user preferences:", err);
      }
    };

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) setAuthLoading(false);
    }).catch(err => {
      console.warn("Auth getSession error:", err);
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      const currentUser = session?.user;
      setUser(currentUser);
      setAuthLoading(false);

      if (currentUser) {
        fetchApplications(currentUser.id);
        fetchTasks(currentUser.id);
        fetchPreferences(currentUser.id);

        if (applicationsChannel) {
          supabase.removeChannel(applicationsChannel);
        }

        applicationsChannel = supabase.channel(`public:applications:${currentUser.id}`)
          .on('postgres_changes', { event: '*', schema: 'public', table: 'applications', filter: `userId=eq.${currentUser.id}` }, () => {
            fetchApplications(currentUser.id);
          })
          .subscribe();
      } else {
        setApplications([]);
        setTasks([]);
        if (applicationsChannel) {
          supabase.removeChannel(applicationsChannel);
          applicationsChannel = null;
        }
      }
    });

    const INACTIVITY_LIMIT_MS = 24 * 60 * 60 * 1000; // 1 day in milliseconds

    const checkInactivity = () => {
      const lastActivity = localStorage.getItem('lastActivity');
      if (lastActivity && Date.now() - parseInt(lastActivity) > INACTIVITY_LIMIT_MS) {
        supabase.auth.signOut();
        localStorage.removeItem('lastActivity');
      }
    };

    // Check immediately on load (in case they haven't opened the site in a day)
    checkInactivity();

    // Set up activity tracking
    const updateActivity = () => {
      localStorage.setItem('lastActivity', Date.now().toString());
    };

    // Update activity on mount
    updateActivity();

    // Listen for user interactions to reset the 1-day timer
    window.addEventListener('mousemove', updateActivity, { passive: true });
    window.addEventListener('keydown', updateActivity, { passive: true });
    window.addEventListener('scroll', updateActivity, { passive: true });

    // Check periodically if the tab is left open
    const interval = setInterval(checkInactivity, 60000); // Check every minute

    return () => {
      subscription?.unsubscribe();
      if (applicationsChannel) supabase.removeChannel(applicationsChannel);
      window.removeEventListener('mousemove', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      clearInterval(interval);
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
      const normalizedRejectedDate = newApp.status === 'rejected'
        ? (newApp.rejectedDate || getTodayISO())
        : '';
      const addedAt = Date.now();

      pendingInsertsByAddedAt.set(addedAt, {
        jobType: newApp.jobType || 'job',
        bond: newApp.bond || '',
        rejectedDate: normalizedRejectedDate
      });

      const insertPayload = {
        ...newApp,
        rejectedDate: normalizedRejectedDate,
        resumeUrl: finalResumeUrl,
        screenshots: finalScreenshots,
        userId: user.id,
        addedAt
      };

      const { data, error } = await executeWithSchemaFallback(
        (payload) => supabase.from('applications').insert([payload]).select().single(),
        insertPayload
      );

      if (error) {
        pendingInsertsByAddedAt.delete(addedAt);
        throw error;
      }
      if (data) {
        pendingInsertsByAddedAt.delete(addedAt);
        const enriched = {
          ...data,
          jobType: data.jobType || newApp.jobType || 'job',
          bond: data.bond || newApp.bond || '',
          rejectedDate: normalizedRejectedDate
        };
        saveLocalAppMeta(data.id, {
          jobType: enriched.jobType,
          bond: enriched.bond,
          rejectedDate: enriched.rejectedDate
        });
        setApplications(prev => [enriched, ...prev.filter(a => a.id !== data.id)]);
      }
      setFormType(false);
    } catch (error) {
      console.error("Error adding application: ", error);
      throw new Error(error.message || "Failed to save application to database.");
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    const existingApp = applications.find(a => a.id === id);
    const prevRejectedDate = existingApp?.rejectedDate || '';
    const nextRejectedDate = newStatus === 'rejected'
      ? (prevRejectedDate || getTodayISO())
      : '';

    try {
      // Persist meta before remote update so Realtime events never overwrite with stale localStorage
      saveLocalAppMeta(id, { rejectedDate: nextRejectedDate });

      const { error } = await executeWithSchemaFallback(
        (payload) => supabase.from('applications').update(payload).eq('id', id),
        { status: newStatus, rejectedDate: nextRejectedDate }
      );
      if (error) throw error;

      setApplications(prev => prev.map(a => a.id === id ? { ...a, status: newStatus, rejectedDate: nextRejectedDate } : a));
      if (selectedApp && selectedApp.id === id) {
        setSelectedApp(prev => prev ? { ...prev, status: newStatus, rejectedDate: nextRejectedDate } : null);
      }
    } catch (error) {
      saveLocalAppMeta(id, { rejectedDate: prevRejectedDate });
      console.error("Error updating status: ", error);
    }
  };

  const handleUpdateApplication = async (updatedApp) => {
    const existingMeta = getLocalAppMeta()[updatedApp.id];
    const normalizedRejectedDate = updatedApp.status === 'rejected'
      ? (updatedApp.rejectedDate || getTodayISO())
      : '';
    const payloadWithRejected = {
      ...updatedApp,
      rejectedDate: normalizedRejectedDate
    };

    try {
      // Persist meta before remote update so Realtime events preserve edited fields
      saveLocalAppMeta(updatedApp.id, {
        jobType: payloadWithRejected.jobType || 'job',
        bond: payloadWithRejected.bond || '',
        rejectedDate: normalizedRejectedDate
      });

      const { error } = await executeWithSchemaFallback(
        (payload) => supabase.from('applications').update(payload).eq('id', updatedApp.id),
        payloadWithRejected
      );

      if (error) throw error;

      setApplications(prev => prev.map(a => a.id === updatedApp.id ? payloadWithRejected : a));
      if (selectedApp && selectedApp.id === updatedApp.id) {
        setSelectedApp(payloadWithRejected);
      }
    } catch (error) {
      if (existingMeta) saveLocalAppMeta(updatedApp.id, existingMeta);
      console.error("Error updating application: ", error);
      throw error;
    }
  };

  const handleDelete = async (app) => {
    try {
      const { error } = await supabase.from('applications').delete().eq('id', app.id);
      if (error) throw error;
      setApplications(prev => prev.filter(a => a.id !== app.id));
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
      const { data, error } = await executeWithSchemaFallback(
        (payload) => supabase.from('applications').insert([payload]).select().single(),
        recentlyDeleted
      );

      if (error) throw error;
      if (data) {
        const enriched = {
          ...data,
          jobType: data.jobType || recentlyDeleted.jobType || 'job',
          bond: data.bond || recentlyDeleted.bond || '',
          rejectedDate: data.rejectedDate || recentlyDeleted.rejectedDate || ''
        };
        saveLocalAppMeta(data.id, {
          jobType: enriched.jobType,
          bond: enriched.bond,
          rejectedDate: enriched.rejectedDate
        });
        setApplications(prev => [enriched, ...prev.filter(a => a.id !== data.id)]);
      }
      setRecentlyDeleted(null);
      if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
    } catch (err) {
      console.error("Error undoing", err);
    }
  };

  const handleGoalSave = async (newGoal) => {
    setGoal(newGoal);
    localStorage.setItem('career_sync_goal', JSON.stringify(newGoal));
    if (user) {
      try {
        const { data: existing } = await supabase
          .from('user_preferences')
          .select('id, profile')
          .eq('userId', user.id)
          .maybeSingle();

        if (existing?.id) {
          const { error: updateErr } = await supabase
            .from('user_preferences')
            .update({ goal: newGoal, profile: profile || existing.profile })
            .eq('id', existing.id);
          if (updateErr) {
            await supabase.from('user_preferences').update({ goal: newGoal }).eq('id', existing.id);
          }
        } else {
          const { error: insertErr } = await supabase
            .from('user_preferences')
            .insert([{ userId: user.id, goal: newGoal, profile }]);
          if (insertErr) {
            await supabase.from('user_preferences').insert([{ userId: user.id, goal: newGoal }]);
          }
        }
      } catch (error) {
        console.error("Error saving goal: ", error);
        try {
          await supabase.from('user_preferences').upsert([{ userId: user.id, goal: newGoal }], { onConflict: 'userId' });
        } catch (e) {
          console.error("Fallback upsert also failed: ", e);
        }
      }
    }
    setIsGoalFormOpen(false);
  };

  const handleSaveProfile = async (updatedProfile) => {
    setProfile(updatedProfile);
    localStorage.setItem('career_sync_profile', JSON.stringify(updatedProfile));
    if (user) {
      try {
        const { data: existing } = await supabase
          .from('user_preferences')
          .select('id, goal')
          .eq('userId', user.id)
          .maybeSingle();

        if (existing?.id) {
          const { error: updateErr } = await supabase
            .from('user_preferences')
            .update({ profile: updatedProfile, goal: goal || existing.goal })
            .eq('id', existing.id);
          if (updateErr) {
            await supabase.from('user_preferences').update({ profile: updatedProfile }).eq('id', existing.id);
          }
        } else {
          const { error: insertErr } = await supabase
            .from('user_preferences')
            .insert([{ userId: user.id, profile: updatedProfile, goal }]);
          if (insertErr) {
            await supabase.from('user_preferences').insert([{ userId: user.id, profile: updatedProfile }]);
          }
        }
      } catch (error) {
        console.error("Error saving profile: ", error);
        try {
          await supabase.from('user_preferences').upsert([{ userId: user.id, profile: updatedProfile }], { onConflict: 'userId' });
        } catch (e) {
          console.error("Fallback upsert profile also failed: ", e);
        }
      }
    }
  };

  const handleUploadMasterResume = async (file) => {
    if (!user) throw new Error("Not logged in");
    const fileExt = file.name.split('.').pop();
    const fileName = `master_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = `${user.id}/${fileName}`;
    const { error } = await supabase.storage.from('resumes').upload(filePath, file);
    if (error) throw error;
    const { data } = supabase.storage.from('resumes').getPublicUrl(filePath);
    return data.publicUrl;
  };

  const handleExportCSV = () => {
    if (!applications || applications.length === 0) {
      alert("No applications to export yet!");
      return;
    }
    const headers = ["Role", "Company", "Careers URL", "Gmail Thread", "Meeting Link", "Applied Date", "Status", "Rejected Date", "Salary", "Position Type", "Service Bond", "Track", "Resume Used"];
    const rows = applications.map(app => [
      `"${(app.role || '').replace(/"/g, '""')}"`,
      `"${(app.website || '').replace(/"/g, '""')}"`,
      `"${(app.careerPageUrl || '').replace(/"/g, '""')}"`,
      `"${(app.emailThreadUrl || '').replace(/"/g, '""')}"`,
      `"${(app.meetingUrl || '').replace(/"/g, '""')}"`,
      `"${app.appliedDate || ''}"`,
      `"${app.status || ''}"`,
      `"${app.status === 'rejected' ? (app.rejectedDate || '') : ''}"`,
      `"${(app.salary || '').replace(/"/g, '""')}"`,
      `"${app.jobType === 'internship' ? 'Internship' : app.jobType === 'contract' ? 'Contract' : 'Full-Time Job'}"`,
      `"${(app.bond || 'No Bond').replace(/"/g, '""')}"`,
      `"${app.applicationType === 'college' ? 'College' : 'Self'}"`,
      `"${(app.resumeUsed || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `CareerSync_Applications_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleAddTask = async (newTask) => {
    if (!user) return;
    const taskData = { ...newTask, userId: user.id, createdAt: Date.now() };
    delete taskData.id;
    try {
      const { data, error } = await supabase.from('tasks').insert([taskData]).select();
      if (!error && data) setTasks([...tasks, data[0]]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditTask = async (updatedTask) => {
    try {
      const { error } = await supabase.from('tasks').update({ title: updatedTask.title, time: updatedTask.time }).eq('id', updatedTask.id);
      if (!error) setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const { error } = await supabase.from('tasks').delete().eq('id', taskId);
      if (!error) setTasks(tasks.filter(t => t.id !== taskId));
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleTask = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    try {
      const { error } = await supabase.from('tasks').update({ completed: !task.completed }).eq('id', taskId);
      if (!error) {
        setTasks(tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = {
    total: applications.length,
    interviews: applications.filter(a => a.status === 'interview').length,
    offers: applications.filter(a => a.status === 'offer').length
  };

  const applyFilters = (apps, filters) => {
    return apps.filter(app => {
      const appJobType = app.jobType || 'job';
      if (selectedJobType !== 'all' && appJobType !== selectedJobType) return false;
      if (filters.jobType && appJobType !== filters.jobType) return false;
      if (selectedCompany && (app.website || 'Other').trim().toLowerCase() !== selectedCompany.toLowerCase()) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesSearch =
          (app.role && app.role.toLowerCase().includes(q)) ||
          (app.website && app.website.toLowerCase().includes(q)) ||
          (app.salary && app.salary.toLowerCase().includes(q)) ||
          (app.jobDescription && app.jobDescription.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }
      if (filters.startDate && new Date(app.appliedDate) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(app.appliedDate) > new Date(filters.endDate)) return false;
      if (filters.role && app.role !== filters.role) return false;
      // Basic text inclusion check for salary
      if (filters.salary && !(app.salary || '').toLowerCase().includes(filters.salary.toLowerCase())) return false;
      return true;
    });
  };

  const sortedApplications = [...applications].sort((a, b) => b.addedAt - a.addedAt);

  const uniqueCompanies = useMemo(() => {
    const map = {};
    sortedApplications.forEach(app => {
      const name = (app.website || 'Other').trim();
      if (!name) return;
      if (!map[name]) {
        map[name] = { count: 0, careerPageUrl: app.careerPageUrl };
      }
      map[name].count++;
    });
    return Object.entries(map)
      .map(([name, data]) => ({ name, count: data.count, url: data.careerPageUrl }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
  }, [sortedApplications]);

  const kanbanApps = sortedApplications.filter(app => {
    const appJobType = app.jobType || 'job';
    if (selectedJobType !== 'all' && appJobType !== selectedJobType) return false;
    if (selectedCompany && (app.website || 'Other').trim().toLowerCase() !== selectedCompany.toLowerCase()) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        (app.role && app.role.toLowerCase().includes(q)) ||
        (app.website && app.website.toLowerCase().includes(q)) ||
        (app.salary && app.salary.toLowerCase().includes(q)) ||
        (app.jobDescription && app.jobDescription.toLowerCase().includes(q));
      if (!matchesSearch) return false;
    }
    return true;
  });

  const scopedAppsForCounts = selectedCompany
    ? sortedApplications.filter(a => (a.website || 'Other').trim().toLowerCase() === selectedCompany.toLowerCase())
    : sortedApplications;

  const jobTypeCounts = {
    all: scopedAppsForCounts.length,
    job: scopedAppsForCounts.filter(a => (a.jobType || 'job') === 'job').length,
    internship: scopedAppsForCounts.filter(a => a.jobType === 'internship').length,
    contract: scopedAppsForCounts.filter(a => a.jobType === 'contract').length
  };

  const rawCollegeApps = sortedApplications.filter(a => a.applicationType === 'college');
  const collegeApps = applyFilters(rawCollegeApps, collegeFilters);
  const collegeRoles = Array.from(new Set(rawCollegeApps.map(a => a.role)));

  const rawSelfApps = sortedApplications.filter(a => a.applicationType === 'self' || !a.applicationType);
  const selfApps = applyFilters(rawSelfApps, selfFilters);
  const selfRoles = Array.from(new Set(rawSelfApps.map(a => a.role)));

  if (authLoading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: 'var(--bg-base)',
        color: 'var(--text-main)',
        gap: '14px'
      }}>
        <div style={{
          width: '32px',
          height: '32px',
          border: '3px solid var(--border-color)',
          borderTopColor: 'var(--accent-cyan)',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <span style={{ fontSize: '0.92rem', fontWeight: '600', color: 'var(--text-muted)', letterSpacing: '-0.01em' }}>
          Loading CareerSync...
        </span>
      </div>
    );
  }
  if (!user) return <LoginScreen />;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <nav style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: 'var(--glass-bg)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid var(--border-color)',
        padding: '0 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '62px',
        boxShadow: 'var(--shadow-sm)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
          <h1 style={{ margin: 0, fontSize: '1.35rem', letterSpacing: '-0.03em', fontWeight: '800' }}>CareerSync</h1>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.7rem',
            fontWeight: '700',
            padding: '2px 8px',
            borderRadius: '999px',
            background: 'rgba(56, 189, 248, 0.1)',
            color: 'var(--accent-cyan)',
            border: '1px solid rgba(56, 189, 248, 0.25)'
          }}>
            <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: 'var(--accent-cyan)' }} />
            Live Sync
          </span>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', flex: 1 }}>
          <div style={{
            display: 'flex',
            background: 'var(--glass-card)',
            padding: '3px',
            borderRadius: '11px',
            width: '360px',
            justifyContent: 'space-between',
            gap: '3px',
            border: '1px solid var(--border-color)'
          }}>
            <button
              onClick={() => setActiveTab('dashboard')}
              style={{
                background: activeTab === 'dashboard' ? 'var(--glass-bg)' : 'transparent',
                color: activeTab === 'dashboard' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 0',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1,
                boxShadow: activeTab === 'dashboard' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('calendar')}
              style={{
                background: activeTab === 'calendar' ? 'var(--glass-bg)' : 'transparent',
                color: activeTab === 'calendar' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 0',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1,
                boxShadow: activeTab === 'calendar' ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Calendar
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              style={{
                background: (activeTab === 'profile' || activeTab === 'analytics') ? 'var(--glass-bg)' : 'transparent',
                color: (activeTab === 'profile' || activeTab === 'analytics') ? 'var(--accent-cyan)' : 'var(--text-muted)',
                border: 'none',
                padding: '8px 0',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                flex: 1,
                boxShadow: (activeTab === 'profile' || activeTab === 'analytics') ? 'var(--shadow-sm)' : 'none'
              }}
            >
              Profile & AI
            </button>
          </div>
        </div>

        <div
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px', flex: 1, position: 'relative' }}
          ref={profileMenuRef}
          onMouseEnter={handleProfileMouseEnter}
          onMouseLeave={handleProfileMouseLeave}
        >
          {/* Theme Quick Toggle */}
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="btn btn-secondary"
            style={{ padding: '8px', minWidth: 'auto', background: 'var(--glass-bg)', border: 'none', boxShadow: 'none' }}
            title="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} color="var(--accent-orange)" /> : <Moon size={18} color="var(--text-muted)" />}
          </button>

          {/* Interactive User Profile Trigger (Hover preview + Click to open Profile page) */}
          <div
            onClick={() => {
              setActiveTab('profile');
              setIsProfileMenuOpen(false);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '4px 12px 4px 4px',
              borderRadius: '999px',
              background: (activeTab === 'profile' || isProfileMenuOpen) ? 'var(--glass-highlight)' : 'var(--glass-bg)',
              cursor: 'pointer',
              border: '1px solid var(--glass-border)',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
            title="Click to open full Career Profile & Analytics Page"
          >
            <img
              src={user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User'}
              alt="Profile"
              style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
            />
            <span style={{ fontWeight: '700', color: 'var(--text-main)', fontSize: '0.9rem' }}>
              {user.user_metadata?.full_name?.split(' ')[0] || 'Profile'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" style={{ transform: isProfileMenuOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
          </div>

          {/* Profile Hover Dropdown Preview Card */}
          {isProfileMenuOpen && (
            <div
              className="glass glass-panel profile-dropdown-menu"
              onMouseEnter={handleProfileMouseEnter}
              onMouseLeave={handleProfileMouseLeave}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--border-color)' }}>
                <img
                  src={user.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User'}
                  alt="Profile"
                  style={{ width: '42px', height: '42px', borderRadius: '50%', border: '2px solid var(--accent-cyan)' }}
                />
                <div style={{ overflow: 'hidden', flex: 1 }}>
                  <div style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.95rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
                    {user.user_metadata?.full_name || 'User'}
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {user.email}
                  </div>
                </div>
              </div>

              {profile.headline && (
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', padding: '8px 0 4px 0', fontWeight: '600', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  💼 {profile.headline}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px' }}>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setActiveTab('profile');
                    setIsProfileMenuOpen(false);
                  }}
                  style={{ fontWeight: '700', color: 'var(--accent-cyan)' }}
                >
                  <User size={16} color="var(--accent-cyan)" /> Open Full Profile & Analytics Page
                </button>

                <button
                  className="dropdown-item"
                  onClick={() => {
                    handleExportCSV();
                    setIsProfileMenuOpen(false);
                  }}
                >
                  <Download size={16} color="var(--accent-green)" /> Export Applications (.CSV)
                </button>

                <div style={{ height: '1px', background: 'var(--border-color)', margin: '4px 0' }} />

                <button
                  className="dropdown-item"
                  style={{ color: '#ef4444' }}
                  onClick={() => supabase.auth.signOut()}
                >
                  <LogOut size={16} color="#ef4444" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      <div className="app-container" style={{ flex: 1 }}>

        {activeTab === 'dashboard' ? (
          <>
            <GoalCountdown goal={goal} onEditClick={() => setIsGoalFormOpen(true)} />
            <div className="stats-container">
              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="stat-label">Total Pipeline</span>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <Briefcase size={18} color="var(--accent-cyan)" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                  <span className="stat-value">{stats.total}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>tracked applications</span>
                </div>
              </div>

              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="stat-label">Interview Rounds</span>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <BarChart3 size={18} color="var(--accent-purple)" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                  <span className="stat-value">{stats.interviews}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>active stages</span>
                </div>
              </div>

              <div className="stat-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="stat-label">Offers Landed</span>
                  <div style={{
                    width: '36px', height: '36px', borderRadius: '10px',
                    background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}>
                    <TrendingUp size={18} color="var(--accent-green)" />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '2px' }}>
                  <span className="stat-value" style={{ color: 'var(--accent-green)' }}>{stats.offers}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>secured</span>
                </div>
              </div>
            </div>

            <main>
              {/* Controls Header: Global Search Bar + View Mode Switcher */}
              <div style={{ margin: '16px 0 20px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ position: 'relative', flex: 1, minWidth: '280px' }}>
                  <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search applications across role, company, salary, or JD... (Press '/' to focus)"
                    className="form-control"
                    style={{
                      padding: '12px 42px 12px 46px',
                      borderRadius: '12px',
                      background: 'var(--glass-bg)',
                      backdropFilter: 'blur(12px)',
                      border: '1px solid var(--glass-border)',
                      fontSize: '0.95rem',
                      color: 'var(--text-main)',
                      width: '100%'
                    }}
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      style={{
                        position: 'absolute',
                        right: '14px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center'
                      }}
                      title="Clear search"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  {/* Job Type Segmented Filter Pills */}
                  <div style={{
                    display: 'flex',
                    background: 'var(--glass-border)',
                    padding: '3px',
                    borderRadius: '10px',
                    gap: '2px'
                  }}>
                    {[
                      { id: 'all', label: 'All', count: jobTypeCounts.all },
                      { id: 'job', label: '💼 Jobs', count: jobTypeCounts.job },
                      { id: 'internship', label: '🎓 Internships', count: jobTypeCounts.internship },
                      { id: 'contract', label: '🤝 Contract', count: jobTypeCounts.contract }
                    ].map(tab => {
                      const isActive = selectedJobType === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedJobType(tab.id)}
                          style={{
                            padding: '7px 12px',
                            fontSize: '0.82rem',
                            background: isActive ? 'var(--glass-bg)' : 'transparent',
                            color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                            fontWeight: isActive ? '800' : '600',
                            borderRadius: '8px',
                            border: 'none',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            cursor: 'pointer',
                            boxShadow: isActive ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                            transition: 'all 0.2s ease'
                          }}
                          title={`Filter by ${tab.label}`}
                        >
                          <span>{tab.label}</span>
                          <span style={{
                            fontSize: '0.72rem',
                            padding: '1px 6px',
                            borderRadius: '999px',
                            background: isActive ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                            color: isActive ? 'var(--accent-cyan)' : 'var(--text-muted)',
                            fontWeight: '700'
                          }}>
                            {tab.count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Interactive Company Filter Dropdown */}
                  <div ref={companyDropdownRef} style={{ position: 'relative' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setIsCompanyDropdownOpen(prev => !prev);
                        setCompanySearchQuery('');
                      }}
                      style={{
                        padding: '7px 12px',
                        fontSize: '0.82rem',
                        background: selectedCompany
                          ? 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(168, 85, 247, 0.2) 100%)'
                          : 'var(--glass-bg)',
                        border: selectedCompany
                          ? '1px solid rgba(56, 189, 248, 0.45)'
                          : '1px solid var(--glass-border)',
                        color: selectedCompany ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        fontWeight: selectedCompany ? '800' : '600',
                        borderRadius: '9px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: selectedCompany ? '0 2px 8px rgba(56, 189, 248, 0.15)' : 'none',
                        transition: 'all 0.2s ease',
                        whiteSpace: 'nowrap'
                      }}
                      title={selectedCompany ? `Filtered by ${selectedCompany}. Click to change or clear.` : 'Filter by Company'}
                    >
                      <Building2 size={14} color={selectedCompany ? 'var(--accent-cyan)' : 'var(--text-muted)'} />
                      <span>{selectedCompany ? selectedCompany : `${uniqueCompanies.length} Companies`}</span>
                      {selectedCompany ? (
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompany('');
                          }}
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '16px',
                            height: '16px',
                            borderRadius: '50%',
                            background: 'rgba(56, 189, 248, 0.25)',
                            marginLeft: '2px',
                            cursor: 'pointer'
                          }}
                          title="Clear company filter"
                        >
                          <X size={11} />
                        </span>
                      ) : (
                        <ChevronDown
                          size={13}
                          style={{
                            transform: isCompanyDropdownOpen ? 'rotate(180deg)' : 'none',
                            transition: 'transform 0.2s ease',
                            opacity: 0.7
                          }}
                        />
                      )}
                    </button>

                    {/* Dropdown Popover */}
                    {isCompanyDropdownOpen && (
                      <div
                        className="glass glass-panel"
                        style={{
                          position: 'absolute',
                          top: 'calc(100% + 8px)',
                          right: 0,
                          zIndex: 1050,
                          width: '270px',
                          maxHeight: '340px',
                          borderRadius: '14px',
                          background: 'var(--glass-bg)',
                          backdropFilter: 'blur(20px)',
                          WebkitBackdropFilter: 'blur(20px)',
                          border: '1px solid var(--glass-border)',
                          boxShadow: '0 14px 35px rgba(0, 0, 0, 0.35), 0 0 1px rgba(255, 255, 255, 0.15)',
                          display: 'flex',
                          flexDirection: 'column',
                          overflow: 'hidden'
                        }}
                      >
                        {/* Popover Header */}
                        <div style={{
                          padding: '12px 14px 10px 14px',
                          borderBottom: '1px solid var(--border-color)',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px',
                          background: 'rgba(255, 255, 255, 0.02)'
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '0.78rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                              Targeted Companies
                            </span>
                            <span style={{
                              fontSize: '0.7rem',
                              fontWeight: '700',
                              padding: '1px 6px',
                              borderRadius: '999px',
                              background: 'rgba(56, 189, 248, 0.12)',
                              color: 'var(--accent-cyan)'
                            }}>
                              {uniqueCompanies.length} Total
                            </span>
                          </div>

                          {/* Quick Search inside companies if > 4 */}
                          {uniqueCompanies.length > 4 && (
                            <div style={{ position: 'relative' }}>
                              <Search size={13} style={{ position: 'absolute', left: '8px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                              <input
                                type="text"
                                value={companySearchQuery}
                                onChange={(e) => setCompanySearchQuery(e.target.value)}
                                placeholder="Search companies..."
                                style={{
                                  width: '100%',
                                  padding: '6px 26px 6px 28px',
                                  fontSize: '0.8rem',
                                  borderRadius: '8px',
                                  background: 'var(--glass-card)',
                                  border: '1px solid var(--border-color)',
                                  color: 'var(--text-main)',
                                  outline: 'none'
                                }}
                                autoFocus
                              />
                              {companySearchQuery && (
                                <X
                                  size={13}
                                  onClick={() => setCompanySearchQuery('')}
                                  style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}
                                />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Companies List */}
                        <div style={{ overflowY: 'auto', maxHeight: '240px', padding: '6px' }}>
                          {/* All Companies Reset Option */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedCompany('');
                              setIsCompanyDropdownOpen(false);
                            }}
                            style={{
                              width: '100%',
                              padding: '8px 10px',
                              borderRadius: '8px',
                              border: 'none',
                              background: !selectedCompany ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                              color: !selectedCompany ? 'var(--accent-cyan)' : 'var(--text-main)',
                              fontWeight: !selectedCompany ? '700' : '500',
                              fontSize: '0.82rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              textAlign: 'left',
                              transition: 'background 0.15s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '24px',
                                height: '24px',
                                borderRadius: '6px',
                                background: 'rgba(255, 255, 255, 0.08)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '0.72rem',
                                fontWeight: '700'
                              }}>
                                🌐
                              </div>
                              <span>All Companies</span>
                            </div>
                            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: '600' }}>
                              {sortedApplications.length}
                            </span>
                          </button>

                          {/* Filtered Company Items */}
                          {uniqueCompanies
                            .filter(c => !companySearchQuery.trim() || c.name.toLowerCase().includes(companySearchQuery.toLowerCase().trim()))
                            .map(c => {
                              const isSelected = selectedCompany.toLowerCase() === c.name.toLowerCase();
                              return (
                                <button
                                  key={c.name}
                                  type="button"
                                  onClick={() => {
                                    setSelectedCompany(isSelected ? '' : c.name);
                                    setIsCompanyDropdownOpen(false);
                                  }}
                                  style={{
                                    width: '100%',
                                    padding: '7px 10px',
                                    borderRadius: '8px',
                                    border: 'none',
                                    background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                                    color: isSelected ? 'var(--accent-cyan)' : 'var(--text-main)',
                                    fontWeight: isSelected ? '700' : '500',
                                    fontSize: '0.82rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    cursor: 'pointer',
                                    textAlign: 'left',
                                    transition: 'background 0.12s ease'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                                    <CompanyAvatar company={c.name} url={c.url} size={24} borderRadius={6} />
                                    <span style={{
                                      whiteSpace: 'nowrap',
                                      overflow: 'hidden',
                                      textOverflow: 'ellipsis',
                                      maxWidth: '150px'
                                    }}>
                                      {c.name}
                                    </span>
                                  </div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{
                                      fontSize: '0.7rem',
                                      padding: '1px 6px',
                                      borderRadius: '999px',
                                      background: isSelected ? 'rgba(56, 189, 248, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                                      color: isSelected ? 'var(--accent-cyan)' : 'var(--text-muted)',
                                      fontWeight: '700'
                                    }}>
                                      {c.count}
                                    </span>
                                    {isSelected && <Check size={13} color="var(--accent-cyan)" />}
                                  </div>
                                </button>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                  {searchQuery && (
                    <div style={{ fontSize: '0.85rem', color: 'var(--accent-cyan)', fontWeight: '700', whiteSpace: 'nowrap' }}>
                      {viewMode === 'kanban' ? kanbanApps.length : (collegeApps.length + selfApps.length)} match{(viewMode === 'kanban' ? kanbanApps.length : (collegeApps.length + selfApps.length)) === 1 ? '' : 'es'}
                    </div>
                  )}

                  {/* View Mode Switcher */}
                  <div style={{
                    display: 'flex',
                    background: 'var(--glass-border)',
                    padding: '3px',
                    borderRadius: '10px',
                    gap: '2px'
                  }}>
                    <button
                      onClick={() => setViewMode('table')}
                      style={{
                        padding: '7px 14px',
                        fontSize: '0.82rem',
                        background: viewMode === 'table' ? 'var(--glass-bg)' : 'transparent',
                        color: viewMode === 'table' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        fontWeight: '700',
                        borderRadius: '8px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: viewMode === 'table' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                      title="Split Columns Table View"
                    >
                      <Table size={15} /> Table
                    </button>
                    <button
                      onClick={() => setViewMode('kanban')}
                      style={{
                        padding: '7px 14px',
                        fontSize: '0.82rem',
                        background: viewMode === 'kanban' ? 'var(--glass-bg)' : 'transparent',
                        color: viewMode === 'kanban' ? 'var(--accent-purple)' : 'var(--text-muted)',
                        fontWeight: '700',
                        borderRadius: '8px',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        cursor: 'pointer',
                        boxShadow: viewMode === 'kanban' ? '0 2px 6px rgba(0,0,0,0.08)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                      title="Interactive Drag-and-Drop Pipeline Board"
                    >
                      <LayoutGrid size={15} /> Pipeline
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === 'kanban' ? (
                <KanbanBoard
                  applications={kanbanApps}
                  onAppClick={setSelectedApp}
                  onUpdateStatus={handleUpdateStatus}
                  onDelete={handleDelete}
                />
              ) : (
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
              )}
            </main>
          </>
        ) : activeTab === 'calendar' ? (
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
        ) : (
          <main>
            <ProfilePage
              user={user}
              profile={profile}
              applications={sortedApplications}
              onSaveProfile={handleSaveProfile}
              onUploadResume={handleUploadMasterResume}
              onExportCSV={handleExportCSV}
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
            profile={profile}
          />
        )}

        {selectedApp && (
          <ApplicationDetails
            app={selectedApp}
            onClose={() => setSelectedApp(null)}
            onUpdateStatus={handleUpdateStatus}
            onUpdateApplication={handleUpdateApplication}
            profile={profile}
            user={user}
          />
        )}

        {recentlyDeleted && (
          <div className="top-toast-banner">
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', fontSize: '0.88rem' }}>
              <span style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 8px rgba(239, 68, 68, 0.7)',
                flexShrink: 0
              }} />
              <span style={{ color: 'var(--text-muted)' }}>
                Deleted application for{' '}
                <strong style={{ color: 'var(--text-main)', fontWeight: '700' }}>
                  {recentlyDeleted.website || recentlyDeleted.company || recentlyDeleted.role || 'Application'}
                </strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button
                type="button"
                onClick={handleUndoDelete}
                style={{
                  background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  fontWeight: '700',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 14px',
                  borderRadius: '999px',
                  boxShadow: '0 2px 8px rgba(2, 132, 199, 0.35)',
                  transition: 'transform 0.15s ease, box-shadow 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.04)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(2, 132, 199, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(2, 132, 199, 0.35)';
                }}
              >
                <RotateCcw size={13} strokeWidth={2.5} /> Undo
              </button>

              <button
                type="button"
                onClick={() => {
                  setRecentlyDeleted(null);
                  if (deleteTimerRef.current) clearTimeout(deleteTimerRef.current);
                }}
                title="Dismiss"
                style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'color 0.15s ease, background 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = 'var(--text-main)';
                  e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = 'var(--text-muted)';
                  e.currentTarget.style.background = 'transparent';
                }}
              >
                <X size={14} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
