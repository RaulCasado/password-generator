import  { useState, useEffect } from 'react';
import axios from 'axios';

export function GeneratePassword() {
  const [password, setPassword] = useState('');

  useEffect(() => {
    // Fetch a random word from the Python server
    axios.post('http://localhost:5000/request_password')
      .then(response => {
        setPassword(response.data.password);
      })
      .catch(error => {
        console.error(error);
      });
  }, []);

  const handleButtonClick = () => {
    // Fetch a new random word when the button is clicked
    axios.post('http://localhost:5000/request_password')
      .then(response => {
        setPassword(response.data.password);
      })
      .catch(error => {
        console.error(error);
      });
  };

  return (
    <div>
      <p>Random Password: {password}</p>
      <button onClick={handleButtonClick}>Get New Word</button>
    </div>
  );
}