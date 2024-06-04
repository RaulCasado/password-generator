import './App.css'
import { GenerateFakeData } from './components/GenerateFakeData'
import { GenerateEmail } from './components/GenerateEmail'
import { GeneratePassword } from './components/GeneratePassword'

function App() {
  return (
    <>
      <GenerateEmail></GenerateEmail>
      <GeneratePassword></GeneratePassword>
      <GenerateFakeData></GenerateFakeData>
    </>
  )
}

export default App
