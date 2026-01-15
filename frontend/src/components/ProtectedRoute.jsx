import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../context/storeContext'

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { token, currentUser } = useContext(AppContext)


  if (!token || !currentUser) {
    return <Navigate to="/login" replace />
  }


  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
