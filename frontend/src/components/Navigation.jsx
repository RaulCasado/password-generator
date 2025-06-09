import { Link } from 'react-router-dom';
import './Navigation.css';

export function Navigation() {
  return (
    <nav className="navigation">
      <ul className="navigation-list">
        <li className="navigation-item">
          <Link to="/generate-password" className="navigation-link">Generar Contraseña</Link>
        </li>
        <li className="navigation-item">
          <Link to="/generate-email" className="navigation-link">Generar Correo</Link>
        </li>
        <li className="navigation-item">
          <Link to="/generate-fake-data" className="navigation-link">Generar Fake Data</Link>
        </li>
        <li className="navigation-item">
          <Link to="/password-breach-checker" className="navigation-link">Verificar Filtración</Link>
        </li>
      </ul>
    </nav>
  );
}
