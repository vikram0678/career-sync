import { useState } from 'react';
import { X } from 'lucide-react';

function GoalForm({ initialGoal, onClose, onSubmit }) {
  const [formData, setFormData] = useState(initialGoal || {
    title: '',
    targetDate: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="glass modal-content glass-panel" style={{ maxWidth: '400px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem', color: 'var(--text-main)' }}>Set Your Goal</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Goal Title</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              className="form-control" 
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Land a Google Internship"
              autoFocus
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="targetDate">Target Date & Time</label>
            <input 
              type="datetime-local" 
              id="targetDate" 
              name="targetDate" 
              className="form-control" 
              required
              value={formData.targetDate}
              onChange={handleChange}
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">Save Goal</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GoalForm;
