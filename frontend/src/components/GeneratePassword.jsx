import { useState } from 'react';
import { fetchPassword } from '../services/apiService';
import './GeneratePassword.css'; // Estilos específicos para este componente

export function GeneratePassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [length, setLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(false);

  const handleButtonClick = async () => {
    setError(null);
    try {
      const newPassword = await fetchPassword(length, includeUppercase, includeLowercase, includeNumbers, includeSpecialCharacters);
      setPassword(newPassword);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="generate-password-container">
      <h2 className="title">Generar Contraseña Aleatoria</h2>
      
      {password && <p className="generated-password">Contraseña generada: {password}</p>}
      
      {error && <p className="error-message">Error: {error}</p>}
      
      <div className="input-group">
        <label>
          Longitud:
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            min="1"
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
      </div>

      <button className="generate-btn" onClick={handleButtonClick}>Crear contraseña</button>
    </div>
  );
}
