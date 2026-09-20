import { useState, useMemo } from 'react';
import { 
  FileText, 
  Globe, 
  Download, 
  Eye, 
  Check, 
  Copy, 
  Sparkles, 
  TrendingUp, 
  Flame, 
  Award, 
  BarChart3, 
  GraduationCap, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Info,
  ChevronDown,
  Edit3,
  X,
  UploadCloud,
  ExternalLink,
  Bot,
  EyeOff
} from 'lucide-react';
import { getGeminiApiKey, setGeminiApiKey, hasGeminiApiKey } from '../services/aiService';

function ProfilePage({ 
  user, 
  profile = {}, 
  applications = [], 
  onSaveProfile, 
  onUploadResume, 
  onExportCSV 
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    headline: profile.headline || 'Software Engineer & Builder',
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    portfolioUrl: profile.portfolioUrl || '',
    targetSalary: profile.targetSalary || '',
    skills: profile.skills || ['React', 'JavaScript', 'Node.js', 'PostgreSQL'],
    masterResumeUrl: profile.masterResumeUrl || '',
    masterResumeName: profile.masterResumeName || ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewingResume, setPreviewingResume] = useState(false);
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState(null);
  const [selectedYearView, setSelectedYearView] = useState('Current');
  const [geminiKey, setGeminiKey] = useState(() => getGeminiApiKey());
  const [showKey, setShowKey] = useState(false);
  const [keySaveSuccess, setKeySaveSuccess] = useState(false);

  const handleSaveGeminiKey = (e) => {
    e?.preventDefault();
    setGeminiApiKey(geminiKey);
    setKeySaveSuccess(true);
    setTimeout(() => setKeySaveSuccess(false), 3000);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      const updatedSkills = [...formData.skills, newSkill.trim()];
      setFormData({
        ...formData,
        skills: updatedSkills
      });
      setNewSkill('');
      onSaveProfile({ ...formData, skills: updatedSkills });
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    const updatedSkills = formData.skills.filter(s => s !== skillToRemove);
    setFormData({
      ...formData,
      skills: updatedSkills
    });
    onSaveProfile({ ...formData, skills: updatedSkills });
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleResumeFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const publicUrl = await onUploadResume(file);
      const updated = {
        ...formData,
        masterResumeUrl: publicUrl,
        masterResumeName: file.name
      };
      setFormData(updated);
      await onSaveProfile(updated);
    } catch (err) {
      console.error("Resume upload error:", err);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile(formData);
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to save profile", err);
      alert("Failed to save profile changes.");
    } finally {
      setIsSaving(false);
    }
  };

  // 1. Funnel & KPI Calculations
  const metrics = useMemo(() => {
    const total = applications.length;
    const interviews = applications.filter(a => a.status === 'interview').length;
    const offers = applications.filter(a => a.status === 'offer').length;
    const rejected = applications.filter(a => a.status === 'rejected').length;
    const appliedPending = applications.filter(a => a.status === 'applied').length;

    const interviewRate = total > 0 ? ((interviews + offers) / total * 100).toFixed(1) : 0;
    const offerRate = total > 0 ? (offers / total * 100).toFixed(1) : 0;
    const rejectionRate = total > 0 ? (rejected / total * 100).toFixed(1) : 0;

    const collegeApps = applications.filter(a => a.applicationType === 'college');
    const selfApps = applications.filter(a => a.applicationType === 'self' || !a.applicationType);

    const collegeInterviews = collegeApps.filter(a => a.status === 'interview' || a.status === 'offer').length;
    const collegeOffers = collegeApps.filter(a => a.status === 'offer').length;
    const collegeRate = collegeApps.length > 0 ? ((collegeInterviews / collegeApps.length) * 100).toFixed(1) : 0;

    const selfInterviews = selfApps.filter(a => a.status === 'interview' || a.status === 'offer').length;
    const selfOffers = selfApps.filter(a => a.status === 'offer').length;
    const selfRate = selfApps.length > 0 ? ((selfInterviews / selfApps.length) * 100).toFixed(1) : 0;

    const roleCounts = {};
    applications.forEach(a => {
      if (a.role) {
        roleCounts[a.role] = (roleCounts[a.role] || 0) + 1;
      }
    });
    const topRoles = Object.entries(roleCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);

    return {
      total,
      interviews,
      offers,
      rejected,
      appliedPending,
      interviewRate,
      offerRate,
      rejectionRate,
      college: {
        total: collegeApps.length,
        interviews: collegeInterviews,
        offers: collegeOffers,
        rate: collegeRate,
        salaries: collegeApps.map(a => a.salary).filter(Boolean)
      },
      self: {
        total: selfApps.length,
        interviews: selfInterviews,
        offers: selfOffers,
        rate: selfRate,
        salaries: selfApps.map(a => a.salary).filter(Boolean)
      },
      topRoles
    };
  }, [applications]);

  // 2. LeetCode-Style 1-Year (12 Months) Activity Heatmap Matrix
  const leetCodeHeatmap = useMemo(() => {
    const today = new Date();
    const currentYear = today.getFullYear();
    const currentMonth = today.getMonth();

    const appCountByDate = {};
    const appDetailsByDate = {};

    applications.forEach(app => {
      if (app.appliedDate) {
        appCountByDate[app.appliedDate] = (appCountByDate[app.appliedDate] || 0) + 1;
        if (!appDetailsByDate[app.appliedDate]) {
          appDetailsByDate[app.appliedDate] = [];
        }
        appDetailsByDate[app.appliedDate].push(app);
      }
    });

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthsData = [];

    let totalPastYearSubmissions = 0;
    const allActiveDateStrings = new Set();

    for (let m = 11; m >= 0; m--) {
      const monthDate = new Date(currentYear, currentMonth - m, 1);
      const y = monthDate.getFullYear();
      const mIdx = monthDate.getMonth();
      const monthName = monthNames[mIdx];

      const daysInMonth = new Date(y, mIdx + 1, 0).getDate();
      const firstDayOfWeek = new Date(y, mIdx, 1).getDay();

      const days = [];
      for (let pad = 0; pad < firstDayOfWeek; pad++) {
        days.push({ isPadding: true });
      }

      for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${y}-${String(mIdx + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const count = appCountByDate[dateStr] || 0;
        if (count > 0) {
          totalPastYearSubmissions += count;
          allActiveDateStrings.add(dateStr);
        }
        days.push({
          isPadding: false,
          date: dateStr,
          dayNumber: d,
          count,
          apps: appDetailsByDate[dateStr] || []
        });
      }

      monthsData.push({
        monthName,
        year: y,
        days
      });
    }

    const totalActiveDays = allActiveDateStrings.size;

    let currentStreak = 0;
    let maxStreak = 0;
    let tempStreak = 0;

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if ((appCountByDate[dateStr] || 0) > 0) {
        tempStreak++;
        if (tempStreak > maxStreak) maxStreak = tempStreak;
      } else {
        tempStreak = 0;
      }
    }

    let checking = true;
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      if ((appCountByDate[dateStr] || 0) > 0) {
        if (checking) currentStreak++;
      } else {
        if (i === 0) continue;
        checking = false;
        break;
      }
    }

    return {
      monthsData,
      totalPastYearSubmissions,
      totalActiveDays,
      maxStreak,
      currentStreak
    };
  }, [applications]);

  const getLeetCodeColorClass = (count) => {
    if (count === 0) return 'lc-cell-0';
    if (count === 1) return 'lc-cell-1';
    if (count === 2) return 'lc-cell-2';
    if (count === 3) return 'lc-cell-3';
    return 'lc-cell-4';
  };

  return (
    <div className="profile-page-container" style={{ display: 'flex', flexDirection: 'column', gap: '28px', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      
      {/* 1. Developer Hero Card */}
      <div className="glass glass-panel profile-hero-card" style={{ padding: '32px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '24px' }}>
          
          {/* Avatar & User Details */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User'} 
                alt="Profile Avatar" 
                style={{ 
                  width: '90px', 
                  height: '90px', 
                  borderRadius: '50%', 
                  border: '3px solid var(--accent-cyan)',
                  boxShadow: '0 8px 24px rgba(56, 189, 248, 0.25)',
                  objectFit: 'cover'
                }} 
              />
              <span 
                style={{ 
                  position: 'absolute', 
                  bottom: '2px', 
                  right: '2px', 
                  background: '#22c55e', 
                  width: '18px', 
                  height: '18px', 
                  borderRadius: '50%', 
                  border: '3px solid var(--bg-card)' 
                }} 
                title="Active" 
              />
            </div>

            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  {user?.user_metadata?.full_name || 'Career Candidate'}
                </h1>
                <span style={{ 
                  background: 'rgba(34, 197, 94, 0.15)', 
                  color: '#86efac', 
                  fontSize: '0.8rem', 
                  fontWeight: '700', 
                  padding: '4px 12px', 
                  borderRadius: '999px',
                  border: '1px solid rgba(34, 197, 94, 0.3)'
                }}>
                  ✓ Google Verified
                </span>
              </div>

              <p style={{ margin: '6px 0 0 0', fontSize: '1.1rem', color: 'var(--accent-cyan)', fontWeight: '600' }}>
                {formData.headline}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                <span>✉ {user?.email}</span>
                {formData.targetSalary && (
                  <span>💰 Target: <strong style={{ color: 'var(--text-main)' }}>{formData.targetSalary}</strong></span>
                )}
              </div>
            </div>
          </div>

          {/* Hero Action Buttons */}
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-secondary" 
              onClick={() => setIsEditing(!isEditing)}
              style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Edit3 size={16} color="var(--accent-cyan)" />
              {isEditing ? 'Close Editor' : 'Edit Profile'}
            </button>

            {onExportCSV && (
              <button 
                className="btn btn-primary" 
                onClick={onExportCSV}
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download size={16} />
                Export CSV
              </button>
            )}
          </div>
        </div>

        {/* Developer Social Links Chips Bar */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border-color)' }}>
          {/* GitHub Link Chip */}
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(0,0,0,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              {formData.githubUrl ? formData.githubUrl.replace(/^https?:\/\//, '') : 'GitHub not linked'}
            </span>
            {formData.githubUrl && (
              <>
                <button 
                  type="button" 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} 
                  onClick={() => handleCopy(formData.githubUrl, 'github')}
                  title="Copy GitHub URL"
                >
                  {copiedField === 'github' ? <Check size={14} color="#4ade80" /> : <Copy size={14} color="var(--text-muted)" />}
                </button>
                <a href={formData.githubUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <ExternalLink size={14} />
                </a>
              </>
            )}
          </div>

          {/* LinkedIn Link Chip */}
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(0,0,0,0.2)' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="#38bdf8">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
            </svg>
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              {formData.linkedinUrl ? formData.linkedinUrl.replace(/^https?:\/\//, '') : 'LinkedIn not linked'}
            </span>
            {formData.linkedinUrl && (
              <>
                <button 
                  type="button" 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} 
                  onClick={() => handleCopy(formData.linkedinUrl, 'linkedin')}
                  title="Copy LinkedIn URL"
                >
                  {copiedField === 'linkedin' ? <Check size={14} color="#4ade80" /> : <Copy size={14} color="var(--text-muted)" />}
                </button>
                <a href={formData.linkedinUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <ExternalLink size={14} />
                </a>
              </>
            )}
          </div>

          {/* Portfolio Link Chip */}
          <div className="glass" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '999px', background: 'rgba(0,0,0,0.2)' }}>
            <Globe size={16} color="var(--accent-purple)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>
              {formData.portfolioUrl ? formData.portfolioUrl.replace(/^https?:\/\//, '') : 'Portfolio not linked'}
            </span>
            {formData.portfolioUrl && (
              <>
                <button 
                  type="button" 
                  style={{ background: 'transparent', border: 'none', cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center' }} 
                  onClick={() => handleCopy(formData.portfolioUrl, 'portfolio')}
                  title="Copy Portfolio URL"
                >
                  {copiedField === 'portfolio' ? <Check size={14} color="#4ade80" /> : <Copy size={14} color="var(--text-muted)" />}
                </button>
                <a href={formData.portfolioUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>
                  <ExternalLink size={14} />
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 2. Inline Profile Editor */}
      {isEditing && (
        <div className="glass glass-panel" style={{ padding: '28px', border: '1px solid var(--accent-cyan)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0, fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Edit3 size={20} color="var(--accent-cyan)" /> Edit Career Profile Details
            </h3>
            <button className="btn btn-secondary" style={{ padding: '4px 8px' }} onClick={() => setIsEditing(false)}>
              <X size={16} />
            </button>
          </div>

          <form onSubmit={handleSaveForm} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>Professional Headline / Title</label>
                <input 
                  type="text" 
                  name="headline" 
                  className="form-control" 
                  value={formData.headline} 
                  onChange={handleChange} 
                  placeholder="e.g. Full Stack Developer | AI Specialist" 
                />
              </div>
              <div className="form-group">
                <label>Target Expected Compensation</label>
                <input 
                  type="text" 
                  name="targetSalary" 
                  className="form-control" 
                  value={formData.targetSalary} 
                  onChange={handleChange} 
                  placeholder="e.g. $120k / 15-20 LPA" 
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label>GitHub URL</label>
                <input 
                  type="url" 
                  name="githubUrl" 
                  className="form-control" 
                  value={formData.githubUrl} 
                  onChange={handleChange} 
                  placeholder="https://github.com/username" 
                />
              </div>
              <div className="form-group">
                <label>LinkedIn URL</label>
                <input 
                  type="url" 
                  name="linkedinUrl" 
                  className="form-control" 
                  value={formData.linkedinUrl} 
                  onChange={handleChange} 
                  placeholder="https://linkedin.com/in/username" 
                />
              </div>
              <div className="form-group">
                <label>Portfolio URL</label>
                <input 
                  type="url" 
                  name="portfolioUrl" 
                  className="form-control" 
                  value={formData.portfolioUrl} 
                  onChange={handleChange} 
                  placeholder="https://yourportfolio.com" 
                />
              </div>
            </div>

            {/* Gemini AI API Key Configuration */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(0, 180, 216, 0.08) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.3)',
              borderRadius: '12px',
              padding: '16px',
              marginTop: '4px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap', gap: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontWeight: '700', color: 'var(--accent-purple)', fontSize: '0.9rem' }}>
                  <Bot size={18} /> Google Gemini AI API Key
                </label>
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noreferrer"
                  style={{ fontSize: '0.78rem', color: 'var(--accent-cyan)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
                >
                  Get free key at Google AI Studio <ExternalLink size={12} />
                </a>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ position: 'relative', flex: 1 }}>
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={geminiKey}
                    onChange={(e) => setGeminiKey(e.target.value)}
                    placeholder="AIzaSy... (stored locally in browser)"
                    className="form-control"
                    style={{ paddingRight: '40px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--text-muted)'
                    }}
                    title={showKey ? 'Hide key' : 'Show key'}
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={handleSaveGeminiKey}
                  className="btn btn-secondary"
                  style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                >
                  {keySaveSuccess ? 'Saved!' : 'Save AI Key'}
                </button>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                {hasGeminiApiKey() ? (
                  <span style={{ color: 'var(--accent-green)', fontWeight: '600' }}>✓ Gemini 2.0 Flash active for Magic Paste, Interview Predictor & Resume Optimizer</span>
                ) : (
                  <span>No key entered. Built-in heuristic fallbacks are active. Add a key to unlock real-time Gemini LLM capabilities.</span>
                )}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSaving}>
                {isSaving ? 'Saving Changes...' : 'Save Profile'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* 3. Top Metrics Row */}
      <div className="stats-container">
        <div className="glass glass-panel stat-card">
          <span className="stat-label">Total Applications</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <BarChart3 size={28} color="var(--accent-cyan)" />
            <span className="stat-value">{metrics.total}</span>
          </div>
        </div>

        <div className="glass glass-panel stat-card">
          <span className="stat-label">Interview Rate</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <TrendingUp size={28} color="var(--accent-purple)" />
            <span className="stat-value">{metrics.interviewRate}%</span>
          </div>
        </div>

        <div className="glass glass-panel stat-card">
          <span className="stat-label">Offers Landed</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Award size={28} color="var(--accent-green)" />
            <span className="stat-value">{metrics.offers}</span>
          </div>
        </div>

        <div className="glass glass-panel stat-card">
          <span className="stat-label">Active Streak</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Flame size={28} color="var(--accent-orange)" />
            <span className="stat-value">{leetCodeHeatmap.currentStreak} <span style={{ fontSize: '1rem', color: 'var(--text-muted)' }}>days</span></span>
          </div>
        </div>
      </div>

      {/* 4. LeetCode-Style 1-Year Submission Activity Heatmap */}
      <div className="glass glass-panel lc-heatmap-card" style={{ padding: '28px' }}>
        
        {/* LeetCode Header Bar */}
        <div className="lc-heatmap-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {leetCodeHeatmap.totalPastYearSubmissions}
            </span>
            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              applications in the past one year
            </span>
            <Info size={16} color="var(--text-muted)" style={{ cursor: 'pointer' }} title="Full 12-month application activity breakdown" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Total active days: <strong style={{ color: 'var(--text-main)', fontWeight: '700' }}>{leetCodeHeatmap.totalActiveDays}</strong>
            </div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Max streak: <strong style={{ color: 'var(--text-main)', fontWeight: '700' }}>{leetCodeHeatmap.maxStreak}</strong>
            </div>

            <div 
              className="glass" 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '6px', 
                padding: '4px 12px', 
                borderRadius: '8px', 
                fontSize: '0.85rem', 
                fontWeight: '600',
                background: 'rgba(255, 255, 255, 0.08)',
                cursor: 'pointer'
              }}
              onClick={() => setSelectedYearView(selectedYearView === 'Current' ? '2026' : 'Current')}
            >
              <span>{selectedYearView}</span>
              <ChevronDown size={14} color="var(--text-muted)" />
            </div>
          </div>
        </div>

        {/* LeetCode 12-Month Columns Matrix */}
        <div className="lc-heatmap-scroll-container">
          <div className="lc-heatmap-months-wrapper">
            {leetCodeHeatmap.monthsData.map((monthObj, mIdx) => (
              <div key={mIdx} className="lc-month-column">
                <div className="lc-month-grid">
                  {monthObj.days.map((day, dIdx) => (
                    day.isPadding ? (
                      <div key={dIdx} className="lc-cell-pad" />
                    ) : (
                      <div
                        key={dIdx}
                        className={`lc-cell ${getLeetCodeColorClass(day.count)}`}
                        onClick={() => setSelectedHeatmapDay(day)}
                        title={`${day.date}: ${day.count} application(s)`}
                      />
                    )
                  ))}
                </div>
                <span className="lc-month-label">{monthObj.monthName}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>Click any square to inspect applied companies on that day</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span>Less</span>
            <span className="lc-cell lc-cell-0" style={{ width: '11px', height: '11px' }}></span>
            <span className="lc-cell lc-cell-1" style={{ width: '11px', height: '11px' }}></span>
            <span className="lc-cell lc-cell-2" style={{ width: '11px', height: '11px' }}></span>
            <span className="lc-cell lc-cell-3" style={{ width: '11px', height: '11px' }}></span>
            <span className="lc-cell lc-cell-4" style={{ width: '11px', height: '11px' }}></span>
            <span>More</span>
          </div>
        </div>

        {/* Selected Heatmap Day Details Banner */}
        {selectedHeatmapDay && (
          <div className="glass" style={{ marginTop: '16px', padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--accent-cyan)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <strong>Applications on {selectedHeatmapDay.date} ({selectedHeatmapDay.count}):</strong>
              <button className="btn btn-secondary" style={{ padding: '2px 8px', fontSize: '0.75rem' }} onClick={() => setSelectedHeatmapDay(null)}>Close</button>
            </div>
            {selectedHeatmapDay.apps.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {selectedHeatmapDay.apps.map(app => (
                  <span key={app.id} className={`status-badge status-${app.status}`} style={{ padding: '6px 12px', fontSize: '0.85rem' }}>
                    {app.role} @ <strong>{app.website}</strong> ({app.status})
                  </span>
                ))}
              </div>
            ) : (
              <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.85rem' }}>No applications submitted on this date.</p>
            )}
          </div>
        )}
      </div>

      {/* 5. Master Resume Vault & Skills Matrix */}
      <div className="split-view">
        
        {/* Master Resume Vault Column */}
        <div className="split-column glass glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <FileText size={24} color="var(--accent-cyan)" />
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent-cyan)' }}>Master Resume Vault</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Attach to any application in 1 click</span>
              </div>
            </div>

            {formData.masterResumeUrl && (
              <div style={{ display: 'flex', gap: '8px' }}>
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={() => setPreviewingResume(!previewingResume)}
                >
                  <Eye size={14} /> {previewingResume ? 'Hide' : 'Preview'}
                </button>
                <a 
                  href={formData.masterResumeUrl} 
                  target="_blank" 
                  rel="noreferrer" 
                  download 
                  className="btn btn-primary" 
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                >
                  <Download size={14} /> Download
                </a>
              </div>
            )}
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 16px 0' }}>
            Upload your master PDF resume once. It stays securely stored in your Supabase Vault and can be auto-attached when adding new applications.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
            <input 
              type="file" 
              accept=".pdf,.doc,.docx"
              id="profileMasterResumeInput" 
              style={{ display: 'none' }}
              onChange={handleResumeFileChange}
              disabled={isUploading}
            />
            <label 
              htmlFor="profileMasterResumeInput" 
              className="btn btn-secondary"
              style={{ cursor: 'pointer', padding: '10px 18px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
            >
              <UploadCloud size={18} color="var(--accent-cyan)" />
              {isUploading ? 'Uploading to Vault...' : formData.masterResumeName ? 'Replace Master Resume' : 'Upload Master Resume (PDF)'}
            </label>

            {formData.masterResumeName && (
              <span style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: '600' }}>
                📄 {formData.masterResumeName}
              </span>
            )}
          </div>

          {previewingResume && formData.masterResumeUrl && (
            <div style={{ marginTop: '16px', height: '320px', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <iframe 
                src={`https://docs.google.com/viewer?url=${encodeURIComponent(formData.masterResumeUrl)}&embedded=true`} 
                style={{ width: '100%', height: '100%', border: 'none' }} 
                title="Master Resume Preview" 
              />
            </div>
          )}
        </div>

        {/* Skills Matrix & Preferences Column */}
        <div className="split-column glass glass-panel" style={{ padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <Sparkles size={24} color="var(--accent-orange)" />
            <div>
              <h3 style={{ margin: 0, fontSize: '1.2rem', color: 'var(--accent-orange)' }}>Skills & Tech Stack Matrix</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Core competencies for your target roles</span>
            </div>
          </div>

          <form onSubmit={handleAddSkill} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            <input 
              type="text" 
              className="form-control" 
              value={newSkill} 
              onChange={(e) => setNewSkill(e.target.value)} 
              placeholder="e.g. Next.js, Docker, Python" 
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-secondary" style={{ padding: '0 16px' }}>
              Add Skill
            </button>
          </form>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '80px' }}>
            {formData.skills.map((skill, idx) => (
              <span 
                key={idx} 
                className="glass"
                style={{ 
                  padding: '6px 14px', 
                  borderRadius: '999px', 
                  fontSize: '0.85rem', 
                  display: 'inline-flex', 
                  alignItems: 'center', 
                  gap: '8px',
                  background: 'rgba(56, 189, 248, 0.1)',
                  color: 'var(--text-main)',
                  border: '1px solid rgba(56, 189, 248, 0.25)'
                }}
              >
                {skill}
                <X 
                  size={14} 
                  style={{ cursor: 'pointer', color: 'var(--text-muted)' }} 
                  onClick={() => handleRemoveSkill(skill)} 
                />
              </span>
            ))}
          </div>
        </div>

      </div>

      {/* 6. Application Conversion Funnel */}
      <div className="glass glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Application Conversion Pipeline</h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Conversion rates across your full recruitment lifecycle.
            </p>
          </div>
          <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', padding: '6px 14px', borderRadius: '20px', fontWeight: '700', fontSize: '0.9rem' }}>
            Offer Rate: {metrics.offerRate}%
          </span>
        </div>

        <div className="funnel-wrapper">
          {/* Stage 1: Applied */}
          <div className="funnel-stage">
            <div className="funnel-stage-header">
              <span className="funnel-stage-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Clock size={16} color="var(--accent-cyan)" /> 1. Applied
              </span>
              <span className="funnel-stage-stat">
                <strong>{metrics.total}</strong> ({metrics.total > 0 ? '100%' : '0%'})
              </span>
            </div>
            <div className="funnel-bar-bg">
              <div 
                className="funnel-bar-fill" 
                style={{ 
                  width: metrics.total > 0 ? '100%' : '0%',
                  background: 'linear-gradient(90deg, var(--accent-cyan), #38bdf8)' 
                }} 
              />
            </div>
          </div>

          {/* Stage 2: Interview */}
          <div className="funnel-stage">
            <div className="funnel-stage-header">
              <span className="funnel-stage-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={16} color="var(--accent-purple)" /> 2. Interviewing / OA
              </span>
              <span className="funnel-stage-stat">
                <strong>{metrics.interviews + metrics.offers}</strong> ({metrics.interviewRate}%)
              </span>
            </div>
            <div className="funnel-bar-bg">
              <div 
                className="funnel-bar-fill" 
                style={{ 
                  width: `${metrics.interviewRate}%`,
                  background: 'linear-gradient(90deg, var(--accent-purple), #a855f7)' 
                }} 
              />
            </div>
          </div>

          {/* Stage 3: Offer */}
          <div className="funnel-stage">
            <div className="funnel-stage-header">
              <span className="funnel-stage-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 size={16} color="var(--accent-green)" /> 3. Offers Received
              </span>
              <span className="funnel-stage-stat">
                <strong>{metrics.offers}</strong> ({metrics.offerRate}%)
              </span>
            </div>
            <div className="funnel-bar-bg">
              <div 
                className="funnel-bar-fill" 
                style={{ 
                  width: `${metrics.offerRate}%`,
                  background: 'linear-gradient(90deg, var(--accent-green), #4ade80)' 
                }} 
              />
            </div>
          </div>

          {/* Rejections & Pending Stats */}
          <div style={{ marginTop: '16px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div className="glass" style={{ padding: '10px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
              <XCircle size={18} color="#ef4444" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Rejections: <strong style={{ color: '#ef4444' }}>{metrics.rejected}</strong> ({metrics.rejectionRate}%)
              </span>
            </div>
            <div className="glass" style={{ padding: '10px 16px', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
              <Clock size={18} color="var(--accent-cyan)" />
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Awaiting Response: <strong style={{ color: 'var(--text-main)' }}>{metrics.appliedPending}</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 7. College vs Self Performance */}
      <div className="split-view">
        {/* College */}
        <div className="split-column glass glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <GraduationCap size={24} color="var(--accent-cyan)" />
            <div>
              <h3 style={{ margin: 0, color: 'var(--accent-cyan)' }}>College (On-Campus)</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Campus Placement Drives</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="glass" style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Applied</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{metrics.college.total}</div>
            </div>
            <div className="glass" style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interview Rate</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-cyan)' }}>{metrics.college.rate}%</div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Reported Packages / Stipends:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {metrics.college.salaries.length > 0 ? (
                metrics.college.salaries.map((sal, idx) => (
                  <span key={idx} className="glass" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-main)', background: 'rgba(56, 189, 248, 0.1)' }}>
                    💰 {sal}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No salary data added yet</span>
              )}
            </div>
          </div>
        </div>

        {/* Self */}
        <div className="split-column glass glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <UserCheck size={24} color="var(--accent-purple)" />
            <div>
              <h3 style={{ margin: 0, color: 'var(--accent-purple)' }}>Self (Off-Campus)</h3>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Direct & Referral Applications</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div className="glass" style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Applied</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800' }}>{metrics.self.total}</div>
            </div>
            <div className="glass" style={{ padding: '12px', borderRadius: '10px', background: 'rgba(0,0,0,0.2)' }}>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Interview Rate</div>
              <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--accent-purple)' }}>{metrics.self.rate}%</div>
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Reported Packages / Stipends:</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
              {metrics.self.salaries.length > 0 ? (
                metrics.self.salaries.map((sal, idx) => (
                  <span key={idx} className="glass" style={{ padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem', color: 'var(--text-main)', background: 'rgba(168, 85, 247, 0.1)' }}>
                    💰 {sal}
                  </span>
                ))
              ) : (
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>No salary data added yet</span>
              )}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ProfilePage;
