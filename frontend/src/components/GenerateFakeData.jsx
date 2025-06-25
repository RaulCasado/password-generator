import { useEffect, useState } from 'react';
import { fetchFakeData } from '../services/apiService';
import { useToast } from '../context/useToast';
import './generate-fake-data.css'; // Estilos específicos para este componente

export function GenerateFakeData() {
  const [generatedData, setGeneratedData] = useState(null);
  const [error, setError] = useState(null);
  const { showToast } = useToast();
  const [data, setData] = useState({
    name: true,
    address: true,
    postalCode: true,
    phoneNumber: true,
    creditCard: true,
    age: true,
    dni: true,
    userLanguage: "",
  });

  const handleToggle = (field) => {
    setData({
      ...data,
      [field]: !data[field],
    });
  };

  const handleGenerate = async () => {
    setError(null);
    try {
      const generatedData = await fetchFakeData(data);
      setGeneratedData(generatedData);
      showToast('¡Datos falsos generados exitosamente!', 'success');
    } catch (error) {
      setError(error.message);
      showToast('Error al generar los datos falsos', 'error');
    }
  };

  useEffect(() => {
    const language = navigator.language;
    setData(prevData => ({
      ...prevData,
      userLanguage: language,
    }));
  }, []);

  return (
    <div className="generate-fake-data-container">
      <h2 className="title">Generar Datos Falsos</h2>

      <div className="checkbox-group">
        <div className="checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={data.name}
              onChange={() => handleToggle('name')}
            />
            Nombre
          </label>
        </div>
        <div className="checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={data.address}
              onChange={() => handleToggle('address')}
            />
            Dirección
          </label>
        </div>
        <div className="checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={data.postalCode}
              onChange={() => handleToggle('postalCode')}
            />
            Código Postal
          </label>
        </div>
        <div className="checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={data.phoneNumber}
              onChange={() => handleToggle('phoneNumber')}
            />
            Teléfono
          </label>
        </div>
        <div className="checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={data.creditCard}
              onChange={() => handleToggle('creditCard')}
            />
            Número de Tarjeta de Crédito
          </label>
        </div>
        <div className="checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={data.age}
              onChange={() => handleToggle('age')}
            />
            Edad
          </label>
        </div>
        <div className="checkbox-item">
          <label>
            <input
              type="checkbox"
              checked={data.dni}
              onChange={() => handleToggle('dni')}
            />
            DNI
          </label>
        </div>
      </div>

      <button className="generate-btn" onClick={handleGenerate}>
        Generar Datos
      </button>

      {error && (
        <div className="error-message">
          Error: {error}
        </div>
      )}

      {generatedData && (
        <div className="generated-data">
          <div className="generated-data-header">
            <h3>Datos Generados</h3>
          </div>
          <ul>
            {Object.entries(generatedData).map(([key, value]) => (
              <li key={key}>
                <strong>{key}:</strong> {value}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
