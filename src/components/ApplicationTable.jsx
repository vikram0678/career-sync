import { Globe, Calendar, FileText } from 'lucide-react';

function ApplicationTable({ applications, onAppClick }) {
  if (!applications || applications.length === 0) {
    return (
      <div className="glass glass-panel empty-state" style={{ padding: '30px 10px' }}>
        <p style={{ margin: 0 }}>No applications in this category yet.</p>
      </div>
    );
  }

  return (
    <div className="table-container">
      <table className="jobs-table">
        <thead>
          <tr>
            <th>Role</th>
            <th>Company</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {applications.map(app => (
            <tr key={app.id} className="job-row" onClick={() => onAppClick(app)}>
              <td>
                <div className="job-role-cell" style={{ fontSize: '1rem' }}>{app.role}</div>
              </td>
              <td>
                <div className="job-company-cell">
                  <Globe size={14} />
                  {app.careerPageUrl ? (
                    <a 
                      href={app.careerPageUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      style={{ color: 'inherit', textDecoration: 'none' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      {app.website}
                    </a>
                  ) : (
                    app.website
                  )}
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                  <Calendar size={14} /> {app.appliedDate}
                </div>
              </td>
              <td>
                <span className={`status-badge status-${app.status}`}>
                  {app.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ApplicationTable;
