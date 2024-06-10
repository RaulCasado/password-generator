import { useState } from "react";
import { generateEmail, getEmails } from "../services/apiService";

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
        <div>
            <h1>Correo Temporal</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {email ? <p>Tu correo temporal es: {email}</p> : <p>No se ha generado ningún correo temporal.</p>}
            <button onClick={handleGenerateEmail}>Generar Correo Temporal</button>
            {email && <button onClick={handleUpdateEmails}>Actualizar Lista de Correos</button>}
            <h2>Mensajes Recibidos:</h2>
            <ul>
                {messages.length > 0 ? (
                    messages.map((message, index) => (
                        <li key={index}>
                            <p><strong>De:</strong> {message.from_addr}</p>
                            <p><strong>Asunto:</strong> {message.subject}</p>
                            <p><strong>Mensaje:</strong> {message.body}</p>
                            <p><strong>Fecha:</strong>{message.date}</p>
                        </li>
                    ))
                ) : (
                    <p>No hay mensajes aún.</p>
                )}
            </ul>
        </div>
    );
}
