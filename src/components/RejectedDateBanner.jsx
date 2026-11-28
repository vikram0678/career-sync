import { useState } from 'react';
import { CalendarX, Clock, ArrowRight, CheckCircle2, RefreshCw, Edit2 } from 'lucide-react';
import { formatShortDate, getCooloffInfo, getTodayISO, getTurnaroundDays } from '../utils/dateUtils';

/**
 * Form strip shown in add/edit forms whenever status is set to "rejected".
 * Shows the date input alongside live turnaround and 6-month cool-off previews.
 */
export function RejectedDateInputStrip({ appliedDate, rejectedDate, onChange }) {
  const turnaroundDays = getTurnaroundDays(appliedDate, rejectedDate);
  const cooloff = getCooloffInfo(rejectedDate);

  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.06)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: '12px',
      padding: '12px 16px',
      marginBottom: '18px',
      display: 'flex',
      flexWrap: 'wrap',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '14px'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
          <CalendarX size={16} color="#f87171" />
          <label
            htmlFor="rejectedDate"
            style={{ margin: 0, fontSize: '0.84rem', fontWeight: '700', color: '#f87171', whiteSpace: 'nowrap' }}
          >
            Rejected Date
          </label>
        </div>
        <input
          type="date"
          id="rejectedDate"
          name="rejectedDate"
          className="form-control"
          value={rejectedDate || ''}
          onChange={onChange}
          style={{
            width: 'auto',
            minWidth: '150px',
            padding: '6px 10px',
            fontSize: '0.85rem',
            fontWeight: '600'
          }}
        />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {turnaroundDays !== null && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '3px 9px',
            borderRadius: '999px',
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-muted)'
          }}>
            <Clock size={11} /> {turnaroundDays}d turnaround
          </span>
        )}
        {cooloff && (
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '0.75rem',
            fontWeight: '700',
            padding: '3px 10px',
            borderRadius: '999px',
            background: cooloff.isEligible ? 'rgba(74, 222, 128, 0.12)' : 'rgba(56, 189, 248, 0.12)',
            border: `1px solid ${cooloff.isEligible ? 'rgba(74, 222, 128, 0.3)' : 'rgba(56, 189, 248, 0.3)'}`,
            color: cooloff.isEligible ? 'var(--accent-green)' : 'var(--accent-cyan)'
          }}>
            {cooloff.isEligible ? <CheckCircle2 size={12} /> : <RefreshCw size={11} />}
            {cooloff.isEligible
              ? 'Eligible to re-apply'
              : `Re-apply ${cooloff.eligibleLabel} (${cooloff.remainingText})`}
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * Contextual lifecycle & cool-off summary card rendered in ApplicationDetails view mode
 * for rejected applications, supporting inline date setting/adjustment.
 */
export function RejectionLifecycleBanner({ app, onQuickDateUpdate }) {
  const [isEditingDate, setIsEditingDate] = useState(false);

  if (app.status !== 'rejected') return null;

  const turnaroundDays = getTurnaroundDays(app.appliedDate, app.rejectedDate);
  const cooloff = getCooloffInfo(app.rejectedDate);

  const handleDateChange = (e) => {
    const val = e.target.value;
    if (onQuickDateUpdate) {
      onQuickDateUpdate(val);
    }
    setIsEditingDate(false);
  };

  return (
    <div style={{
      background: 'rgba(239, 68, 68, 0.07)',
      border: '1px solid rgba(239, 68, 68, 0.25)',
      borderRadius: '12px',
      padding: '13px 18px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '14px',
      flexWrap: 'wrap'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        <CalendarX size={18} color="#f87171" style={{ flexShrink: 0 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'var(--text-muted)' }}>
            Applied <strong style={{ color: 'var(--text-main)' }}>{formatShortDate(app.appliedDate, true) || 'Unknown'}</strong>
          </span>
          <ArrowRight size={13} color="var(--text-sub)" />
          <span style={{ color: '#f87171', fontWeight: '700' }}>
            Rejected {app.rejectedDate ? formatShortDate(app.rejectedDate, true) : '(no date set)'}
          </span>
          {turnaroundDays !== null && (
            <span style={{
              fontSize: '0.75rem',
              fontWeight: '700',
              color: 'var(--text-muted)',
              background: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid var(--border-color)',
              padding: '2px 8px',
              borderRadius: '999px'
            }}>
              ⏱️ {turnaroundDays}d response
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {cooloff && (
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '0.78rem',
              fontWeight: '700',
              padding: '4px 10px',
              borderRadius: '999px',
              background: cooloff.isEligible ? 'rgba(74, 222, 128, 0.14)' : 'rgba(56, 189, 248, 0.12)',
              border: `1px solid ${cooloff.isEligible ? 'rgba(74, 222, 128, 0.35)' : 'rgba(56, 189, 248, 0.3)'}`,
              color: cooloff.isEligible ? 'var(--accent-green)' : 'var(--accent-cyan)'
            }}
            title={cooloff.tooltip}
          >
            {cooloff.isEligible ? <CheckCircle2 size={13} /> : <RefreshCw size={12} />}
            {cooloff.isEligible
              ? `6m cool-off complete (ended ${cooloff.eligibleLabel})`
              : `Re-apply eligible ${cooloff.eligibleLabel} (${cooloff.remainingText})`}
          </span>
        )}

        {onQuickDateUpdate && (
          isEditingDate ? (
            <input
              type="date"
              className="form-control"
              defaultValue={app.rejectedDate || getTodayISO()}
              onChange={handleDateChange}
              onBlur={() => setIsEditingDate(false)}
              autoFocus
              style={{ width: 'auto', padding: '4px 8px', fontSize: '0.8rem' }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingDate(true)}
              className="btn btn-secondary"
              style={{
                padding: '4px 10px',
                fontSize: '0.76rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                borderRadius: '8px'
              }}
              title="Set or adjust rejection date"
            >
              <Edit2 size={11} /> {app.rejectedDate ? 'Adjust Date' : 'Set Rejection Date'}
            </button>
          )
        )}
      </div>
    </div>
  );
}
