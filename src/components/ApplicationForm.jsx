import { useState } from 'react';
import { X, UploadCloud } from 'lucide-react';

function ApplicationForm({ onClose, onSubmit, initialType }) {
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
  
  const [resumeFileObj, setResumeFileObj] = useState(null);
  const [screenshotFileObjs, setScreenshotFileObjs] = useState([]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newApp = { ...formData };
    onSubmit(newApp, resumeFileObj, screenshotFileObjs);
  };

  return (
    <div className="modal-overlay">
      <div className="glass modal-content glass-panel">
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '24px', fontSize: '1.8rem' }}>Track New Application</h2>
        
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
              <label htmlFor="resumeFile">Upload Resume (Optional)</label>
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
              {formData.resumeUsed && <small style={{ color: 'var(--text-muted)' }}>Selected: {formData.resumeUsed}</small>}
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

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Application</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ApplicationForm;
