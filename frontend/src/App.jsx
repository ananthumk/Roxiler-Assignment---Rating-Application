import './App.css'
import { Route, Routes } from 'react-router-dom'

import LoginForm from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import AdminDashboard from './pages/AdminDashboard'
import OwnerDashboard from './pages/OwnerDashboard'

import ProtectedRoute from './components/ProtectedRoute'
import PublicRoute from './components/PublicRoute'

function App() {
  return (
    <Routes>


      <Route path="/login" element={<PublicRoute><LoginForm /></PublicRoute>} />

      <Route path="/register" element={<PublicRoute><Signup /></PublicRoute>} />

      {/* USER */}
      <Route
        path="/"
        element={
          <ProtectedRoute allowedRoles={['user', 'admin', 'owner']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* ADMIN */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* OWNER */}
      <Route
        path="/owner"
        element={
          <ProtectedRoute allowedRoles={['owner']}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App
