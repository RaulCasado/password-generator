import { useState, useEffect } from 'react';
import { SavedPasswordItem } from './SavedPasswordItem';
import './PasswordHistory.css';

export function PasswordHistory() {
  const [history, setHistory] = useState([]);
  
  useEffect(() => {
    const savedHistory = sessionStorage.getItem('passwordHistory');
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
    sessionStorage.setItem('passwordHistory', JSON.stringify(updatedHistory));
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    sessionStorage.removeItem('passwordHistory');
  };
  
  if (history.length === 0) {
    return (
      <div className="password-history empty-history">
        <div className="security-warning">
          <p>
            <strong>⚠️ Aviso de seguridad:</strong> El historial de contraseñas se almacena temporalmente en el sessionStorage de tu navegador 
            y se eliminará al cerrar la pestaña o el navegador.
          </p>
          <p>
            Para almacenamiento seguro, te recomendamos usar un gestor de contraseñas dedicado como 
            LastPass, 1Password, Bitwarden o KeePass.
          </p>
        </div>
        <p>No hay historial de contraseñas</p>
      </div>
    );
  }
  
  return (
    <div className="password-history">
      <div className="security-warning">
        <p>
          <strong>⚠️ Aviso de seguridad:</strong> El historial de contraseñas se almacena temporalmente en el sessionStorage de tu navegador 
          y se eliminará al cerrar la pestaña o el navegador.
        </p>
        <p>
          Para almacenamiento seguro, te recomendamos usar un gestor de contraseñas dedicado como 
          LastPass, 1Password, Bitwarden o KeePass.
        </p>
      </div>
      
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
