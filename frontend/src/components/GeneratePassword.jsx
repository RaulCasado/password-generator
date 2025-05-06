import { useState, useEffect } from 'react';
import { fetchPassword } from '../services/apiService';
import { PasswordStrengthMeter } from './PasswordStrengthMeter';
import { SavedPasswords } from './SavedPasswords';
import { PasswordHistory } from './PasswordHistory';
import { WebsiteRequirements } from './WebsiteRequirements';
import './GeneratePassword.css';

export function GeneratePassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [length, setLength] = useState(12);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(false);
  const [easyToRemember, setEasyToRemember] = useState(false);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [passwordLabel, setPasswordLabel] = useState('');
  const [activeTab, setActiveTab] = useState('generator');
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    if (copySuccess) {
      const timer = setTimeout(() => {
        setCopySuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [copySuccess]);

  const handleButtonClick = async () => {
    setError(null);
    try {
      const newPassword = await fetchPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecialCharacters, '',easyToRemember);
      setPassword(newPassword);
      
      // Add to password history
      const history = JSON.parse(localStorage.getItem('passwordHistory') || '[]');
      const newEntry = {
        password: newPassword,
        timestamp: new Date().toISOString(),
        settings: { length, includeUppercase, includeLowercase, includeNumbers, includeSpecialCharacters, easyToRemember }
      };
      
      // Limit history to 20 items
      if (history.length >= 20) {
        history.pop();
      }
      
      history.unshift(newEntry);
      localStorage.setItem('passwordHistory', JSON.stringify(history));
      
    } catch (error) {
      setError(error.message);
    }
  };

  const handleCopyPassword = () => {
    if (password) {
      navigator.clipboard.writeText(password);
      setCopySuccess(true);
    }
  };

  const handleSaveClick = () => {
    if (password) {
      setShowSaveForm(true);
    }
  };

  const handleSavePassword = () => {
    if (password) {
      const savedPasswords = JSON.parse(localStorage.getItem('savedPasswords') || '[]');
      const newEntry = {
        password,
        label: passwordLabel || 'Contraseña guardada',
        timestamp: new Date().toISOString()
      };
      
      savedPasswords.push(newEntry);
      localStorage.setItem('savedPasswords', JSON.stringify(savedPasswords));
      
      setShowSaveForm(false);
      setPasswordLabel('');
    }
  };

  const handleWebsiteRequirements = (requirements) => {
    // Set minimum values based on website requirements
    setLength(Math.max(requirements.minLength, length));
    setIncludeUppercase(requirements.requiresUppercase);
    setIncludeLowercase(requirements.requiresLowercase);
    setIncludeNumbers(requirements.requiresNumbers);
    setIncludeSpecialCharacters(requirements.requiresSpecial);
    
    // Set active tab back to generator
    setActiveTab('generator');
    
    // Generate password with new requirements
    handleButtonClick();
  };

  return (
    <div className="generate-password-container">
      <h2 className="title">Generar Contraseña Aleatoria</h2>
      
      <div className="tabs">
        <button 
          className={`tab-btn ${activeTab === 'generator' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('generator')}
        >
          Generador
        </button>
        <button 
          className={`tab-btn ${activeTab === 'saved' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('saved')}
        >
          Contraseñas Guardadas
        </button>
        <button 
          className={`tab-btn ${activeTab === 'history' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          Historial
        </button>
        <button 
          className={`tab-btn ${activeTab === 'website' ? 'active-tab' : ''}`}
          onClick={() => setActiveTab('website')}
        >
          Requisitos Web
        </button>
      </div>
      
      {activeTab === 'generator' && (
        <div className="generator-tab">
          {password && (
            <div className="password-result-container">
              <div className="password-display">
                <input 
                  type="text" 
                  value={password} 
                  readOnly 
                  className="password-display-input"
                />
                <button 
                  className={`copy-btn ${copySuccess ? 'copy-success' : ''}`}
                  onClick={handleCopyPassword}
                  title="Copiar al portapapeles"
                >
                  {copySuccess ? '✓ Copiado!' : 'Copiar'}
                </button>
                <button 
                  className="save-btn"
                  onClick={handleSaveClick}
                  title="Guardar contraseña"
                >
                  Guardar
                </button>
              </div>
              <PasswordStrengthMeter password={password} />
            </div>
          )}
          
          {showSaveForm && (
            <div className="save-password-form">
              <input
                type="text"
                placeholder="Etiqueta para la contraseña (opcional)"
                value={passwordLabel}
                onChange={(e) => setPasswordLabel(e.target.value)}
                className="password-label-input"
              />
              <div className="save-password-actions">
                <button className="confirm-save-btn" onClick={handleSavePassword}>Guardar</button>
                <button className="cancel-save-btn" onClick={() => setShowSaveForm(false)}>Cancelar</button>
              </div>
            </div>
          )}
          
          {error && <p className="error-message">Error: {error}</p>}
          
          <div className="input-group">
            <label>
              Longitud:
              <input
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                min="1"
                max="100"
                className="input-length"
              />
            </label>
          </div>

          <div className="checkbox-group">
            <div className="checkbox-item">
              <label>
                <input
                  type="checkbox"
                  checked={includeUppercase}
                  onChange={() => setIncludeUppercase(!includeUppercase)}
                />
                Incluye mayúsculas
              </label>
            </div>

            <div className="checkbox-item">
              <label>
                <input
                  type="checkbox"
                  checked={includeLowercase}
                  onChange={() => setIncludeLowercase(!includeLowercase)}
                />
                Incluye minúsculas
              </label>
            </div>

            <div className="checkbox-item">
              <label>
                <input
                  type="checkbox"
                  checked={includeNumbers}
                  onChange={() => setIncludeNumbers(!includeNumbers)}
                />
                Incluye números
              </label>
            </div>

            <div className="checkbox-item">
              <label>
                <input
                  type="checkbox"
                  checked={includeSpecialCharacters}
                  onChange={() => setIncludeSpecialCharacters(!includeSpecialCharacters)}
                />
                Incluye carácteres especiales
              </label>
            </div>

            <div className="checkbox-item">
              <label>
                <input
                  type="checkbox"
                  checked={easyToRemember}
                  onChange={() => setEasyToRemember(!easyToRemember)}
                />
                Fácil de recordar
              </label>
            </div>
          </div>

          <button className="generate-btn" onClick={handleButtonClick}>Crear contraseña</button>
        </div>
      )}
      
      {activeTab === 'saved' && (
        <SavedPasswords />
      )}
      
      {activeTab === 'history' && (
        <PasswordHistory />
      )}
      
      {activeTab === 'website' && (
        <WebsiteRequirements onGeneratePassword={handleWebsiteRequirements} />
      )}
    </div>
  );
}
