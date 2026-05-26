import './Spinner.css';

export default function Spinner({ size = 32, text }) {
  return (
    <div className="spinner-container">
      <div
        className="spinner"
        style={{ width: size, height: size }}
        role="status"
        aria-label="Loading"
      >
        <div className="spinner-ring" />
      </div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
}
