import { useState, useEffect } from 'react';
import { SavedPasswordItem } from './SavedPasswordItem';
import { useToast } from '../context/useToast';
import './saved-passwords.css';

export function SavedPasswords() {
  const [savedPasswords, setSavedPasswords] = useState([]);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [newPasswordLabel, setNewPasswordLabel] = useState('');
  const [passwordToSave, setPasswordToSave] = useState('');
  const { showToast } = useToast();
  
  useEffect(() => {
    const saved = sessionStorage.getItem('savedPasswords');
    if (saved) {
      setSavedPasswords(JSON.parse(saved));
    }
  }, []);
  

  const handleCopyPassword = async (password) => {
    try {
      await navigator.clipboard.writeText(password);
      showToast('Contraseña copiada al portapapeles', 'success');
    } catch (error) {
      showToast('Error al copiar la contraseña', 'error');
    }
  };
  
  const handleDeletePassword = (passwordToDelete) => {
    const updated = savedPasswords.filter(item => item.password !== passwordToDelete);
    setSavedPasswords(updated);
    sessionStorage.setItem('savedPasswords', JSON.stringify(updated));
    showToast('Contraseña eliminada', 'success');
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
    sessionStorage.setItem('savedPasswords', JSON.stringify(updated));
    showToast('Contraseña guardada exitosamente', 'success');
    
    setShowSaveForm(false);
    setPasswordToSave('');
    setNewPasswordLabel('');
  };
  
  return (
    <div className="saved-passwords">
      <h3>Contraseñas Guardadas</h3>
      
      <div className="security-warning">
        <p>
          <strong>⚠️ Aviso de seguridad:</strong> Las contraseñas se guardan temporalmente en el sessionStorage de tu navegador 
          y se eliminarán al cerrar la pestaña o el navegador.
        </p>
        <p>
          Esta herramienta es un generador de contraseñas, no un gestor de contraseñas seguro. 
          Te recomendamos usar un gestor de contraseñas dedicado como LastPass, 1Password, Bitwarden o KeePass para 
          almacenamiento seguro a largo plazo.
        </p>
      </div>
      
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
