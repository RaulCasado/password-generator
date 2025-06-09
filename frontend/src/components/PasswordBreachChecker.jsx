import { useState } from 'react';
import { checkPasswordBreach } from '../services/apiService';
import './PasswordBreachChecker.css';

export function PasswordBreachChecker() {
    const [password, setPassword] = useState('');
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleCheck = async () => {
        if (!password.trim()) {
            setError('Por favor, ingresa una contraseña para verificar');
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        try {
            const response = await checkPasswordBreach(password);
            setResult(response);
        } catch (err) {
            setError(err.message || 'Error al verificar la contraseña');
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleCheck();
        }
    };

    const getSeverityClass = (severity) => {
        switch (severity) {
            case 'high':
                return 'result-danger';
            case 'medium':
                return 'result-warning';
            case 'low':
                return 'result-caution';
            case 'safe':
                return 'result-safe';
            default:
                return '';
        }
    };

    return (
        <div className="breach-checker-container">
            <div className="title-section">
                <h2 className="title">🔍 Verificar Filtración de Contraseña</h2>
                <p className="subtitle">
                    Verifica si tu contraseña ha sido encontrada en filtraciones de datos conocidas
                </p>
            </div>

            <div className="input-section">
                <div className="input-group">
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        onKeyUp={handleKeyPress}
                        placeholder="Ingresa la contraseña a verificar..."
                        className="password-input"
                        disabled={isLoading}
                    />
                    <button
                        onClick={handleCheck}
                        disabled={isLoading || !password.trim()}
                        className="check-button"
                    >
                        {isLoading ? (
                            <span className="loading-spinner">⏳</span>
                        ) : (
                            'Verificar'
                        )}
                    </button>
                </div>

                <div className="security-note">
                    <span className="shield-icon">🛡️</span>
                    <span>
                        Tu contraseña se verifica de forma segura usando k-anonymity. Solo se envían los primeros 5 caracteres del hash SHA-1.
                    </span>
                </div>
            </div>

            {error && (
                <div className="result-container result-error">
                    <span className="result-icon">❌</span>
                    <span className="result-text">{error}</span>
                </div>
            )}

            {result && (
                <div className={`result-container ${getSeverityClass(result.severity)}`}>
                    <div className="result-header">
                        <span className="result-text">{result.message}</span>
                    </div>

                    {result.breached ? (
                        <div className="breach-details">
                            <p className="breach-count">
                                Esta contraseña ha aparecido <strong>{result.count?.toLocaleString()}</strong> veces en filtraciones de datos.
                            </p>
                            <div className="recommendations">
                                <h4>Recomendaciones:</h4>
                                <ul>
                                    <li>🔄 Cambia esta contraseña inmediatamente</li>
                                    <li>🔒 Usa el generador de contraseñas para crear una nueva</li>
                                    <li>📱 Activa autenticación de dos factores si está disponible</li>
                                    <li>🔍 Verifica si otras cuentas usan la misma contraseña</li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className="safe-details">
                            <p>Esta contraseña no ha sido encontrada en ninguna filtración de datos conocida.</p>
                            <p className="safe-tip">💡 Recuerda usar contraseñas únicas para cada cuenta importante.</p>
                        </div>
                    )}
                </div>
            )}

            <div className="info-section">
                <h3>ℹ️ ¿Cómo funciona?</h3>
                <div className="info-grid">
                    <div className="info-item">
                        <div>
                            <h4>Seguro</h4>
                            <p>Tu contraseña nunca se envía completa. Solo se usa un hash parcial.</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div>
                            <h4>Base de datos</h4>
                            <p>Consulta la base de datos de Have I Been Pwned con millones de contraseñas filtradas.</p>
                        </div>
                    </div>
                    <div className="info-item">
                        <div>
                            <h4>Rápido</h4>
                            <p>Resultado instantáneo sin comprometer tu privacidad.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
