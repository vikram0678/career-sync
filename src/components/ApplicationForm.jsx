import { useState } from 'react';
import { X, UploadCloud, FileText, Sparkles, Wand2, CheckCircle2 } from 'lucide-react';
import { parseJobDescription } from '../services/aiService';

function ApplicationForm({ onClose, onSubmit, initialType, profile }) {
  const [formData, setFormData] = useState({
    role: '',
    website: '',
    resumeUsed: '',
    appliedDate: new Date().toISOString().split('T')[0],
    jobDescription: '',
    status: 'applied',
    applicationType: initialType || 'self',
    salary: '',
    resumeLink: '',
    screenshots: []
  });

  const [rawJobText, setRawJobText] = useState('');
  const [isMagicParsing, setIsMagicParsing] = useState(false);
  const [magicParseSuccess, setMagicParseSuccess] = useState(false);
  const [showMagicPaste, setShowMagicPaste] = useState(false);

  const [resumeFileObj, setResumeFileObj] = useState(null);
  const [screenshotFileObjs, setScreenshotFileObjs] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMagicParse = async () => {
    if (!rawJobText.trim()) return;
    setIsMagicParsing(true);
    setErrorMsg('');
    try {
      const parsed = await parseJobDescription(rawJobText);
      setFormData(prev => ({
        ...prev,
        role: parsed.role || prev.role,
        website: parsed.company || prev.website,
        salary: parsed.salary || prev.salary,
        jobDescription: parsed.jobDescription || prev.jobDescription,
        applicationType: parsed.applicationType || prev.applicationType
      }));
      setMagicParseSuccess(true);
      setTimeout(() => setMagicParseSuccess(false), 3500);
    } catch (err) {
      console.error("Magic paste error:", err);
      setErrorMsg("Could not parse text automatically. Please fill fields below.");
    } finally {
      setIsMagicParsing(false);
    }
  };

  const handleUseMasterResume = () => {
    if (profile?.masterResumeUrl) {
      setResumeFileObj(null);
      setFormData({
        ...formData,
        resumeUsed: profile.masterResumeName || 'Master_Resume.pdf',
        resumeUrl: profile.masterResumeUrl
      });
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    const newApp = { ...formData };
    try {
      await onSubmit(newApp, resumeFileObj, screenshotFileObjs);
    } catch (err) {
      setErrorMsg(err.message || 'An error occurred while saving.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass modal-content glass-panel" style={{ maxWidth: '820px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ margin: 0, fontSize: '1.8rem' }}>Track New Application</h2>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setShowMagicPaste(!showMagicPaste)}
            style={{
              padding: '6px 12px',
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: showMagicPaste ? 'rgba(168, 85, 247, 0.2)' : 'var(--glass-bg)',
              color: 'var(--accent-purple)',
              border: '1px solid rgba(168, 85, 247, 0.4)'
            }}
          >
            <Wand2 size={15} /> {showMagicPaste ? 'Hide AI Magic Paste' : '✨ AI Magic Paste'}
          </button>
        </div>

        {/* AI Magic Paste Accordion */}
        {showMagicPaste && (
          <div style={{
            background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.08) 0%, rgba(0, 180, 216, 0.08) 100%)',
            border: '1px solid rgba(168, 85, 247, 0.3)',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <Sparkles size={16} color="var(--accent-purple)" />
              <span style={{ fontWeight: '700', fontSize: '0.9rem', color: 'var(--accent-purple)' }}>
                Paste Raw Job Posting & Auto-Fill Form
              </span>
            </div>
            <textarea
              className="form-control"
              rows="4"
              value={rawJobText}
              onChange={(e) => setRawJobText(e.target.value)}
              placeholder="Paste raw text from LinkedIn, Indeed, or company job description here..."
              style={{ fontSize: '0.85rem', marginBottom: '12px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                Powered by Gemini 2.0 Flash (extracts title, company, salary, and requirements)
              </span>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleMagicParse}
                disabled={isMagicParsing || !rawJobText.trim()}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.85rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Wand2 size={15} /> {isMagicParsing ? 'Extracting with AI...' : '✨ Auto-Fill Fields'}
              </button>
            </div>
            {magicParseSuccess && (
              <div style={{
                marginTop: '10px',
                color: 'var(--accent-green)',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: '600'
              }}>
                <CheckCircle2 size={16} /> Successfully extracted and auto-filled application fields!
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                className="form-control"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend Developer"
              />
            </div>

            <div className="form-group">
              <label htmlFor="applicationType">Application Type</label>
              <select
                id="applicationType"
                name="applicationType"
                className="form-control"
                value={formData.applicationType}
                onChange={handleChange}
              >
                <option value="self">Self / Off-Campus</option>
                <option value="college">College / On-Campus</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="website">Company Name</label>
              <input
                type="text"
                id="website"
                name="website"
                className="form-control"
                value={formData.website}
                onChange={handleChange}
                placeholder="e.g. Google"
              />
            </div>

            <div className="form-group">
              <label htmlFor="careerPageUrl">Careers Page URL</label>
              <input
                type="url"
                id="careerPageUrl"
                name="careerPageUrl"
                className="form-control"
                value={formData.careerPageUrl || ''}
                onChange={handleChange}
                placeholder="https://careers..."
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="appliedDate">Applied Date</label>
              <input
                type="date"
                id="appliedDate"
                name="appliedDate"
                className="form-control"
                value={formData.appliedDate}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                className="form-control"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="applied">Applied</option>
                <option value="interview">Interview</option>
                <option value="offer">Offer</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="salary">Salary / Stipend</label>
              <input
                type="text"
                id="salary"
                name="salary"
                className="form-control"
                value={formData.salary}
                onChange={handleChange}
                placeholder="e.g. $100k or 20k/mo"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="resumeFile" style={{ display: 'flex', alignItems: 'center', gap: '6px', margin: 0 }}>
                  <UploadCloud size={18} color="var(--accent-cyan)" />
                  Upload Resume
                </label>
                {profile?.masterResumeUrl && (
                  <button 
                    type="button" 
                    className="btn btn-secondary" 
                    style={{ padding: '2px 8px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(56, 189, 248, 0.1)', color: 'var(--accent-cyan)', border: '1px solid rgba(56, 189, 248, 0.3)' }}
                    onClick={handleUseMasterResume}
                    title="Quickly attach your saved Master Resume"
                  >
                    <Sparkles size={12} /> Use Master Resume
                  </button>
                )}
              </div>
              <input
                type="file"
                id="resumeFile"
                name="resumeFile"
                className="form-control"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  if (e.target.files[0]) {
                    setResumeFileObj(e.target.files[0]);
                    setFormData({
                      ...formData,
                      resumeUsed: e.target.files[0].name,
                      resumeUrl: URL.createObjectURL(e.target.files[0])
                    });
                  }
                }}
              />
              {formData.resumeUsed && (
                <div style={{ marginTop: '6px', fontSize: '0.85rem', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <FileText size={14} /> Selected: <strong>{formData.resumeUsed}</strong>
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="resumeLink">Or Resume Link (Optional)</label>
              <input
                type="url"
                id="resumeLink"
                name="resumeLink"
                className="form-control"
                value={formData.resumeLink || ''}
                onChange={handleChange}
                placeholder="https://drive.google.com/..."
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="jobDescription">Job Description (JD)</label>
            <textarea
              id="jobDescription"
              name="jobDescription"
              className="form-control"
              rows="4"
              value={formData.jobDescription}
              onChange={handleChange}
              placeholder="Paste the job description here..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="screenshotFiles">Screenshots (Select multiple)</label>
            <input
              type="file"
              id="screenshotFiles"
              name="screenshotFiles"
              className="form-control"
              accept="image/*"
              multiple
              onChange={(e) => {
                if (e.target.files && e.target.files.length > 0) {
                  const files = Array.from(e.target.files);
                  setScreenshotFileObjs([...screenshotFileObjs, ...files]);
                  const newScreenshots = files.map(file => URL.createObjectURL(file));
                  setFormData({
                    ...formData,
                    screenshots: [...(formData.screenshots || []), ...newScreenshots]
                  });
                }
              }}
            />
            {formData.screenshots && formData.screenshots.length > 0 && (
              <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto' }}>
                {formData.screenshots.map((src, i) => (
                  <img key={i} src={src} alt="Preview" style={{ height: '60px', borderRadius: '4px', objectFit: 'cover' }} />
                ))}
              </div>
            )}
          </div>

          {errorMsg && (
            <div style={{ padding: '12px', background: 'rgba(220, 38, 38, 0.1)', border: '1px solid rgba(220, 38, 38, 0.5)', color: '#ef4444', borderRadius: '8px', marginTop: '20px' }}>
              {errorMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={isSubmitting}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
