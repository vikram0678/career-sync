/**
 * Parses a YYYY-MM-DD (or ISO) string into a local midnight Date object,
 * preventing UTC-to-local off-by-one-day shifts across timezones.
 */
export function parseLocalDate(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const match = dateStr.trim().match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (match) {
    const year = Number(match[1]);
    const month = Number(match[2]) - 1;
    const day = Number(match[3]);
    const d = new Date(year, month, day);
    return Number.isNaN(d.getTime()) ? null : d;
  }
  const parsed = new Date(dateStr);
  if (Number.isNaN(parsed.getTime())) return null;
  return new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate());
}

/**
 * Returns today's local calendar date formatted as YYYY-MM-DD.
 */
export function getTodayISO() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Formats a YYYY-MM-DD date string into a compact label (e.g. "Nov 28" or "Nov 28, 2026").
 */
export function formatShortDate(dateStr, includeYear = false) {
  const d = parseLocalDate(dateStr);
  if (!d) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {})
  });
}

/**
 * Calculates whole days elapsed between appliedDate and rejectedDate.
 * Returns null if either date is missing, invalid, or rejectedDate precedes appliedDate.
 */
export function getTurnaroundDays(appliedDate, rejectedDate) {
  const start = parseLocalDate(appliedDate);
  const end = parseLocalDate(rejectedDate);
  if (!start || !end) return null;
  const diffDays = Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return diffDays >= 0 ? diffDays : null;
}

/**
 * Computes 6-month (default) re-application cool-off status from a rejection date.
 */
export function getCooloffInfo(rejectedDate, cooloffMonths = 6) {
  const rej = parseLocalDate(rejectedDate);
  if (!rej) return null;

  // Clamp day to last day of target month (e.g. Aug 31 + 6m -> Feb 28/29)
  const targetMonthIndex = rej.getMonth() + cooloffMonths;
  const targetYear = rej.getFullYear() + Math.floor(targetMonthIndex / 12);
  const normalizedMonth = ((targetMonthIndex % 12) + 12) % 12;
  const lastDayOfTargetMonth = new Date(targetYear, normalizedMonth + 1, 0).getDate();
  const eligibleDate = new Date(targetYear, normalizedMonth, Math.min(rej.getDate(), lastDayOfTargetMonth));

  const today = parseLocalDate(getTodayISO());
  const daysRemaining = Math.round((eligibleDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  const eligibleISO = `${eligibleDate.getFullYear()}-${String(eligibleDate.getMonth() + 1).padStart(2, '0')}-${String(eligibleDate.getDate()).padStart(2, '0')}`;
  const eligibleLabel = formatShortDate(eligibleISO, true);

  if (daysRemaining <= 0) {
    return {
      isEligible: true,
      daysRemaining: 0,
      eligibleISO,
      eligibleLabel,
      remainingText: 'Eligible to re-apply now',
      tooltip: `Cool-off ended ${eligibleLabel} — Eligible to re-apply`
    };
  }

  let remainingText;
  if (daysRemaining < 30) {
    remainingText = `in ${daysRemaining}d`;
  } else {
    const approxMonths = Math.floor(daysRemaining / 30);
    const remDays = daysRemaining % 30;
    remainingText = remDays >= 3 ? `in ~${approxMonths}mo ${remDays}d` : `in ~${approxMonths}mo`;
  }

  return {
    isEligible: false,
    daysRemaining,
    eligibleISO,
    eligibleLabel,
    remainingText,
    tooltip: `${cooloffMonths}-month cool-off ends ${eligibleLabel} (${remainingText})`
  };
}
