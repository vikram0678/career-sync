import { Calendar, Globe, FileText } from 'lucide-react';

function ApplicationCard({ app, onClick }) {
  return (
    <div className="glass glass-panel job-card" onClick={onClick}>
      <div className="job-header">
        <div>
          <h3 className="job-role">{app.role}</h3>
          <div className="job-company">
            <Globe className="job-icon" />
            {app.careerPageUrl ? (
              <a 
                href={app.careerPageUrl} 
                target="_blank" 
                rel="noreferrer" 
                style={{ color: 'inherit', textDecoration: 'none' }}
                onClick={(e) => e.stopPropagation()} // prevent triggering card click
              >
                {app.website} <span style={{ textDecoration: 'underline', fontSize: '0.8rem' }}>(Link)</span>
              </a>
            ) : (
              app.website
            )}
          </div>
        </div>
        <span className={`status-badge status-${app.status}`}>
          {app.status}
        </span>
      </div>
      
      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div className="job-details-row">
          <Calendar className="job-icon" />
          <span>Applied: {app.appliedDate}</span>
        </div>
        <div className="job-details-row">
          <FileText className="job-icon" />
          <span>{app.resumeUsed}</span>
        </div>
      </div>
    </div>
  );
}

export default ApplicationCard;
