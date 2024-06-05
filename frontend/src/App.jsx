import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { GenerateFakeData } from './components/GenerateFakeData'
import { GenerateEmail } from './components/GenerateEmail'
import { GeneratePassword } from './components/GeneratePassword'
import { Navigation } from './components/Navigation';

function App() {
  return (
    <BrowserRouter>
      <div>
       <Navigation></Navigation>
        <Routes>
          <Route path="/generate-password" element={<GeneratePassword></GeneratePassword>}/>
          <Route path="/generate-email" element={<GenerateEmail></GenerateEmail>}/>
          <Route path="/generate-fake-data" element={<GenerateFakeData></GenerateFakeData>}/>
          <Route path="/" element={<GeneratePassword></GeneratePassword>}/>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App
