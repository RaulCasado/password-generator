import { useState } from 'react';
import axios from 'axios';

export function GeneratePassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [length, setLength] = useState(8);
  const [includeUppercase, setIncludeUppercase] = useState(false);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(false);
  const [includeSpecialCharacters, setIncludeSpecialCharacters] = useState(false);

  const fetchPassword = () => {
    setError(null);
    axios.post('http://localhost:5000/request_password', {
      length,
      includeUppercase,
      includeLowercase,
      includeNumbers,
      includeSpecialCharacters
    })
      .then(response => {
        setPassword(response.data.password);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          setError(error.response.data.error);
        } else {
          setError("Failed to fetch password. Please try again.");
        }
      });
  };

  const handleButtonClick = () => {
    fetchPassword();
  };

  return (
    <div>
      <p>Random Password: {password}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <div>
        <label>
          Length:
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
          Include Uppercase
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeLowercase}
            onChange={() => setIncludeLowercase(!includeLowercase)}
          />
          Include Lowercase
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeNumbers}
            onChange={() => setIncludeNumbers(!includeNumbers)}
          />
          Include Numbers
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={includeSpecialCharacters}
            onChange={() => setIncludeSpecialCharacters(!includeSpecialCharacters)}
          />
          Include Special Characters
        </label>
      </div>
      <button onClick={handleButtonClick}>Get New Password</button>
    </div>
  );
}
