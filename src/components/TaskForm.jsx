import { useState } from 'react';
import { X } from 'lucide-react';

function TaskForm({ onClose, onSubmit, initialDate, initialTask }) {
  const [formData, setFormData] = useState(initialTask || {
    title: '',
    date: initialDate || new Date().toISOString().split('T')[0],
    time: '09:00',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (initialTask) {
      onSubmit(formData);
    } else {
      const newTask = {
        ...formData,
        id: Date.now().toString(),
        completed: false
      };
      onSubmit(newTask);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass modal-content glass-panel" style={{ maxWidth: '400px' }}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>
        
        <h2 style={{ marginBottom: '24px', fontSize: '1.5rem' }}>
          {initialTask ? 'Edit Task' : 'Add New Task'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Task Description</label>
            <input 
              type="text" 
              id="title" 
              name="title" 
              className="form-control" 
              required
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Follow up with recruiter"
              autoFocus
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div className="form-group">
              <label htmlFor="date">Task Date</label>
              <input 
                type="date" 
                id="date" 
                name="date" 
                className="form-control" 
                required
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="time">Time (24h)</label>
              <input 
                type="time" 
                id="time" 
                name="time" 
                className="form-control" 
                required
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '30px' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary">{initialTask ? 'Update Task' : 'Save Task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
