import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GenerateFakeData } from './components/GenerateFakeData';
import { GenerateEmail } from './components/GenerateEmail';
import { GeneratePassword } from './components/GeneratePassword';
import { PasswordBreachChecker } from './components/PasswordBreachChecker';
import { Navigation } from './components/Navigation';
import { PasswordTips } from './components/PasswordTips';
import { ToastProvider } from './context/ToastProvider';

function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div className="app-container">
          <Navigation />

          <div className="card">
            <Routes>
              <Route path="/generate-password" element={<GeneratePassword />} />
              <Route path="/generate-email" element={<GenerateEmail />} />
              <Route path="/generate-fake-data" element={<GenerateFakeData />} />
              <Route path="/password-breach-checker" element={<PasswordBreachChecker />} />
              <Route path="/password-tips" element={<PasswordTips />} />
              <Route path="/" element={<GeneratePassword />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}

export default App;
