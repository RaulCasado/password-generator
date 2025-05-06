import { useState, useEffect } from 'react';
import { SavedPasswordItem } from './SavedPasswordItem';
import './PasswordHistory.css';

export function PasswordHistory({ onSelect, onClear }) {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const savedHistory = localStorage.getItem('passwordHistory');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);
  
  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    // Show feedback - could implement toast notification here
  };
  
  const handleDeletePassword = (passwordToDelete) => {
    const updatedHistory = history.filter(item => item.password !== passwordToDelete);
    setHistory(updatedHistory);
    localStorage.setItem('passwordHistory', JSON.stringify(updatedHistory));
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('passwordHistory');
    if (onClear) onClear();
  };
  
  if (history.length === 0) {
    return (
      <div className="password-history empty-history">
        <p>No hay historial de contraseñas</p>
      </div>
    );
  }
  
  return (
    <div className="password-history">
      <div className="history-header">
        <h3>Historial de Contraseñas</h3>
        <button className="clear-history-btn" onClick={handleClearHistory}>
          Limpiar historial
        </button>
      </div>
      <div className="history-list">
        {history.map((item, index) => (
          <SavedPasswordItem
            key={index}
            password={item.password}
            label={`Generada el ${new Date(item.timestamp).toLocaleString()}`}
            onDelete={handleDeletePassword}
            onCopy={handleCopyPassword}
          />
        ))}
      </div>
    </div>
  );
}
