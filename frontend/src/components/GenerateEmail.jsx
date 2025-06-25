import { useState } from "react";
import { generateEmail, getEmails } from "../services/apiService";
import { useToast } from '../context/useToast';
import './generate-email.css';

export function GenerateEmail() {
  const [email, setEmail] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [checkingInterval, setCheckingInterval] = useState(null);
  const { showToast } = useToast();


  const handleGenerateEmail = async () => {
    try {
      setLoading(true);
      setError('');
      setSuccessMessage('');
      
      const response = await generateEmail();
      
      if (!response || !response.email) {
        throw new Error("No se pudo generar un correo temporal. La respuesta del servidor es inválida.");
      }
      
      const tempEmail = response.email;
      setEmail(tempEmail);
      setMessages([]);
      
      // Set up automatic checking every 30 seconds
      if (checkingInterval) {
        clearInterval(checkingInterval);
      }
      
      const interval = setInterval(() => {
        if (document.visibilityState === 'visible') {
          handleUpdateEmails(false);
        }
      }, 30000);
      
      setCheckingInterval(interval);
      
      // Initial check for messages
      setTimeout(() => handleUpdateEmails(false), 1000);
      
      // Set success message
      setSuccessMessage(`Correo temporal generado: ${tempEmail}.`);
      showToast('¡Correo temporal generado exitosamente!', 'success');
    } catch (error) {
      setError("No se pudo generar el correo temporal.");
      showToast('Error al generar el correo temporal', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmails = async (showLoading = true) => {
    if (!email) return;
    
    try {
      if (showLoading) {
        setLoading(true);
      }
      setError('');
      
      const receivedEmails = await getEmails(email);
      const previousCount = messages.length;
      setMessages(receivedEmails);
      
      if (showLoading) {
        setSuccessMessage('Mensajes actualizados correctamente');
        showToast('Mensajes actualizados', 'success');
        // Clear success message after 3 seconds
        setTimeout(() => setSuccessMessage(''), 3000);
      } else if (receivedEmails.length > previousCount) {
        // New messages received during automatic check
        const newMessagesCount = receivedEmails.length - previousCount;
        showToast(`${newMessagesCount} nuevo${newMessagesCount > 1 ? 's' : ''} mensaje${newMessagesCount > 1 ? 's' : ''} recibido${newMessagesCount > 1 ? 's' : ''}`, 'success');
      }
    } catch (error) {
      setError("Error al verificar los mensajes. Por favor verifique que el servidor backend esté en funcionamiento.");
      if (showLoading) {
        showToast('Error al verificar los mensajes', 'error');
      }
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  };

  return (
    <div className="generate-email-container">
      <h1 className="title">Correo Temporal</h1>
      
      <div className="email-info">
        <p>
          Genera un correo temporal que puedes usar para registrarte en servicios sin revelar tu 
          correo personal. Los mensajes se pueden consultar en esta página.
        </p>
        <p className="email-note">
          El sistema intentará crear un correo temporal real. Si no es posible, se usará un correo 
          simulado que solo funciona dentro de la aplicación.
        </p>
        <p className="email-warning">
          <strong>Importante:</strong> El correo temporal solo estará activo durante un tiempo limitado y 
          los mensajes pueden tardar unos minutos en aparecer.
        </p>
      </div>
      
      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
      
      {email ? (
        <div className="email-display">
          <p className="generated-email">Tu correo temporal es: <span className="email">{email}</span></p>
          <button className="copy-email-btn" onClick={async () => {
            try {
              await navigator.clipboard.writeText(email);
              showToast('Correo copiado al portapapeles', 'success');
            } catch (error) {
              showToast('Error al copiar el correo', 'error');
            }
          }}>
            Copiar dirección
          </button>
        </div>
      ) : (
        <p>No se ha generado ningún correo temporal.</p>
      )}
      
      <div className="button-group">
        <button 
          className="generate-btn" 
          onClick={handleGenerateEmail}
          disabled={loading}
        >
          {loading && !email ? 'Generando...' : 'Generar Correo Temporal'}
        </button>
        
        {email && (
          <>
            <button 
              className="update-btn" 
              onClick={() => handleUpdateEmails(true)}
              disabled={loading}
            >
              {loading ? 'Actualizando...' : 'Verificar Mensajes'}
            </button>
          
          </>
        )}
      </div>
      
      <h2 className="messages-title">Mensajes Recibidos:</h2>
      
      {loading && email && <p className="loading-message">Cargando mensajes...</p>}
      
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
          <p className="no-messages">
            {email ? 'No hay mensajes aún. Envía un correo desde tu cuenta personal a esta dirección para probar.' : 'Genera un correo temporal para recibir mensajes.'}
          </p>
        )}
      </ul>
    </div>
  );
}
