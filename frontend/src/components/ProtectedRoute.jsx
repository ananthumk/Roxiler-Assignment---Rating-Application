import React from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/storeContext'
import { useNavigate, Navigate } from 'react-router-dom'

const ProtectedRoute = ({ element }) => {
    const { token } = useContext(AppContext)
    const navigate = useNavigate()
    if (!token) {
        return <Navigate to='/login' replace />
    }
    return element
    return element
}

export default ProtectedRoute
