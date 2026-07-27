import { useState, useEffect } from 'react';
import { Target, Clock, Edit2 } from 'lucide-react';

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

  return (
    <div className="goal-banner glass glass-panel">
      <div className="goal-banner-content">
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div className="goal-icon-wrapper">
            <Target size={28} color="var(--accent-cyan)" />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px' }}>Current Goal</h3>
            <h2 style={{ margin: '4px 0 0 0', fontSize: '1.8rem', color: 'var(--text-main)' }}>{goal.title}</h2>
          </div>
        </div>

        <div className="countdown-display">
          {isExpired ? (
            <div className="countdown-expired">
              Deadline Reached!
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div className="time-block">
                <span className="time-value">{timeLeft.days}</span>
                <span className="time-label">Days</span>
              </div>
              <span className="time-separator">:</span>
              <div className="time-block">
                <span className="time-value">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="time-label">Hours</span>
              </div>
              <span className="time-separator">:</span>
              <div className="time-block">
                <span className="time-value">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="time-label">Mins</span>
              </div>
              <span className="time-separator">:</span>
              <div className="time-block">
                <span className="time-value">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="time-label">Secs</span>
              </div>
            </div>
          )}
        </div>
        
        <button 
          className="btn btn-secondary goal-edit-btn"
          onClick={onEditClick}
          title="Edit Goal"
        >
          <Edit2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default GoalCountdown;
