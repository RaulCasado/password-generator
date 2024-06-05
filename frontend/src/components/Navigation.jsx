import { Link} from 'react-router-dom';
export function Navigation() {
    return (
        <nav>
          <ul>
            <li>
              <Link to="/generate-password">Generar Contraseña</Link>
            </li>
            <li>
              <Link to="/generate-email">Generar Correo</Link>
            </li>
            <li>
              <Link to="/generate-fake-data">Generar Fake Data</Link>
            </li>
          </ul>
        </nav>
    )
}