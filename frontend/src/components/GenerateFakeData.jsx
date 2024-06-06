import { useState } from 'react';
import { fetchFakeData } from '../services/apiService';

export function GenerateFakeData() {
  const [data, setData] = useState({
    name: false,
    address: false,
    postalCode: false,
    phoneNumber: false,
    creditCard: false,
    birthdate: false,
    age: false,
    dni: false
  });
  const [generatedData, setGeneratedData] = useState(null);

  const handleToggle = (field) => {
    setData({
      ...data,
      [field]: !data[field]
    });
  };

  const handleGenerate = async () => {
    try {
      const generatedData = await fetchFakeData(data);
      setGeneratedData(generatedData);
    } catch (error) {
      console.error('Error generating fake data:', error);
    }
  };
  

  return (
    <div>
      <h2>Generar Datos Falsos</h2>
      <div>
        <label>
          <input
            type="checkbox"
            checked={data.name}
            onChange={() => handleToggle('name')}
          />
          Nombre
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={data.address}
            onChange={() => handleToggle('address')}
          />
          Dirección
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={data.postalCode}
            onChange={() => handleToggle('postalCode')}
          />
          Código Postal
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={data.phoneNumber}
            onChange={() => handleToggle('phoneNumber')}
          />
          Teléfono
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={data.creditCard}
            onChange={() => handleToggle('creditCard')}
          />
          Número de Tarjeta de Crédito
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={data.birthdate}
            onChange={() => handleToggle('birthdate')}
          />
          Fecha de Nacimiento
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={data.age}
            onChange={() => handleToggle('age')}
          />
          Edad
        </label>
      </div>
      <div>
        <label>
          <input
            type="checkbox"
            checked={data.dni}
            onChange={() => handleToggle('dni')}
          />
          DNI
        </label>
      </div>
      <button onClick={handleGenerate}>Generar Datos</button>

      {generatedData && (
        <div>
          <h3>Datos Generados</h3>
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
