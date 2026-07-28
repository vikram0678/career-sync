import { useState } from 'react';
import { X, Calendar, Globe, FileText, Briefcase, Download, Eye } from 'lucide-react';

function FileViewerModal({ fileUrl, fileType, onClose }) {
  let displayUrl = fileUrl;
  if (fileType === 'pdf' && displayUrl && displayUrl.includes('cloudinary') && !displayUrl.endsWith('.pdf')) {
    displayUrl = displayUrl + '.pdf';
  }

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="glass modal-content glass-panel" style={{ maxWidth: '90vw', width: '100%', height: '90vh', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ margin: 0 }}>File Viewer</h3>
          <button className="btn btn-secondary" style={{ padding: '6px', minWidth: 'auto' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'rgba(0,0,0,0.4)', borderRadius: '8px' }}>
          {fileType === 'pdf' ? (
            <iframe 
              src={`https://docs.google.com/viewer?url=${encodeURIComponent(displayUrl)}&embedded=true`} 
              style={{ width: '100%', height: '100%', border: 'none', borderRadius: '8px' }} 
              title="Resume PDF Viewer" 
            />
          ) : (
            <img src={fileUrl} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
          )}
        </div>
      </div>
    </div>
  );
}

function ApplicationDetails({ app, onClose, onUpdateStatus }) {
  const [viewingFile, setViewingFile] = useState(null);

  return (
    <>
      <div className="modal-overlay">
        <div className="glass modal-content glass-panel" style={{ maxWidth: '800px' }}>
          <button className="modal-close" onClick={onClose}>
            <X size={24} />
          </button>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', paddingRight: '30px' }}>
            <div>
              <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{app.role}</h2>
              <div style={{ display: 'flex', gap: '16px', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Globe size={18} /> 
                  {app.careerPageUrl ? (
                    <a href={app.careerPageUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'none' }}>
                      {app.website}
                    </a>
                  ) : (
                    app.website
                  )}
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={18} /> {app.appliedDate}
                </span>
                {app.salary && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                     • Salary: <strong style={{ color: 'var(--text-main)' }}>{app.salary}</strong>
                  </span>
                )}
              </div>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
              <span className={`status-badge status-${app.status}`}>{app.status}</span>
              <select 
                className="form-control" 
                style={{ padding: '4px 8px', fontSize: '0.85rem', width: 'auto' }}
                value={app.status}
                onChange={(e) => onUpdateStatus(app.id, e.target.value)}
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gap: '24px' }}>
            <div className="glass glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1.1rem' }}>
                <FileText size={18} color="var(--accent-cyan)" />
                Resume Used
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <p>{app.resumeUsed || 'No resume attached'}</p>
                {app.resumeUrl && (
                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button 
                      onClick={() => setViewingFile({ url: app.resumeUrl, type: 'pdf' })}
                      className="btn btn-secondary"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      <Eye size={16} /> View
                    </button>
                    <a 
                      href={app.resumeUrl && app.resumeUrl.includes('cloudinary') && !app.resumeUrl.endsWith('.pdf') ? app.resumeUrl + '.pdf' : app.resumeUrl} 
                      target="_blank"
                      download
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                    >
                      <Download size={16} /> Download
                    </a>
                  </div>
                )}
              </div>
            </div>

            <div className="glass glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px' }}>
              <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1.1rem' }}>
                <Briefcase size={18} color="var(--accent-purple)" />
                Job Description
              </h3>
              <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', lineHeight: '1.6' }}>
                {app.jobDescription || "No job description provided."}
              </div>
            </div>

            <div className="glass glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px' }}>
              <h3 style={{ marginBottom: '12px', fontSize: '1.1rem' }}>Screenshots</h3>
              {app.screenshots && app.screenshots.length > 0 ? (
                <div style={{ display: 'flex', gap: '16px', overflowX: 'auto', paddingBottom: '8px' }}>
                  {app.screenshots.map((url, i) => (
                    <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: '150px', flexShrink: 0 }}>
                      <img src={url} alt={`Screenshot ${i}`} style={{ height: '150px', borderRadius: '8px', objectFit: 'cover', width: '100%' }} />
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                        <button 
                          onClick={() => setViewingFile({ url, type: 'image' })}
                          className="btn btn-secondary" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', flex: 1, justifyContent: 'center' }}
                        >
                          <Eye size={14} /> View
                        </button>
                        <a 
                          href={url} 
                          target="_blank"
                          download
                          className="btn btn-primary" 
                          style={{ padding: '4px 8px', fontSize: '0.75rem', flex: 1, justifyContent: 'center' }}
                        >
                          <Download size={14} /> Save
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p style={{ color: 'var(--text-muted)' }}>No screenshots uploaded for this application.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      {viewingFile && (
        <FileViewerModal 
          fileUrl={viewingFile.url} 
          fileType={viewingFile.type} 
          onClose={() => setViewingFile(null)} 
        />
      )}
    </>
  );
}

export default ApplicationDetails;
