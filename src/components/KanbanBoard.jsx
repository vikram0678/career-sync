import { useState } from 'react';
import { 
  Calendar, 
  Trash2, 
  DollarSign, 
  GripVertical,
  ExternalLink,
  Clock,
  Briefcase
} from 'lucide-react';
import CompanyAvatar from './CompanyAvatar';

const COLUMNS = [
  { 
    id: 'applied', 
    label: 'Applied', 
    color: 'var(--accent-cyan)', 
    bg: 'rgba(56, 189, 248, 0.05)', 
    border: 'rgba(56, 189, 248, 0.35)',
    glow: 'rgba(56, 189, 248, 0.2)'
  },
  { 
    id: 'interview', 
    label: 'Interviewing', 
    color: 'var(--accent-purple)', 
    bg: 'rgba(168, 85, 247, 0.05)', 
    border: 'rgba(168, 85, 247, 0.35)',
    glow: 'rgba(168, 85, 247, 0.2)'
  },
  { 
    id: 'offer', 
    label: 'Offer Received', 
    color: 'var(--accent-green)', 
    bg: 'rgba(74, 222, 128, 0.05)', 
    border: 'rgba(74, 222, 128, 0.35)',
    glow: 'rgba(74, 222, 128, 0.2)'
  },
  { 
    id: 'rejected', 
    label: 'Archived / Rejected', 
    color: 'var(--accent-red)', 
    bg: 'rgba(248, 113, 113, 0.05)', 
    border: 'rgba(248, 113, 113, 0.35)',
    glow: 'rgba(248, 113, 113, 0.2)'
  },
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
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '18px',
      alignItems: 'start',
      overflowX: 'auto',
      paddingBottom: '24px'
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
              borderRadius: '18px',
              minHeight: '520px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              borderTop: `4px solid ${col.color}`,
              background: isTarget ? col.bg : 'var(--glass-bg)',
              borderColor: isTarget ? col.color : 'var(--glass-border)',
              transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
              boxShadow: isTarget ? `0 12px 32px ${col.glow}` : 'var(--shadow-sm)'
            }}
          >
            {/* Column Header */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingBottom: '12px',
              borderBottom: '1px solid var(--border-color)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: col.color,
                  boxShadow: `0 0 10px ${col.color}`
                }} />
                <span style={{ fontWeight: '800', color: 'var(--text-main)', fontSize: '0.96rem', letterSpacing: '-0.01em' }}>
                  {col.label}
                </span>
              </div>
              <span style={{
                background: col.bg,
                color: col.color,
                border: `1px solid ${col.border}`,
                fontSize: '0.75rem',
                fontWeight: '800',
                padding: '2px 9px',
                borderRadius: '999px',
                fontFamily: 'JetBrains Mono, monospace'
              }}>
                {colApps.length}
              </span>
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
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: isTarget ? `2px dashed ${col.color}` : '2px dashed var(--glass-border)',
                  borderRadius: '14px',
                  padding: '32px 16px',
                  textAlign: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.85rem',
                  gap: '8px',
                  transition: 'all 0.2s ease'
                }}>
                  <Briefcase size={20} style={{ opacity: 0.5, color: col.color }} />
                  <span>{isTarget ? 'Release to drop card here' : 'Drop cards here'}</span>
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
                        padding: '14px 16px',
                        borderRadius: '14px',
                        cursor: 'grab',
                        background: 'var(--glass-card)',
                        border: '1px solid var(--glass-border)',
                        opacity: isBeingDragged ? 0.35 : 1,
                        transform: isBeingDragged ? 'scale(0.97) rotate(-1deg)' : 'none',
                        transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                        boxShadow: 'var(--shadow-sm)',
                        position: 'relative'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.35)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'none';
                        e.currentTarget.style.boxShadow = 'var(--shadow-sm)';
                        e.currentTarget.style.borderColor = 'var(--glass-border)';
                      }}
                    >
                      {/* Top Row: Company Avatar + Name + Track Badge + Grip */}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minWidth: 0 }}>
                          <CompanyAvatar 
                            company={app.website} 
                            url={app.careerPageUrl} 
                            size={26} 
                            borderRadius={7} 
                          />
                          <span style={{ 
                            fontSize: '0.82rem', 
                            fontWeight: '600', 
                            color: 'var(--text-muted)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis'
                          }}>
                            {app.website}
                          </span>
                          {app.careerPageUrl && (
                            <a
                              href={app.careerPageUrl}
                              target="_blank"
                              rel="noreferrer"
                              onClick={(e) => e.stopPropagation()}
                              style={{ color: 'var(--text-sub)', display: 'inline-flex', alignItems: 'center' }}
                              title="Open careers page"
                            >
                              <ExternalLink size={11} />
                            </a>
                          )}
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: '700',
                            padding: '2px 6px',
                            borderRadius: '999px',
                            background: app.applicationType === 'college' ? 'rgba(0, 180, 216, 0.12)' : 'rgba(168, 85, 247, 0.12)',
                            color: app.applicationType === 'college' ? 'var(--accent-cyan)' : 'var(--accent-purple)',
                            border: `1px solid ${app.applicationType === 'college' ? 'rgba(0, 180, 216, 0.25)' : 'rgba(168, 85, 247, 0.25)'}`
                          }}>
                            {app.applicationType === 'college' ? 'College' : 'Self'}
                          </span>
                          <GripVertical size={13} color="var(--text-sub)" style={{ cursor: 'grab', opacity: 0.6 }} />
                        </div>
                      </div>

                      {/* Role Title */}
                      <h4 style={{
                        fontSize: '0.98rem',
                        fontWeight: '700',
                        color: 'var(--text-main)',
                        margin: '0 0 8px 0',
                        lineHeight: '1.3'
                      }}>
                        {app.role}
                      </h4>

                      {/* Stagnant Follow-Up Alert Pill */}
                      {isStagnant && (
                        <div style={{
                          background: 'rgba(245, 158, 11, 0.12)',
                          color: '#f59e0b',
                          border: '1px solid rgba(245, 158, 11, 0.3)',
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontWeight: '700',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          marginBottom: '10px'
                        }}>
                          <Clock size={11} /> 14d+ follow up
                        </div>
                      )}

                      {/* Footer Details: Date & Salary */}
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        fontSize: '0.76rem',
                        color: 'var(--text-muted)',
                        borderTop: '1px solid var(--border-color)',
                        paddingTop: '8px',
                        marginTop: isStagnant ? '0' : '4px'
                      }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Calendar size={12} style={{ color: 'var(--accent-cyan)' }} /> 
                          {app.appliedDate || 'No date'}
                        </span>
                        
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          {app.salary && (
                            <span style={{ 
                              display: 'inline-flex', 
                              alignItems: 'center', 
                              gap: '2px', 
                              color: 'var(--accent-green)', 
                              fontWeight: '700',
                              background: 'rgba(74, 222, 128, 0.1)',
                              padding: '1px 6px',
                              borderRadius: '4px'
                            }}>
                              <DollarSign size={10} /> {app.salary}
                            </span>
                          )}

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
                                color: 'var(--text-sub)',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center'
                              }}
                              title="Delete Application"
                            >
                              <Trash2 size={13} />
                            </button>
                          )}
                        </div>
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
