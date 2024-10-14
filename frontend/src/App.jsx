// App.jsx
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GenerateFakeData } from './components/GenerateFakeData';
import { GenerateEmail } from './components/GenerateEmail';
import { GeneratePassword } from './components/GeneratePassword';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <nav className="navigation">
          <a href="/">Home</a>
          <a href="/generate-password">Generate Password</a>
          <a href="/generate-email">Generate Email</a>
          <a href="/generate-fake-data">Generate Fake Data</a>
        </nav>

        <div className="card">
          <Routes>
            <Route path="/generate-password" element={<GeneratePassword />} />
            <Route path="/generate-email" element={<GenerateEmail />} />
            <Route path="/generate-fake-data" element={<GenerateFakeData />} />
            <Route path="/" element={<GeneratePassword />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
