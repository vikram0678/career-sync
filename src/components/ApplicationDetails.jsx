import { useState, useMemo } from 'react';
import { 
  X, 
  Calendar, 
  Globe, 
  FileText, 
  Briefcase, 
  Download, 
  Eye, 
  Edit2, 
  Check, 
  Copy, 
  AlertTriangle, 
  Sparkles, 
  CheckCircle2, 
  Save, 
  Undo2,
  Send,
  MessageSquare,
  Bot,
  Loader2,
  Target,
  HelpCircle
} from 'lucide-react';
import { generateInterviewPrep, generateResumeBullets } from '../services/aiService';

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

function ApplicationDetails({ 
  app, 
  onClose, 
  onUpdateStatus, 
  onUpdateApplication, 
  profile = {}, 
  user 
}) {
  const [viewingFile, setViewingFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedLinkedIn, setCopiedLinkedIn] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);

  // AI Studio states
  const [aiStudioTab, setAiStudioTab] = useState('interview'); // 'interview' | 'resume' | 'outreach'
  const [interviewData, setInterviewData] = useState(null);
  const [isLoadingInterview, setIsLoadingInterview] = useState(false);
  const [resumeBullets, setResumeBullets] = useState(null);
  const [isLoadingBullets, setIsLoadingBullets] = useState(false);
  const [copiedBulletIdx, setCopiedBulletIdx] = useState(null);
  const [copiedAllPrep, setCopiedAllPrep] = useState(false);

  // Editable form state initialized from app
  const [editForm, setEditForm] = useState({
    role: app.role || '',
    website: app.website || '',
    careerPageUrl: app.careerPageUrl || '',
    appliedDate: app.appliedDate || '',
    status: app.status || 'applied',
    applicationType: app.applicationType || 'self',
    salary: app.salary || '',
    resumeLink: app.resumeLink || '',
    jobDescription: app.jobDescription || ''
  });

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!onUpdateApplication) return;
    setIsSaving(true);
    try {
      await onUpdateApplication({
        ...app,
        ...editForm
      });
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update application:", err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Stagnant follow-up calculation (14+ days)
  const daysSinceApplied = useMemo(() => {
    if (!app.appliedDate) return 0;
    const diff = Date.now() - new Date(app.appliedDate).getTime();
    return Math.max(0, Math.floor(diff / (1000 * 60 * 60 * 24)));
  }, [app.appliedDate]);

  const isStagnant = app.status === 'applied' && daysSinceApplied >= 14;

  const handleCopyFollowUpEmail = () => {
    const candidateName = user?.user_metadata?.full_name || 'Applicant';
    const emailTemplate = `Subject: Following up on Application - ${app.role} - ${candidateName}

Hi Hiring Team,

I hope this email finds you well.

I am writing to politely follow up on my application for the ${app.role} role at ${app.website}, which I submitted on ${app.appliedDate || 'recently'}. 

I remain very enthusiastic about the opportunity to contribute to ${app.website}. Please let me know if there is any additional information or work samples I can provide to assist with the review process.

Thank you very much for your time and consideration.

Best regards,
${candidateName}`;

    navigator.clipboard.writeText(emailTemplate);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyLinkedInNote = () => {
    const topSkills = (profile?.skills || []).slice(0, 3).join(', ');
    const note = `Hi, I noticed ${app.website}'s engineering focus and that you're hiring for a ${app.role}. With hands-on experience in ${topSkills || 'modern software development'}, I'd love to connect and follow ${app.website}'s team journey!`;
    navigator.clipboard.writeText(note);
    setCopiedLinkedIn(true);
    setTimeout(() => setCopiedLinkedIn(false), 2500);
  };

  const handleCopyPitchEmail = () => {
    const candidateName = user?.user_metadata?.full_name || 'Applicant';
    const skillsList = (profile?.skills || []).slice(0, 4).join(', ');
    const template = `Subject: Application & Inquiry: ${app.role} - ${candidateName}

Hi Hiring Team,

I recently submitted my application for the ${app.role} role at ${app.website} and wanted to introduce myself directly.

With a background building scalable applications using ${skillsList || 'modern software technologies'}, I was drawn to ${app.website}'s mission and engineering approach.

I have attached my resume for your convenience and would welcome the opportunity to discuss how my skillset can add immediate value to your team.

Thank you very much for your time and consideration.

Best regards,
${candidateName}
${profile?.portfolioUrl || profile?.githubUrl || ''}`;

    navigator.clipboard.writeText(template);
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2500);
  };

  const handleFetchInterviewPrep = async () => {
    setIsLoadingInterview(true);
    try {
      const data = await generateInterviewPrep(app.role, app.website, app.jobDescription, profile?.skills || []);
      setInterviewData(data);
    } catch (err) {
      console.error("Failed to generate interview prep:", err);
    } finally {
      setIsLoadingInterview(false);
    }
  };

  const handleFetchResumeBullets = async () => {
    setIsLoadingBullets(true);
    try {
      const bullets = await generateResumeBullets(app.role, app.website, app.jobDescription, profile?.skills || []);
      setResumeBullets(bullets);
    } catch (err) {
      console.error("Failed to generate resume bullets:", err);
    } finally {
      setIsLoadingBullets(false);
    }
  };

  const handleCopySingleBullet = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedBulletIdx(idx);
    setTimeout(() => setCopiedBulletIdx(null), 2000);
  };

  const handleCopyAllPrep = () => {
    if (!interviewData) return;
    const lines = [
      `=== INTERVIEW PREPARATION FOR ${app.role.toUpperCase()} AT ${app.website.toUpperCase()} ===\n`,
      `--- TECHNICAL QUESTIONS ---`,
      ...(interviewData.technicalQuestions || []).map((t, i) => `${i + 1}. ${t.question}\nKey points: ${t.keyTopicsToHit}\n`),
      `--- BEHAVIORAL QUESTIONS (STAR) ---`,
      ...(interviewData.behavioralQuestions || []).map((b, i) => `${i + 1}. ${b.question}\nGuidance: ${b.starGuidance}\n`),
      interviewData.companyTips ? `--- COMPANY TIPS ---\n${interviewData.companyTips}` : ''
    ].join('\n');
    navigator.clipboard.writeText(lines);
    setCopiedAllPrep(true);
    setTimeout(() => setCopiedAllPrep(false), 2500);
  };

  // Skill Matcher: compare profile.skills against app.jobDescription
  const skillAnalysis = useMemo(() => {
    const skills = profile?.skills || [];
    const jd = (app.jobDescription || '').toLowerCase();
    if (!jd || skills.length === 0) return null;

    const matched = [];
    const missing = [];

    skills.forEach(skill => {
      const cleanSkill = skill.toLowerCase().trim();
      if (!cleanSkill) return;
      // Search for whole word or substring
      if (jd.includes(cleanSkill)) {
        matched.push(skill);
      } else {
        missing.push(skill);
      }
    });

    const matchPercent = Math.round((matched.length / skills.length) * 100);

    return {
      matched,
      missing,
      matchPercent,
      totalProfileSkills: skills.length
    };
  }, [app.jobDescription, profile?.skills]);

  return (
    <>
      <div className="modal-overlay">
        <div className="glass modal-content glass-panel" style={{ maxWidth: '820px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className={`status-badge status-${app.status}`}>{app.status}</span>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ({app.applicationType === 'college' ? 'College Track' : 'Self Track'})
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {onUpdateApplication && !isEditing && (
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(true)}
                  style={{ padding: '6px 12px', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Edit2 size={15} /> Edit Application
                </button>
              )}
              <button className="modal-close" onClick={onClose} style={{ position: 'static' }}>
                <X size={24} />
              </button>
            </div>
          </div>

          {isEditing ? (
            /* Editing Form Mode */
            <form onSubmit={handleSaveEdit}>
              <h3 style={{ marginBottom: '20px', color: 'var(--accent-cyan)' }}>Edit Application Details</h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Role</label>
                  <input
                    type="text"
                    name="role"
                    className="form-control"
                    value={editForm.role}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Company Name</label>
                  <input
                    type="text"
                    name="website"
                    className="form-control"
                    value={editForm.website}
                    onChange={handleEditChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Careers / Portal URL</label>
                  <input
                    type="url"
                    name="careerPageUrl"
                    className="form-control"
                    value={editForm.careerPageUrl}
                    onChange={handleEditChange}
                    placeholder="https://..."
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Application Track</label>
                  <select
                    name="applicationType"
                    className="form-control"
                    value={editForm.applicationType}
                    onChange={handleEditChange}
                  >
                    <option value="self">Self / Off-Campus</option>
                    <option value="college">College / On-Campus</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Applied Date</label>
                  <input
                    type="date"
                    name="appliedDate"
                    className="form-control"
                    value={editForm.appliedDate}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Status</label>
                  <select
                    name="status"
                    className="form-control"
                    value={editForm.status}
                    onChange={handleEditChange}
                  >
                    <option value="applied">Applied</option>
                    <option value="interview">Interview</option>
                    <option value="offer">Offer</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div className="form-group" style={{ margin: 0 }}>
                  <label>Salary / Stipend</label>
                  <input
                    type="text"
                    name="salary"
                    className="form-control"
                    value={editForm.salary}
                    onChange={handleEditChange}
                    placeholder="e.g. $100k or 30k/mo"
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>External Resume Link (Optional)</label>
                <input
                  type="url"
                  name="resumeLink"
                  className="form-control"
                  value={editForm.resumeLink}
                  onChange={handleEditChange}
                  placeholder="https://drive.google.com/..."
                />
              </div>

              <div className="form-group" style={{ marginBottom: '24px' }}>
                <label>Job Description (JD)</label>
                <textarea
                  name="jobDescription"
                  className="form-control"
                  rows="5"
                  value={editForm.jobDescription}
                  onChange={handleEditChange}
                  placeholder="Paste or update the job description..."
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditForm({
                      role: app.role || '',
                      website: app.website || '',
                      careerPageUrl: app.careerPageUrl || '',
                      appliedDate: app.appliedDate || '',
                      status: app.status || 'applied',
                      applicationType: app.applicationType || 'self',
                      salary: app.salary || '',
                      resumeLink: app.resumeLink || '',
                      jobDescription: app.jobDescription || ''
                    });
                    setIsEditing(false);
                  }}
                  disabled={isSaving}
                >
                  <Undo2 size={16} /> Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isSaving}>
                  <Save size={16} /> {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            /* View Mode */
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                <div>
                  <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{app.role}</h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', color: 'var(--text-muted)' }}>
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
                      <Calendar size={18} /> {app.appliedDate || 'No date set'}
                    </span>
                    {app.salary && (
                      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                         • Salary: <strong style={{ color: 'var(--text-main)' }}>{app.salary}</strong>
                      </span>
                    )}
                  </div>
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                  <select 
                    className="form-control" 
                    style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
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

              {/* 14+ Days Stagnant Follow-Up Reminder */}
              {isStagnant && (
                <div style={{
                  background: 'rgba(245, 158, 11, 0.1)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  borderRadius: '12px',
                  padding: '14px 18px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <AlertTriangle size={20} color="#f59e0b" style={{ flexShrink: 0 }} />
                    <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>
                      <strong>{daysSinceApplied} days</strong> since applied. Consider sending a friendly follow-up note to the recruiter.
                    </span>
                  </div>
                  <button
                    onClick={handleCopyFollowUpEmail}
                    className="btn btn-secondary"
                    style={{
                      padding: '6px 12px',
                      fontSize: '0.82rem',
                      background: 'rgba(245, 158, 11, 0.2)',
                      color: '#f59e0b',
                      border: '1px solid rgba(245, 158, 11, 0.5)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    {copiedEmail ? <Check size={14} /> : <Copy size={14} />}
                    {copiedEmail ? 'Email Copied!' : 'Copy Follow-up Email'}
                  </button>
                </div>
              )}

              {/* Skill Matcher Insight */}
              {skillAnalysis && (
                <div className="glass glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0, fontSize: '1rem', color: 'var(--accent-cyan)' }}>
                      <Sparkles size={16} /> Profile Skill Matcher
                    </h3>
                    <span style={{ 
                      fontSize: '0.85rem', 
                      fontWeight: '700', 
                      color: skillAnalysis.matchPercent >= 60 ? 'var(--accent-green)' : 'var(--accent-orange)' 
                    }}>
                      {skillAnalysis.matchPercent}% Match ({skillAnalysis.matched.length}/{skillAnalysis.totalProfileSkills} profile skills found in JD)
                    </span>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {skillAnalysis.matched.map(skill => (
                      <span 
                        key={skill} 
                        style={{
                          background: 'rgba(74, 222, 128, 0.15)',
                          color: 'var(--accent-green)',
                          border: '1px solid rgba(74, 222, 128, 0.3)',
                          borderRadius: '999px',
                          padding: '3px 10px',
                          fontSize: '0.78rem',
                          fontWeight: '600',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={12} /> {skill}
                      </span>
                    ))}
                    {skillAnalysis.missing.map(skill => (
                      <span 
                        key={skill} 
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          color: 'var(--text-muted)',
                          border: '1px solid var(--glass-border)',
                          borderRadius: '999px',
                          padding: '3px 10px',
                          fontSize: '0.78rem'
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* AI Career Studio Component */}
              <div className="glass glass-panel" style={{
                background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.05) 0%, rgba(0, 180, 216, 0.05) 100%)',
                border: '1px solid rgba(168, 85, 247, 0.25)',
                padding: '18px',
                marginBottom: '20px',
                borderRadius: '16px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Bot size={20} color="var(--accent-purple)" />
                    <h3 style={{ margin: 0, fontSize: '1.05rem', color: 'var(--text-main)' }}>AI Career Studio</h3>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(168, 85, 247, 0.15)', color: 'var(--accent-purple)', padding: '2px 8px', borderRadius: '999px', fontWeight: '700' }}>
                      Gemini 2.0 Flash
                    </span>
                  </div>

                  {/* Studio Subtabs */}
                  <div style={{ display: 'flex', background: 'var(--glass-border)', padding: '3px', borderRadius: '8px', gap: '2px' }}>
                    <button
                      type="button"
                      onClick={() => setAiStudioTab('interview')}
                      style={{
                        padding: '5px 10px',
                        fontSize: '0.78rem',
                        background: aiStudioTab === 'interview' ? 'var(--glass-bg)' : 'transparent',
                        color: aiStudioTab === 'interview' ? 'var(--accent-cyan)' : 'var(--text-muted)',
                        fontWeight: '700',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <HelpCircle size={13} /> Interview Prep
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiStudioTab('resume')}
                      style={{
                        padding: '5px 10px',
                        fontSize: '0.78rem',
                        background: aiStudioTab === 'resume' ? 'var(--glass-bg)' : 'transparent',
                        color: aiStudioTab === 'resume' ? 'var(--accent-green)' : 'var(--text-muted)',
                        fontWeight: '700',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Target size={13} /> Resume Bullets
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiStudioTab('outreach')}
                      style={{
                        padding: '5px 10px',
                        fontSize: '0.78rem',
                        background: aiStudioTab === 'outreach' ? 'var(--glass-bg)' : 'transparent',
                        color: aiStudioTab === 'outreach' ? 'var(--accent-purple)' : 'var(--text-muted)',
                        fontWeight: '700',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <Send size={13} /> Outreach Notes
                    </button>
                  </div>
                </div>

                {/* Tab 1: Interview Prep */}
                {aiStudioTab === 'interview' && (
                  <div>
                    {!interviewData ? (
                      <div style={{ textAlign: 'center', padding: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
                          Generate role-specific technical questions, architecture scenarios, and behavioral STAR talking points.
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleFetchInterviewPrep}
                          disabled={isLoadingInterview}
                          style={{ padding: '8px 18px', fontSize: '0.85rem', margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          {isLoadingInterview ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                          {isLoadingInterview ? 'Predicting Questions with AI...' : '✨ Generate Predicted Interview Questions'}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>
                            Predicted Technical & Behavioral Questions
                          </span>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCopyAllPrep}
                            style={{ padding: '4px 10px', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            {copiedAllPrep ? <Check size={13} color="var(--accent-green)" /> : <Copy size={13} />}
                            {copiedAllPrep ? 'All Copied!' : 'Copy Full Prep Notes'}
                          </button>
                        </div>

                        {/* Technical Questions */}
                        <div>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '8px' }}>Technical Deep-Dive:</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {interviewData.technicalQuestions?.map((q, i) => (
                              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem' }}>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                                  {i + 1}. {q.question}
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                  💡 <strong>Key areas to hit:</strong> {q.keyTopicsToHit}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Behavioral Questions */}
                        <div>
                          <h4 style={{ fontSize: '0.85rem', color: 'var(--text-main)', marginBottom: '8px' }}>Behavioral (STAR Method):</h4>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {interviewData.behavioralQuestions?.map((q, i) => (
                              <div key={i} style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: '8px', fontSize: '0.82rem' }}>
                                <div style={{ fontWeight: '700', color: 'var(--text-main)', marginBottom: '4px' }}>
                                  {i + 1}. {q.question}
                                </div>
                                <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                                  ⭐ <strong>STAR Guidance:</strong> {q.starGuidance}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {interviewData.companyTips && (
                          <div style={{ fontSize: '0.8rem', color: 'var(--accent-purple)', background: 'rgba(168, 85, 247, 0.1)', padding: '8px 12px', borderRadius: '8px' }}>
                            📌 <strong>Company Tip:</strong> {interviewData.companyTips}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 2: Resume Bullets Optimizer */}
                {aiStudioTab === 'resume' && (
                  <div>
                    {!resumeBullets ? (
                      <div style={{ textAlign: 'center', padding: '16px' }}>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>
                          Generate 3 tailored, quantified achievement bullets following Google's XYZ formula ("Accomplished [X] as measured by [Y] by doing [Z]").
                        </p>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={handleFetchResumeBullets}
                          disabled={isLoadingBullets}
                          style={{ padding: '8px 18px', fontSize: '0.85rem', margin: '0 auto', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                        >
                          {isLoadingBullets ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                          {isLoadingBullets ? 'Optimizing Bullets with AI...' : '✨ Generate Tailored Resume Bullets'}
                        </button>
                      </div>
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <span style={{ fontSize: '0.82rem', fontWeight: '700', color: 'var(--accent-green)' }}>
                          Tailored Resume Achievement Bullets (XYZ Formula):
                        </span>
                        {resumeBullets.map((bullet, idx) => (
                          <div
                            key={idx}
                            style={{
                              background: 'rgba(0,0,0,0.2)',
                              padding: '10px 14px',
                              borderRadius: '8px',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              gap: '12px'
                            }}
                          >
                            <span style={{ fontSize: '0.84rem', color: 'var(--text-main)', lineHeight: '1.4' }}>
                              • {bullet}
                            </span>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              onClick={() => handleCopySingleBullet(bullet, idx)}
                              style={{ padding: '4px 8px', fontSize: '0.75rem', flexShrink: 0 }}
                              title="Copy bullet point"
                            >
                              {copiedBulletIdx === idx ? <Check size={13} color="var(--accent-green)" /> : <Copy size={13} />}
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Tab 3: Outreach & Cold Pitch Assistant */}
                {aiStudioTab === 'outreach' && (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <button
                      onClick={handleCopyLinkedInNote}
                      className="btn btn-secondary"
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="Copy personalized 300-char LinkedIn connection request note"
                    >
                      {copiedLinkedIn ? <Check size={14} color="var(--accent-green)" /> : <MessageSquare size={14} color="var(--accent-cyan)" />}
                      {copiedLinkedIn ? 'LinkedIn Note Copied!' : 'Copy LinkedIn Connect Note (<300 chars)'}
                    </button>

                    <button
                      onClick={handleCopyPitchEmail}
                      className="btn btn-secondary"
                      style={{
                        padding: '8px 14px',
                        fontSize: '0.82rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                      title="Copy professional cold intro / cover pitch email"
                    >
                      {copiedPitch ? <Check size={14} color="var(--accent-green)" /> : <Send size={14} color="var(--accent-purple)" />}
                      {copiedPitch ? 'Pitch Email Copied!' : 'Copy Intro / Pitch Email'}
                    </button>
                  </div>
                )}
              </div>

              <div style={{ display: 'grid', gap: '20px' }}>
                <div className="glass glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1.1rem' }}>
                    <FileText size={18} color="var(--accent-cyan)" />
                    Resume Used
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <p style={{ margin: 0 }}>{app.resumeUsed || 'No custom resume attached'}</p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      {app.resumeUrl && (
                        <>
                          <button 
                            onClick={() => setViewingFile({ url: app.resumeUrl, type: 'pdf' })}
                            className="btn btn-secondary"
                            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                          >
                            <Eye size={16} /> View Attached
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
                        </>
                      )}
                      {app.resumeLink && (
                        <a
                          href={app.resumeLink}
                          target="_blank"
                          rel="noreferrer"
                          className="btn btn-secondary"
                          style={{ padding: '6px 12px', fontSize: '0.85rem' }}
                        >
                          External Drive Link
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div className="glass glass-panel" style={{ background: 'rgba(0,0,0,0.2)', padding: '16px' }}>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px', fontSize: '1.1rem' }}>
                    <Briefcase size={18} color="var(--accent-purple)" />
                    Job Description
                  </h3>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-main)', lineHeight: '1.6', maxHeight: '250px', overflowY: 'auto' }}>
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
                    <p style={{ color: 'var(--text-muted)', margin: 0 }}>No screenshots uploaded for this application.</p>
                  )}
                </div>
              </div>
            </>
          )}
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
