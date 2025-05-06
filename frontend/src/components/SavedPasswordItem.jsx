import { useState } from 'react';
import './SavedPasswordItem.css';

export function SavedPasswordItem({ password, label, onDelete, onCopy }) {
  const [showPassword, setShowPassword] = useState(false);

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="saved-password-item">
      <div className="saved-password-content">
        <div className="saved-password-label">{label || 'Contraseña guardada'}</div>
        <div className="saved-password-value">
          {showPassword ? password : '•'.repeat(Math.min(12, password.length))}
        </div>
      </div>
      <div className="saved-password-actions">
        <button 
          className="password-action-btn visibility-btn" 
          onClick={toggleVisibility}
          title={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
        >
          {showPassword ? '👁️' : '👁️‍🗨️'}
        </button>
        <button 
          className="password-action-btn copy-btn" 
          onClick={() => onCopy(password)}
          title="Copiar al portapapeles"
        >
          📋
        </button>
        <button 
          className="password-action-btn delete-btn" 
          onClick={() => onDelete(password)}
          title="Eliminar contraseña"
        >
          🗑️
        </button>
      </div>
    </div>
  );
}
