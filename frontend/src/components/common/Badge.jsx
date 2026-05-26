import './Badge.css';

const PRIORITY_CONFIG = {
  urgent: { label: 'Urgent', className: 'badge--urgent' },
  high:   { label: 'High',   className: 'badge--high'   },
  medium: { label: 'Medium', className: 'badge--medium' },
  low:    { label: 'Low',    className: 'badge--low'    },
};

export default function Badge({ priority }) {
  const config = PRIORITY_CONFIG[priority] || PRIORITY_CONFIG.low;
  return (
    <span className={`badge ${config.className}`}>
      {config.label}
    </span>
  );
}
