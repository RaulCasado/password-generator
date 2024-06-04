import React, { useState } from 'react';

function App() {
  const [name, setName] = useState('');
  const [response, setResponse] = useState('');

  const sendGreeting = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5000/api/greet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();
      setResponse(data.greeting);
    } catch (error) {
      console.error('Error:', error);
      setResponse('Error: Could not get greeting');
    }
  };

  return (
    <div>
      <h1>Flask and JavaScript Example</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter your name"
      />
      <button onClick={sendGreeting}>Send Greeting</button>
      <p>{response}</p>
    </div>
  );
}

export default App;
