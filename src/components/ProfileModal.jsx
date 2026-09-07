import { useState } from 'react';
import { 
  X, 
  User, 
  FileText, 
  Globe, 
  DollarSign, 
  Download, 
  Eye, 
  Check, 
  Copy, 
  Sparkles
} from 'lucide-react';

function ProfileModal({ 
  user, 
  profile = {}, 
  onSaveProfile, 
  onClose, 
  onUploadResume,
  onExportCSV 
}) {
  const [formData, setFormData] = useState({
    headline: profile.headline || 'Software Engineer & Builder',
    githubUrl: profile.githubUrl || '',
    linkedinUrl: profile.linkedinUrl || '',
    portfolioUrl: profile.portfolioUrl || '',
    targetSalary: profile.targetSalary || '',
    skills: profile.skills || ['React', 'JavaScript', 'Node.js', 'PostgreSQL'],
    masterResumeUrl: profile.masterResumeUrl || '',
    masterResumeName: profile.masterResumeName || ''
  });

  const [newSkill, setNewSkill] = useState('');
  const [copiedField, setCopiedField] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [previewingResume, setPreviewingResume] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAddSkill = (e) => {
    e.preventDefault();
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(s => s !== skillToRemove)
    });
  };

  const handleCopy = (text, fieldName) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleResumeFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setIsUploading(true);
    try {
      const publicUrl = await onUploadResume(file);
      setFormData(prev => ({
        ...prev,
        masterResumeUrl: publicUrl,
        masterResumeName: file.name
      }));
    } catch (err) {
      console.error("Resume upload error:", err);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSaveProfile(formData);
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save profile.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ zIndex: 9999 }}>
      <div className="glass modal-content glass-panel profile-modal-container" style={{ maxWidth: '680px', width: '92%' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        {/* Profile Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '24px', borderBottom: '1px solid var(--border-color)', paddingBottom: '20px' }}>
          <img 
            src={user?.user_metadata?.avatar_url || 'https://ui-avatars.com/api/?name=User'} 
            alt="Profile" 
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '3px solid var(--accent-cyan)', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }} 
          />
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ margin: 0, fontSize: '1.6rem', color: 'var(--text-main)' }}>
                {user?.user_metadata?.full_name || 'CareerSeeker'}
              </h2>
              <span style={{ background: 'rgba(34, 197, 94, 0.2)', color: '#86efac', fontSize: '0.75rem', fontWeight: '700', padding: '2px 8px', borderRadius: '999px' }}>
                Google Verified
              </span>
            </div>
            <p style={{ margin: '4px 0 0 0', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {user?.email}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Professional Headline */}
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={16} color="var(--accent-cyan)" /> Professional Title / Headline
            </label>
            <input 
              type="text" 
              name="headline" 
              className="form-control" 
              value={formData.headline}
              onChange={handleChange}
              placeholder="e.g. Full Stack Developer | AI Enthusiast"
            />
          </div>

          {/* Section 1: Master Resume Vault */}
          <div className="glass" style={{ padding: '16px', borderRadius: '12px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <label style={{ margin: 0, fontWeight: '700', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-cyan)' }}>
                <FileText size={18} /> Master Resume Vault
              </label>
              {formData.masterResumeUrl && (
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    type="button"
                    className="btn btn-secondary" 
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                    onClick={() => setPreviewingResume(!previewingResume)}
                  >
                    <Eye size={14} /> {previewingResume ? 'Hide' : 'Preview'}
                  </button>
                  <a 
                    href={formData.masterResumeUrl} 
                    target="_blank" 
                    rel="noreferrer" 
                    download 
                    className="btn btn-primary"
                    style={{ padding: '4px 8px', fontSize: '0.75rem' }}
                  >
                    <Download size={14} /> Download
                  </a>
                </div>
              )}
            </div>

            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px 0' }}>
              Upload your primary resume once. You can attach it to any job in 1-click!
            </p>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <input 
                type="file" 
                accept=".pdf,.doc,.docx"
                id="masterResumeInput" 
                style={{ display: 'none' }}
                onChange={handleResumeFileChange}
                disabled={isUploading}
              />
              <label 
                htmlFor="masterResumeInput" 
                className="btn btn-secondary"
                style={{ cursor: 'pointer', padding: '8px 16px', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
              >
                <FileText size={16} color="var(--accent-cyan)" />
                {isUploading ? 'Uploading...' : formData.masterResumeName ? 'Replace Master Resume' : 'Upload Master Resume (PDF)'}
              </label>
              {formData.masterResumeName && (
                <span style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: '600' }}>
                  📄 {formData.masterResumeName}
                </span>
              )}
            </div>

            {previewingResume && formData.masterResumeUrl && (
              <div style={{ marginTop: '14px', height: '240px', borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <iframe 
                  src={`https://docs.google.com/viewer?url=${encodeURIComponent(formData.masterResumeUrl)}&embedded=true`} 
                  style={{ width: '100%', height: '100%', border: 'none' }} 
                  title="Master Resume Preview" 
                />
              </div>
            )}
          </div>

          {/* Section 2: Quick-Copy Developer Links */}
          <div>
            <label style={{ fontWeight: '700', marginBottom: '8px', display: 'block', color: 'var(--text-main)' }}>
              Developer & Social Links (Quick-Copy)
            </label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              
              {/* GitHub */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <input 
                  type="url" 
                  name="githubUrl" 
                  className="form-control" 
                  value={formData.githubUrl} 
                  onChange={handleChange} 
                  placeholder="https://github.com/your-username"
                />
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '0 12px' }}
                  onClick={() => handleCopy(formData.githubUrl, 'github')}
                  title="Copy GitHub URL"
                >
                  {copiedField === 'github' ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
                </button>
              </div>

              {/* LinkedIn */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="#38bdf8">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <input 
                  type="url" 
                  name="linkedinUrl" 
                  className="form-control" 
                  value={formData.linkedinUrl} 
                  onChange={handleChange} 
                  placeholder="https://linkedin.com/in/your-profile"
                />
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '0 12px' }}
                  onClick={() => handleCopy(formData.linkedinUrl, 'linkedin')}
                  title="Copy LinkedIn URL"
                >
                  {copiedField === 'linkedin' ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
                </button>
              </div>

              {/* Portfolio */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '0 10px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px' }}>
                  <Globe size={18} color="var(--accent-purple)" />
                </div>
                <input 
                  type="url" 
                  name="portfolioUrl" 
                  className="form-control" 
                  value={formData.portfolioUrl} 
                  onChange={handleChange} 
                  placeholder="https://yourportfolio.com"
                />
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '0 12px' }}
                  onClick={() => handleCopy(formData.portfolioUrl, 'portfolio')}
                  title="Copy Portfolio URL"
                >
                  {copiedField === 'portfolio' ? <Check size={16} color="#4ade80" /> : <Copy size={16} />}
                </button>
              </div>

            </div>
          </div>

          {/* Section 3: Target Salary & Skills Matrix */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <DollarSign size={16} color="var(--accent-green)" /> Target Expected Salary
              </label>
              <input 
                type="text" 
                name="targetSalary" 
                className="form-control" 
                value={formData.targetSalary} 
                onChange={handleChange} 
                placeholder="e.g. $120k or 15-20 LPA"
              />
            </div>

            <div className="form-group">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sparkles size={16} color="var(--accent-orange)" /> Add Key Skill
              </label>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input 
                  type="text" 
                  className="form-control" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  placeholder="e.g. TypeScript"
                  onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(e); }}
                />
                <button type="button" className="btn btn-secondary" onClick={handleAddSkill}>
                  Add
                </button>
              </div>
            </div>
          </div>

          {/* Skills Tags Display */}
          {formData.skills.length > 0 && (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {formData.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className="glass"
                  style={{ 
                    padding: '4px 10px', 
                    borderRadius: '999px', 
                    fontSize: '0.8rem', 
                    display: 'inline-flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    background: 'rgba(56, 189, 248, 0.1)',
                    color: 'var(--text-main)',
                    border: '1px solid rgba(56, 189, 248, 0.2)'
                  }}
                >
                  {skill}
                  <X 
                    size={12} 
                    style={{ cursor: 'pointer', color: 'var(--text-muted)' }} 
                    onClick={() => handleRemoveSkill(skill)} 
                  />
                </span>
              ))}
            </div>
          )}

          {/* Section 4: 1-Click CSV Export Banner */}
          {onExportCSV && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderRadius: '10px', background: 'rgba(255, 255, 255, 0.04)', border: '1px solid var(--border-color)', marginTop: '8px' }}>
              <div>
                <div style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--text-main)' }}>Export Application Data</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Download your entire job hunt spreadsheet as a .CSV file.</div>
              </div>
              <button 
                type="button" 
                className="btn btn-secondary" 
                style={{ padding: '6px 12px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                onClick={onExportCSV}
              >
                <Download size={14} /> Export CSV
              </button>
            </div>
          )}

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '12px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSaving}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Profile Changes'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default ProfileModal;
