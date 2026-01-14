import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes } from 'react-router-dom'
import LoginForm from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import OwnerDashboard from './pages/OwnerDashboard'
import ProtectedRoute from './components/ProtectedRoute'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
     <Routes>
      <Route path='/login' element={<LoginForm />} />
      <Route path='/register' element={<Signup />} />
      <Route path='/' element={<ProtectedRoute element={<Dashboard />} /> } />
      <Route path='/admin' element={<ProtectedRoute element={<AdminDashboard />} /> } />
      <Route path='/owner' element={<ProtectedRoute element={<OwnerDashboard />} /> } />
     </Routes>
    </>
  )
}

export default App
