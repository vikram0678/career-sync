import { useState, useEffect } from 'react';
import { Target, Clock, Edit2, Calendar, Sparkles } from 'lucide-react';

function GoalCountdown({ goal, onEditClick }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    if (!goal || !goal.targetDate) return;

    const calculateTimeLeft = () => {
      const difference = new Date(goal.targetDate) - new Date();

      if (difference <= 0) {
        setIsExpired(true);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setIsExpired(false);
      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
      });
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [goal]);

  if (!goal) return null;

  const formattedDeadline = goal.targetDate 
    ? new Date(goal.targetDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })
    : null;

  return (
    <div 
      className="goal-banner glass glass-panel"
      style={{
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid rgba(56, 189, 248, 0.28)',
        background: 'radial-gradient(ellipse at top left, rgba(56, 189, 248, 0.08) 0%, transparent 60%), radial-gradient(ellipse at bottom right, rgba(168, 85, 247, 0.06) 0%, transparent 60%), var(--glass-bg)',
        boxShadow: 'var(--shadow-md), 0 0 24px rgba(56, 189, 248, 0.06)'
      }}
    >
      <div className="goal-banner-content">
        {/* Goal Title & Icon */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', minWidth: '240px' }}>
          <div 
            className="goal-icon-wrapper"
            style={{
              width: '54px',
              height: '54px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.18) 0%, rgba(168, 85, 247, 0.18) 100%)',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 16px rgba(56, 189, 248, 0.2)',
              flexShrink: 0
            }}
          >
            <Target size={26} color="var(--accent-cyan)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span style={{ 
                fontSize: '0.74rem', 
                fontWeight: '800',
                color: 'var(--accent-cyan)', 
                textTransform: 'uppercase', 
                letterSpacing: '0.08em',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <Sparkles size={11} /> Target Goal
              </span>
              {formattedDeadline && (
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  • <Calendar size={11} /> {formattedDeadline}
                </span>
              )}
            </div>
            <h2 style={{ margin: 0, fontSize: '1.45rem', color: 'var(--text-main)', letterSpacing: '-0.02em', fontWeight: '800' }}>
              {goal.title}
            </h2>
          </div>
        </div>

        {/* Digital Countdown Timer Capsules */}
        <div className="countdown-display">
          {isExpired ? (
            <div 
              style={{
                padding: '8px 18px',
                borderRadius: '12px',
                background: 'rgba(239, 68, 68, 0.12)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: 'var(--accent-red)',
                fontWeight: '700',
                fontSize: '0.92rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <Clock size={16} /> Deadline reached! Time to reflect &amp; set a new milestone.
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              <div 
                className="time-block"
                style={{
                  background: 'var(--glass-card)',
                  border: '1px solid var(--glass-border)',
                  padding: '8px 16px',
                  borderRadius: '14px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
                  minWidth: '68px',
                  textAlign: 'center'
                }}
              >
                <span className="time-value" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.65rem', fontWeight: '800' }}>
                  {timeLeft.days}
                </span>
                <span className="time-label" style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  Days
                </span>
              </div>

              <span className="time-separator" style={{ color: 'var(--accent-cyan)', opacity: 0.5, fontWeight: '700', fontSize: '1.3rem' }}>:</span>

              <div 
                className="time-block"
                style={{
                  background: 'var(--glass-card)',
                  border: '1px solid var(--glass-border)',
                  padding: '8px 16px',
                  borderRadius: '14px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
                  minWidth: '68px',
                  textAlign: 'center'
                }}
              >
                <span className="time-value" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.65rem', fontWeight: '800' }}>
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="time-label" style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  Hours
                </span>
              </div>

              <span className="time-separator" style={{ color: 'var(--accent-cyan)', opacity: 0.5, fontWeight: '700', fontSize: '1.3rem' }}>:</span>

              <div 
                className="time-block"
                style={{
                  background: 'var(--glass-card)',
                  border: '1px solid var(--glass-border)',
                  padding: '8px 16px',
                  borderRadius: '14px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
                  minWidth: '68px',
                  textAlign: 'center'
                }}
              >
                <span className="time-value" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.65rem', fontWeight: '800' }}>
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="time-label" style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  Mins
                </span>
              </div>

              <span className="time-separator" style={{ color: 'var(--accent-cyan)', opacity: 0.5, fontWeight: '700', fontSize: '1.3rem' }}>:</span>

              <div 
                className="time-block"
                style={{
                  background: 'var(--glass-card)',
                  border: '1px solid var(--glass-border)',
                  padding: '8px 16px',
                  borderRadius: '14px',
                  boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 2px 8px rgba(0, 0, 0, 0.06)',
                  minWidth: '68px',
                  textAlign: 'center'
                }}
              >
                <span className="time-value" style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '1.65rem', fontWeight: '800' }}>
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
                <span className="time-label" style={{ fontSize: '0.68rem', fontWeight: '700', letterSpacing: '0.06em', color: 'var(--text-muted)' }}>
                  Secs
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Action Button */}
        <button
          className="btn btn-secondary goal-edit-btn"
          onClick={onEditClick}
          title="Edit Goal"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '8px 14px',
            fontSize: '0.84rem'
          }}
        >
          <Edit2 size={14} />
          <span>Edit Goal</span>
        </button>
      </div>
    </div>
  );
}

export default GoalCountdown;
