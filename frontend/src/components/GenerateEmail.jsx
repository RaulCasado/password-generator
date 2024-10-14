import { useState } from "react";
import { generateEmail, getEmails } from "../services/apiService";
import './GenerateEmail.css';

export function GenerateEmail() {
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const handleGenerateEmail = async () => {
    try {
      const tempEmail = await generateEmail();
      setEmail(tempEmail);
      setMessages([]);
      setError('');
    } catch (error) {
      setError(error.message);
    }
  };

  const handleUpdateEmails = async () => {
    try {
      if (email) {
        const receivedEmails = await getEmails(email);
        setMessages(receivedEmails);
        setError('');
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="generate-email-container">
      <h1 className="title">Correo Temporal</h1>
      {error && <p className="error-message">{error}</p>}
      {email ? (
        <p className="generated-email">Tu correo temporal es: <span className="email">{email}</span></p>
      ) : (
        <p>No se ha generado ningún correo temporal.</p>
      )}
      <div className="button-group">
        <button className="generate-btn" onClick={handleGenerateEmail}>
          Generar Correo Temporal
        </button>
        {email && (
          <button className="update-btn" onClick={handleUpdateEmails}>
            Actualizar Lista de Correos
          </button>
        )}
      </div>
      <h2 className="messages-title">Mensajes Recibidos:</h2>
      <ul className="messages-list">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <li key={index} className="message-card">
              <p><strong>De:</strong> {message.from_addr}</p>
              <p><strong>Asunto:</strong> {message.subject}</p>
              <p><strong>Mensaje:</strong> {message.body}</p>
              <p><strong>Fecha:</strong> {message.date}</p>
            </li>
          ))
        ) : (
          <p>No hay mensajes aún.</p>
        )}
      </ul>
    </div>
  );
}
