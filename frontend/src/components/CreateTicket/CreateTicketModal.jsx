import { useState } from 'react';
import './CreateTicketModal.css';

const INITIAL_FORM = {
  subject: '',
  description: '',
  customerEmail: '',
  priority: 'medium',
};

export default function CreateTicketModal({ isOpen, onClose, onSubmit }) {
  const [form, setForm] = useState({ ...INITIAL_FORM });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear inline error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required';
    } else if (form.subject.trim().length > 200) {
      newErrors.subject = 'Subject must be 200 characters or fewer';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (!form.customerEmail.trim()) {
      newErrors.customerEmail = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.customerEmail.trim())) {
      newErrors.customerEmail = 'Please enter a valid email address';
    }

    if (!['low', 'medium', 'high', 'urgent'].includes(form.priority)) {
      newErrors.priority = 'Please select a valid priority';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setSubmitting(true);
    try {
      await onSubmit({
        subject: form.subject.trim(),
        description: form.description.trim(),
        customerEmail: form.customerEmail.trim(),
        priority: form.priority,
      });
      setForm({ ...INITIAL_FORM });
      setErrors({});
      onClose();
    } catch (err) {
      // Handle server-side validation errors
      if (err.response?.data?.errors) {
        const serverErrors = {};
        err.response.data.errors.forEach(({ field, message }) => {
          serverErrors[field] = message;
        });
        setErrors(serverErrors);
      } else {
        setErrors({ _general: err.response?.data?.error || 'Something went wrong. Please try again.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick} id="create-ticket-modal">
      <div className="modal-panel">
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create Ticket</h2>
            <p className="modal-subtitle">Submit a new support request</p>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close modal">×</button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit} noValidate>
          {errors._general && (
            <div className="form-error-general">{errors._general}</div>
          )}

          <div className={`form-group ${errors.subject ? 'form-group--error' : ''}`}>
            <label htmlFor="ticket-subject" className="form-label">Subject</label>
            <input
              id="ticket-subject"
              name="subject"
              type="text"
              className="form-input"
              placeholder="Brief description of the issue"
              value={form.subject}
              onChange={handleChange}
              maxLength={200}
              autoFocus
            />
            {errors.subject && <span className="form-error">{errors.subject}</span>}
            <span className="form-hint">{form.subject.length}/200</span>
          </div>

          <div className={`form-group ${errors.description ? 'form-group--error' : ''}`}>
            <label htmlFor="ticket-description" className="form-label">Description</label>
            <textarea
              id="ticket-description"
              name="description"
              className="form-textarea"
              placeholder="Detailed explanation of the problem..."
              value={form.description}
              onChange={handleChange}
              rows={4}
            />
            {errors.description && <span className="form-error">{errors.description}</span>}
          </div>

          <div className={`form-group ${errors.customerEmail ? 'form-group--error' : ''}`}>
            <label htmlFor="ticket-email" className="form-label">Customer Email</label>
            <input
              id="ticket-email"
              name="customerEmail"
              type="email"
              className="form-input"
              placeholder="customer@example.com"
              value={form.customerEmail}
              onChange={handleChange}
            />
            {errors.customerEmail && <span className="form-error">{errors.customerEmail}</span>}
          </div>

          <div className={`form-group ${errors.priority ? 'form-group--error' : ''}`}>
            <label htmlFor="ticket-priority" className="form-label">Priority</label>
            <div className="priority-picker">
              {['low', 'medium', 'high', 'urgent'].map((p) => (
                <button
                  key={p}
                  type="button"
                  className={`priority-option priority-option--${p} ${form.priority === p ? 'priority-option--selected' : ''}`}
                  onClick={() => {
                    setForm((prev) => ({ ...prev, priority: p }));
                    if (errors.priority) setErrors((prev) => ({ ...prev, priority: '' }));
                  }}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            {errors.priority && <span className="form-error">{errors.priority}</span>}
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <span className="btn-spinner" />
                  Creating...
                </>
              ) : (
                'Create Ticket'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
