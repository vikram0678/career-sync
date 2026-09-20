import { useState } from 'react';
import { 
  Globe, 
  Calendar, 
  Trash2, 
  DollarSign, 
  GripVertical
} from 'lucide-react';

const COLUMNS = [
  { id: 'applied', label: 'Applied', color: 'var(--accent-cyan)', bg: 'rgba(0, 180, 216, 0.08)', border: 'rgba(0, 180, 216, 0.3)' },
  { id: 'interview', label: 'Interviewing', color: 'var(--accent-purple)', bg: 'rgba(168, 85, 247, 0.08)', border: 'rgba(168, 85, 247, 0.3)' },
  { id: 'offer', label: 'Offer Received', color: 'var(--accent-green)', bg: 'rgba(74, 222, 128, 0.08)', border: 'rgba(74, 222, 128, 0.3)' },
  { id: 'rejected', label: 'Archived / Rejected', color: '#f87171', bg: 'rgba(248, 113, 113, 0.08)', border: 'rgba(248, 113, 113, 0.3)' },
];

function KanbanBoard({ 
  applications = [], 
  onAppClick, 
  onUpdateStatus, 
  onDelete 
}) {
  const [draggedAppId, setDraggedAppId] = useState(null);
  const [activeDropCol, setActiveDropCol] = useState(null);

  const handleDragStart = (e, app) => {
    e.dataTransfer.setData('text/plain', app.id);
    e.dataTransfer.effectAllowed = 'move';
    setDraggedAppId(app.id);
  };

  const handleDragEnd = () => {
    setDraggedAppId(null);
    setActiveDropCol(null);
  };

  const handleDragOver = (e, colId) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (activeDropCol !== colId) {
      setActiveDropCol(colId);
    }
  };

  const handleDragLeave = (e, colId) => {
    // Only reset if we left the column itself
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (activeDropCol === colId) {
      setActiveDropCol(null);
    }
  };

  const handleDrop = (e, targetColId) => {
    e.preventDefault();
    const appId = e.dataTransfer.getData('text/plain');
    if (appId && onUpdateStatus) {
      onUpdateStatus(appId, targetColId);
    }
    setDraggedAppId(null);
    setActiveDropCol(null);
  };

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))',
      gap: '16px',
      alignItems: 'start',
      overflowX: 'auto',
      paddingBottom: '20px'
    }}>
      {COLUMNS.map(col => {
        const colApps = applications.filter(a => (a.status || 'applied') === col.id);
        const isTarget = activeDropCol === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={(e) => handleDragLeave(e, col.id)}
            onDrop={(e) => handleDrop(e, col.id)}
            className="glass glass-panel"
            style={{
              padding: '16px',
              borderRadius: '16px',
              minHeight: '480px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderTop: `4px solid ${col.color}`,
              background: isTarget ? col.bg : 'var(--glass-bg)',
              borderColor: isTarget ? col.color : 'var(--glass-border)',
              transition: 'all 0.2s ease',
              boxShadow: isTarget ? `0 8px 30px ${col.border}` : 'none'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '10px',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: '800', color: col.color, fontSize: '0.95rem' }}>
                  {col.label}
                </span>
                <span style={{
                  background: col.bg,
                  color: col.color,
                  border: `1px solid ${col.border}`,
                  fontSize: '0.75rem',
                  fontWeight: '700',
                  padding: '2px 8px',
                  borderRadius: '999px'
                }}>
                  {colApps.length}
                </span>
              </div>
            </div>

            {/* Column Cards Container */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              flex: 1
            }}>
              {colApps.length === 0 ? (
                <div style={{
                  flex: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed var(--glass-border)',
                  borderRadius: '12px',
                  padding: '28px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.82rem'
                }}>
                  {isTarget ? 'Release to drop here' : 'Drop cards here'}
                </div>
              ) : (
                colApps.map(app => {
                  const isBeingDragged = draggedAppId === app.id;
                  const daysSince = app.appliedDate ? Math.floor((new Date() - new Date(app.appliedDate)) / (1000 * 60 * 60 * 24)) : 0;
                  const isStagnant = app.status === 'applied' && daysSince >= 14;

                  return (
                    <div
                      key={app.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, app)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onAppClick(app)}
                      className="glass glass-panel"
                      style={{
                        padding: '14px',
                        borderRadius: '12px',
                        cursor: 'grab',
                        background: 'var(--glass-highlight)',
                        border: '1px solid var(--glass-border)',
                        opacity: isBeingDragged ? 0.4 : 1,
                        transform: isBeingDragged ? 'scale(0.98)' : 'none',
                        transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
                        position: 'relative'
                      }}
                    >
                      {/* Drag Handle & Track Badge */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <GripVertical size={14} color="var(--text-muted)" style={{ cursor: 'grab' }} />
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            background: app.applicationType === 'college' ? 'rgba(0, 180, 216, 0.15)' : 'rgba(168, 85, 247, 0.15)',
                            color: app.applicationType === 'college' ? 'var(--accent-cyan)' : 'var(--accent-purple)'
                          }}>
                            {app.applicationType === 'college' ? 'College' : 'Self'}
                          </span>
                          {isStagnant && (
                            <span 
                              style={{ 
                                background: 'rgba(245, 158, 11, 0.15)', 
                                color: '#f59e0b', 
                                border: '1px solid rgba(245, 158, 11, 0.3)', 
                                fontSize: '0.68rem', 
                                padding: '1px 5px', 
                                borderRadius: '999px',
                                fontWeight: '700'
                              }}
                              title="14+ days since applied"
                            >
                              ⏱️ 14d+
                            </span>
                          )}
                        </div>

                        {onDelete && (
                          <button
                            className="btn btn-secondary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(app);
                            }}
                            style={{
                              padding: '2px',
                              minWidth: 'auto',
                              background: 'transparent',
                              border: 'none',
                              color: 'var(--text-muted)',
                              cursor: 'pointer'
                            }}
                            title="Delete Application"
                          >
                            <Trash2 size={13} />
                          </button>
                        )}
                      </div>

                      {/* Role & Company */}
                      <h4 style={{
                        fontSize: '0.98rem',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        margin: '0 0 6px 0',
                        lineHeight: '1.3'
                      }}>
                        {app.role}
                      </h4>

                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        color: 'var(--text-muted)',
                        fontSize: '0.82rem',
                        marginBottom: '10px'
                      }}>
                        <Globe size={13} />
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
                          <span>{app.website}</span>
                        )}
                      </div>

                      {/* Footer Details: Date & Salary */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.75rem',
                        color: 'var(--text-muted)',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '8px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} /> {app.appliedDate || 'No date'}
                        </span>
                        {app.salary && (
                          <span style={{ 
                            display: 'flex', 
                            alignItems: 'center', 
                            gap: '2px', 
                            color: 'var(--accent-green)', 
                            fontWeight: '600' 
                          }}>
                            <DollarSign size={11} /> {app.salary}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default KanbanBoard;
