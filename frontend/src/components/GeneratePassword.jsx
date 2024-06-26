import { useState } from 'react';
import { fetchPassword } from '../services/apiService';

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
    <div>
      <p>Contraseña aleatoria: {password}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
          Longitud:
          <input
            type="number"
            value={length}
            onChange={(e) => setLength(Number(e.target.value))}
            min="1"
          />
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeUppercase}
            onChange={() => setIncludeUppercase(!includeUppercase)}
          />
          Incluye mayúsculas
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={() => setIncludeLowercase(!includeLowercase)}
          />
          Incluye minúsculas
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={() => setIncludeNumbers(!includeNumbers)}
          />
          Incluye números
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeSpecialCharacters}
            onChange={() => setIncludeSpecialCharacters(!includeSpecialCharacters)}
          />
          Incluye carácteres especiales
        </label>
      </div>
      <button onClick={handleButtonClick}>Crear contraseña</button>
    </div>
  );
}
