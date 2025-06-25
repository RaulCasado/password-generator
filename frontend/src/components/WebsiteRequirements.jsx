import { useState } from 'react';
import './website-requirements.css';

export function WebsiteRequirements({ onGeneratePassword }) {
  const [website, setWebsite] = useState('');
  const [minLength, setMinLength] = useState(8);
  const [maxLength, setMaxLength] = useState(16);
  const [requiresUppercase, setRequiresUppercase] = useState(true);
  const [requiresLowercase, setRequiresLowercase] = useState(true);
  const [requiresNumbers, setRequiresNumbers] = useState(true);
  const [requiresSpecial, setRequiresSpecial] = useState(false);
  const [disallowedChars, setDisallowedChars] = useState('');

  const presetWebsites = [
    { name: 'Google', minLength: 8, requiresUppercase: false, requiresLowercase: false, requiresNumbers: false, requiresSpecial: false, disallowedChars: '' },
    { name: 'Microsoft', minLength: 8, requiresUppercase: true, requiresLowercase: true, requiresNumbers: true, requiresSpecial: true, disallowedChars: '' },
    { name: 'Amazon', minLength: 6, requiresUppercase: true, requiresLowercase: true, requiresNumbers: false, requiresSpecial: false, disallowedChars: '' },
    { name: 'Apple', minLength: 8, requiresUppercase: true, requiresLowercase: true, requiresNumbers: true, requiresSpecial: false, disallowedChars: '' },
    { name: 'Facebook', minLength: 6, requiresUppercase: false, requiresLowercase: false, requiresNumbers: false, requiresSpecial: false, disallowedChars: '' },
  ];

  const handleSelectPreset = (preset) => {
    setWebsite(preset.name);
    setMinLength(preset.minLength);
    setMaxLength(preset.maxLength || 32);
    setRequiresUppercase(preset.requiresUppercase);
    setRequiresLowercase(preset.requiresLowercase);
    setRequiresNumbers(preset.requiresNumbers);
    setRequiresSpecial(preset.requiresSpecial);
    setDisallowedChars(preset.disallowedChars || '');
  };

  const handleGenerateClick = () => {
    if (onGeneratePassword) {
      onGeneratePassword({
        websiteName: website,
        minLength,
        maxLength,
        requiresUppercase,
        requiresLowercase,
        requiresNumbers,
        requiresSpecial,
        disallowedChars
      });
    }
  };

  return (
    <div className="website-requirements">
      <h3>Requisitos específicos para sitios web</h3>
      
      <div className="website-presets">
        <p>Plantillas populares:</p>
        <div className="preset-buttons">
          {presetWebsites.map((preset, index) => (
            <button 
              key={index} 
              className="preset-btn"
              onClick={() => handleSelectPreset(preset)}
            >
              {preset.name}
            </button>
          ))}
        </div>
      </div>
      
      <div className="requirements-form">
        <div className="form-field">
          <label htmlFor="website-name">Nombre del sitio web</label>
          <input
            id="website-name"
            type="text"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="Nombre del sitio web (opcional)"
          />
        </div>
        
        <div className="form-field length-fields">
          <div>
            <label htmlFor="min-length">Longitud mínima</label>
            <input
              id="min-length"
              type="number"
              value={minLength}
              onChange={(e) => setMinLength(parseInt(e.target.value))}
              min="4"
              max="64"
            />
          </div>
          
          <div>
            <label htmlFor="max-length">Longitud máxima</label>
            <input
              id="max-length"
              type="number"
              value={maxLength}
              onChange={(e) => setMaxLength(parseInt(e.target.value))}
              min={minLength}
              max="128"
            />
          </div>
        </div>
        
        <div className="form-field checkbox-fields">
          <div className="checkbox-item">
            <input
              id="requires-uppercase"
              type="checkbox"
              checked={requiresUppercase}
              onChange={() => setRequiresUppercase(!requiresUppercase)}
            />
            <label htmlFor="requires-uppercase">Requiere mayúsculas</label>
          </div>
          
          <div className="checkbox-item">
            <input
              id="requires-lowercase"
              type="checkbox"
              checked={requiresLowercase}
              onChange={() => setRequiresLowercase(!requiresLowercase)}
            />
            <label htmlFor="requires-lowercase">Requiere minúsculas</label>
          </div>
          
          <div className="checkbox-item">
            <input
              id="requires-numbers"
              type="checkbox"
              checked={requiresNumbers}
              onChange={() => setRequiresNumbers(!requiresNumbers)}
            />
            <label htmlFor="requires-numbers">Requiere números</label>
          </div>
          
          <div className="checkbox-item">
            <input
              id="requires-special"
              type="checkbox"
              checked={requiresSpecial}
              onChange={() => setRequiresSpecial(!requiresSpecial)}
            />
            <label htmlFor="requires-special">Requiere caracteres especiales</label>
          </div>
        </div>
        
        <div className="form-field">
          <label htmlFor="disallowed-chars">Caracteres no permitidos</label>
          <input
            id="disallowed-chars"
            type="text"
            value={disallowedChars}
            onChange={(e) => setDisallowedChars(e.target.value)}
            placeholder="Ej: &%$#"
          />
        </div>
        
        <button 
          className="generate-website-btn"
          onClick={handleGenerateClick}
        >
          Generar Contraseña para {website || 'Sitio Web'}
        </button>
      </div>
    </div>
  );
}
