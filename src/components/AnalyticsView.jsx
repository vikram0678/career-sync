import { useState, useMemo } from 'react';
import { 
  TrendingUp, 
  Flame, 
  Award, 
  BarChart3, 
  GraduationCap, 
  UserCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Briefcase,
  Info,
  ChevronDown
} from 'lucide-react';

function AnalyticsView({ applications = [] }) {
  const [selectedHeatmapDay, setSelectedHeatmapDay] = useState(null);
  const [selectedYearView, setSelectedYearView] = useState('Current');

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

    // College vs Self breakdown
    const collegeApps = applications.filter(a => a.applicationType === 'college');
    const selfApps = applications.filter(a => a.applicationType === 'self' || !a.applicationType);

    const collegeInterviews = collegeApps.filter(a => a.status === 'interview' || a.status === 'offer').length;
    const collegeOffers = collegeApps.filter(a => a.status === 'offer').length;
    const collegeRate = collegeApps.length > 0 ? ((collegeInterviews / collegeApps.length) * 100).toFixed(1) : 0;

    const selfInterviews = selfApps.filter(a => a.status === 'interview' || a.status === 'offer').length;
    const selfOffers = selfApps.filter(a => a.status === 'offer').length;
    const selfRate = selfApps.length > 0 ? ((selfInterviews / selfApps.length) * 100).toFixed(1) : 0;

    // Top roles breakdown
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
    const currentMonth = today.getMonth(); // 0-11

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

    // Generate 12 distinct month columns from (currentMonth - 11) up to currentMonth
    for (let m = 11; m >= 0; m--) {
      const monthDate = new Date(currentYear, currentMonth - m, 1);
      const y = monthDate.getFullYear();
      const mIdx = monthDate.getMonth();
      const monthName = monthNames[mIdx];

      const daysInMonth = new Date(y, mIdx + 1, 0).getDate();
      const firstDayOfWeek = new Date(y, mIdx, 1).getDay(); // 0 = Sun, 6 = Sat

      const days = [];
      // Leading empty padding cells so days line up with weekdays (Sun-Sat)
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

    // Calculate Streaks over past 365 days
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
        if (i === 0) continue; // If 0 today, check yesterday
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
    <div className="analytics-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Metric Cards */}
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

      {/* LeetCode-Style 1-Year Submission Activity Heatmap */}
      <div className="glass glass-panel lc-heatmap-card" style={{ padding: '24px' }}>
        
        {/* LeetCode Header Bar */}
        <div className="lc-heatmap-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--text-main)' }}>
              {leetCodeHeatmap.totalPastYearSubmissions}
            </span>
            <span style={{ fontSize: '0.95rem', color: 'var(--text-muted)', fontWeight: '600' }}>
              submissions in the past one year
            </span>
            <Info size={15} color="var(--text-muted)" style={{ cursor: 'pointer' }} title="Full 12-month application activity breakdown" />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Total active days: <strong style={{ color: 'var(--text-main)', fontWeight: '700' }}>{leetCodeHeatmap.totalActiveDays}</strong>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
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

        {/* Legend & Hint */}
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

        {/* Selected Heatmap Day Details Modal / Banner */}
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

      {/* Section 2: Application Conversion Pipeline */}
      <div className="glass glass-panel" style={{ padding: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.4rem', color: 'var(--text-main)' }}>Application Conversion Pipeline</h2>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Track how effectively your applications convert into interviews and offers.
            </p>
          </div>
          <span className="badge" style={{ background: 'rgba(56, 189, 248, 0.15)', color: 'var(--accent-cyan)', padding: '6px 12px', borderRadius: '20px', fontWeight: '700', fontSize: '0.85rem' }}>
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

          {/* Rejections Counter */}
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

      {/* Section 3: College vs Self Performance & Salary Comparison */}
      <div className="split-view">
        {/* College Tracking Card */}
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

        {/* Self Tracking Card */}
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

      {/* Section 4: Top Target Roles */}
      {metrics.topRoles.length > 0 && (
        <div className="glass glass-panel" style={{ padding: '20px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Briefcase size={18} color="var(--accent-cyan)" />
            Top Applied Job Roles
          </h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
            {metrics.topRoles.map(([role, count], idx) => (
              <div key={idx} className="glass" style={{ padding: '8px 16px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(255, 255, 255, 0.05)' }}>
                <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{role}</span>
                <span style={{ background: 'var(--accent-cyan)', color: '#0f172a', fontWeight: '800', fontSize: '0.75rem', padding: '2px 8px', borderRadius: '999px' }}>
                  {count} {count === 1 ? 'app' : 'apps'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

export default AnalyticsView;
