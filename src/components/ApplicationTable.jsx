import { Calendar, Trash2, DollarSign, ExternalLink, Eye, Clock, Briefcase } from 'lucide-react';
import CompanyAvatar from './CompanyAvatar';

function ApplicationTable({ applications, onAppClick, onDelete }) {
  if (!applications || applications.length === 0) {
    return (
      <div 
        className="glass glass-panel empty-state" 
        style={{ 
          padding: '48px 20px', 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '12px'
        }}
      >
        <div style={{
          width: '56px',
          height: '56px',
          borderRadius: '16px',
          background: 'rgba(56, 189, 248, 0.08)',
          border: '1px solid rgba(56, 189, 248, 0.2)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Briefcase size={26} color="var(--accent-cyan)" />
        </div>
        <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.05rem', fontWeight: '700' }}>
          No applications found
        </h4>
        <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem', maxWidth: '340px' }}>
          No jobs in this category yet. Click &quot;Track Application&quot; or press <kbd style={{ padding: '2px 6px', background: 'var(--glass-card)', border: '1px solid var(--border-color)', borderRadius: '4px', fontFamily: 'monospace' }}>N</kbd> to add one.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="applications-table">
        <thead>
          <tr>
            <th>Company &amp; Role</th>
            <th>Track</th>
            <th>Date Applied</th>
            <th>Compensation</th>
            <th>Status</th>
            <th style={{ width: '80px', textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => {
            const daysSince = app.appliedDate ? Math.floor((new Date() - new Date(app.appliedDate)) / (1000 * 60 * 60 * 24)) : 0;
            const isStagnant = app.status === 'applied' && daysSince >= 14;

            return (
              <tr 
                key={app.id} 
                className="job-row" 
                onClick={() => onAppClick(app)}
                style={{ cursor: 'pointer' }}
              >
                {/* Company & Role */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <CompanyAvatar 
                      company={app.website} 
                      url={app.careerPageUrl} 
                      size={38} 
                      borderRadius={10} 
                    />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0 }}>
                      <div 
                        className="job-role-cell" 
                        style={{ 
                          fontSize: '0.98rem', 
                          fontWeight: '700', 
                          color: 'var(--text-main)',
                          lineHeight: '1.2'
                        }}
                      >
                        {app.role}
                      </div>
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '6px', 
                          fontSize: '0.82rem', 
                          color: 'var(--text-muted)' 
                        }}
                      >
                        {app.careerPageUrl ? (
                          <a
                            href={app.careerPageUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ 
                              color: 'var(--text-muted)', 
                              textDecoration: 'none', 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '4px',
                              transition: 'color 0.15s ease'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--accent-cyan)'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                            onClick={(e) => e.stopPropagation()}
                          >
                            <span>{app.website}</span>
                            <ExternalLink size={12} />
                          </a>
                        ) : (
                          <span>{app.website}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </td>

                {/* Track Badge */}
                <td>
                  <span style={{
                    fontSize: '0.72rem',
                    fontWeight: '700',
                    padding: '3px 9px',
                    borderRadius: '999px',
                    letterSpacing: '0.02em',
                    background: app.applicationType === 'college' ? 'rgba(0, 180, 216, 0.12)' : 'rgba(168, 85, 247, 0.12)',
                    color: app.applicationType === 'college' ? 'var(--accent-cyan)' : 'var(--accent-purple)',
                    border: `1px solid ${app.applicationType === 'college' ? 'rgba(0, 180, 216, 0.25)' : 'rgba(168, 85, 247, 0.25)'}`
                  }}>
                    {app.applicationType === 'college' ? 'College' : 'Self / Off-Campus'}
                  </span>
                </td>

                {/* Date Applied */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                    <Calendar size={14} style={{ color: 'var(--accent-cyan)', opacity: 0.8 }} /> 
                    <span>{app.appliedDate || 'No date'}</span>
                  </div>
                </td>

                {/* Compensation */}
                <td>
                  {app.salary ? (
                    <div style={{ 
                      display: 'inline-flex', 
                      alignItems: 'center', 
                      gap: '4px', 
                      fontSize: '0.82rem', 
                      fontWeight: '700',
                      color: 'var(--accent-green)',
                      background: 'rgba(74, 222, 128, 0.1)',
                      border: '1px solid rgba(74, 222, 128, 0.25)',
                      padding: '2px 8px',
                      borderRadius: '6px'
                    }}>
                      <DollarSign size={12} />
                      {app.salary}
                    </div>
                  ) : (
                    <span style={{ color: 'var(--text-sub)', fontSize: '0.85rem' }}>—</span>
                  )}
                </td>

                {/* Status Badge & Stagnant Indicator */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className={`status-badge status-${app.status}`}>
                      {app.status}
                    </span>
                    {isStagnant && (
                      <span 
                        style={{ 
                          background: 'rgba(245, 158, 11, 0.15)', 
                          color: '#f59e0b', 
                          border: '1px solid rgba(245, 158, 11, 0.35)', 
                          fontSize: '0.72rem', 
                          padding: '2px 8px', 
                          borderRadius: '999px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                        title={`${daysSince} days since applied. Time to send a follow-up!`}
                      >
                        <Clock size={11} /> 14d+ follow up
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '6px' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ 
                        padding: '6px', 
                        minWidth: 'auto', 
                        background: 'transparent', 
                        border: '1px solid transparent', 
                        borderRadius: '8px',
                        color: 'var(--text-muted)'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        onAppClick(app);
                      }}
                      title="View Details"
                    >
                      <Eye size={15} />
                    </button>
                    {onDelete && (
                      <button
                        className="btn btn-secondary"
                        style={{ 
                          padding: '6px', 
                          minWidth: 'auto', 
                          background: 'transparent', 
                          border: '1px solid transparent', 
                          borderRadius: '8px',
                          color: 'var(--text-muted)'
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onDelete(app);
                        }}
                        title="Delete Application"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationTable;
