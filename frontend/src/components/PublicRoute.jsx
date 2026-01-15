import { useContext } from 'react'
import { Navigate } from 'react-router-dom'
import { AppContext } from '../context/storeContext'

const PublicRoute = ({ children }) => {
    const { token, currentUser } = useContext(AppContext)
    console.log(currentUser)
    if (token) {
        if (currentUser.role === 'admin') {
            return <Navigate to="/admin" replace />
        } else if (currentUser.role === 'owner') {
            return <Navigate to="/owner" replace />
        } else {
            return <Navigate to="/" replace />
        }

    }
    return children
}

export default PublicRoute
