import { useState, useEffect } from 'react';
import { SavedPasswordItem } from './SavedPasswordItem';
import './SavedPasswords.css';

export function SavedPasswords({ onSelect }) {
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newPasswordLabel, setNewPasswordLabel] = useState('');
  const [passwordToSave, setPasswordToSave] = useState('');
  
  useEffect(() => {
    const saved = localStorage.getItem('savedPasswords');
    if (saved) {
      setSavedPasswords(JSON.parse(saved));
    }
  }, []);
  
  const handleCopyPassword = (password) => {
    navigator.clipboard.writeText(password);
    // Show feedback - could implement toast notification here
  };
  
  const handleDeletePassword = (passwordToDelete) => {
    const updated = savedPasswords.filter(item => item.password !== passwordToDelete);
    setSavedPasswords(updated);
    localStorage.setItem('savedPasswords', JSON.stringify(updated));
  };
  
  const showSavePasswordForm = (password) => {
    setPasswordToSave(password);
    setNewPasswordLabel('');
    setShowSaveForm(true);
  };
  
  const handleSavePassword = () => {
    if (!passwordToSave) return;
    
    const newEntry = {
      password: passwordToSave,
      label: newPasswordLabel || 'Contraseña guardada',
      timestamp: new Date().toISOString()
    };
    
    const updated = [...savedPasswords, newEntry];
    setSavedPasswords(updated);
    localStorage.setItem('savedPasswords', JSON.stringify(updated));
    
    setShowSaveForm(false);
    setPasswordToSave('');
    setNewPasswordLabel('');
  };
  
  return (
    <div className="saved-passwords">
      <h3>Contraseñas Guardadas</h3>
      
      {showSaveForm && (
        <div className="save-password-form">
          <input
            type="text"
            placeholder="Etiqueta para la contraseña (opcional)"
            value={newPasswordLabel}
            onChange={(e) => setNewPasswordLabel(e.target.value)}
            className="password-label-input"
          />
          <div className="save-password-actions">
            <button className="save-btn" onClick={handleSavePassword}>Guardar</button>
            <button className="cancel-btn" onClick={() => setShowSaveForm(false)}>Cancelar</button>
          </div>
        </div>
      )}
      
      {savedPasswords.length === 0 ? (
        <p className="no-saved-passwords">No hay contraseñas guardadas</p>
      ) : (
        <div className="saved-passwords-list">
          {savedPasswords.map((item, index) => (
            <SavedPasswordItem
              key={index}
              password={item.password}
              label={item.label}
              onDelete={handleDeletePassword}
              onCopy={handleCopyPassword}
            />
          ))}
        </div>
      )}
    </div>
  );
}
