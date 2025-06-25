import { useEffect, useState } from 'react';
import './password-strength-meter.css';

export function PasswordStrengthMeter({ password }) {
  const [strength, setStrength] = useState(0);
  const [label, setLabel] = useState('');

  useEffect(() => {
    if (!password) {
      setStrength(0);
      setLabel('');
      return;
    }

    // Calculate password strength
    let currentStrength = 0;

    // Length check
    if (password.length >= 8) currentStrength += 1;
    if (password.length >= 12) currentStrength += 1;
    
    // Character variety checks
    if (/[A-Z]/.test(password)) currentStrength += 1;
    if (/[a-z]/.test(password)) currentStrength += 1;
    if (/[0-9]/.test(password)) currentStrength += 1;
    if (/[^A-Za-z0-9]/.test(password)) currentStrength += 1;

    // Calculate final strength (0-4)
    const normalizedStrength = Math.min(4, Math.floor(currentStrength / 1.5));
    setStrength(normalizedStrength);

    // Set label based on strength
    const labels = ['Muy débil', 'Débil', 'Moderada', 'Fuerte', 'Muy fuerte'];
    setLabel(labels[normalizedStrength]);

  }, [password]);

  if (!password) return null;

  return (
    <div className="password-strength-meter">
      <div className="strength-bars">
        {[...Array(4)].map((_, i) => (
          <div 
            key={i} 
            className={`strength-bar ${i < strength ? `strength-level-${strength}` : ''}`}
          ></div>
        ))}
      </div>
      <div className="strength-label">{label}</div>
    </div>
  );
}
