import { useState } from 'react';

/**
 * Derives a deterministic vibrant gradient from any company name string.
 */
function getDeterministicGradient(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const h1 = Math.abs(hash) % 360;
  const h2 = (h1 + 45) % 360;
  return `linear-gradient(135deg, hsl(${h1}, 70%, 48%) 0%, hsl(${h2}, 75%, 38%) 100%)`;
}

/**
 * Extracts clean domain hostname from a URL or company name
 */
function extractDomain(url, name) {
  if (url && typeof url === 'string') {
    try {
      const parsed = new URL(url.startsWith('http') ? url : `https://${url}`);
      return parsed.hostname.replace('www.', '');
    } catch {
      // ignore
    }
  }
  if (name && typeof name === 'string') {
    const cleaned = name.trim().toLowerCase();
    if (cleaned.includes('.')) {
      return cleaned.replace('www.', '');
    }
    // common fallback for big brands if user just entered simple name
    const singleWord = cleaned.replace(/[^a-z0-9]/g, '');
    if (singleWord.length > 2) {
      return `${singleWord}.com`;
    }
  }
  return '';
}

export default function CompanyAvatar({ 
  company = '', 
  url = '', 
  size = 36, 
  borderRadius = 10,
  style = {} 
}) {
  const [imgError, setImgError] = useState(false);
  const domain = extractDomain(url, company);

  const monogram = (company || domain || '?')
    .trim()
    .slice(0, 2)
    .toUpperCase();

  const faviconUrl = domain && !imgError
    ? `https://www.google.com/s2/favicons?domain=${encodeURIComponent(domain)}&sz=128`
    : null;

  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size}px`,
        minWidth: `${size}px`,
        borderRadius: `${borderRadius}px`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--glass-card)',
        border: '1px solid var(--glass-border)',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        position: 'relative',
        flexShrink: 0,
        ...style
      }}
      title={company || domain}
    >
      {faviconUrl ? (
        <img
          src={faviconUrl}
          alt={company || 'Company'}
          onError={() => setImgError(true)}
          style={{
            width: `${Math.round(size * 0.65)}px`,
            height: `${Math.round(size * 0.65)}px`,
            objectFit: 'contain'
          }}
          loading="lazy"
        />
      ) : (
        <div
          style={{
            width: '100%',
            height: '100%',
            background: getDeterministicGradient(company || domain),
            color: '#ffffff',
            fontWeight: '700',
            fontSize: `${Math.max(10, Math.round(size * 0.38))}px`,
            letterSpacing: '0.5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'system-ui, sans-serif',
            userSelect: 'none'
          }}
        >
          {monogram}
        </div>
      )}
    </div>
  );
}
