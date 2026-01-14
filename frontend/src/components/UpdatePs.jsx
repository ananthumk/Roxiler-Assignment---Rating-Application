import React, { useState, useContext } from 'react'
import { X, Lock, Eye, EyeOff } from 'lucide-react'
import { AppContext } from '../context/storeContext'
import axios from 'axios'

const UpdatePassword = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  const { url, token } = useContext(AppContext)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
    setError('') // Clear error on type
  }

  const togglePassword = (field) => {
    setShowPassword(prev => ({
      ...prev,
      [field]: !prev[field]
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simple validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError("Passwords don't match")
      setIsLoading(false)
      return
    }

    if (formData.newPassword.length < 6) {
      setError('Password must be at least 6 characters')
      setIsLoading(false)
      return
    }

    try {
      await axios.put(`${url}/auth/update-password`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      })
      onClose()
      onSuccess?.()
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Update Password
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
          disabled={isLoading}
        >
          <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {error && (
        <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Lock className="w-4 h-4 text-gray-500" />
            Current Password
          </label>
          <div className="relative">
            <input 
              type={showPassword.current ? 'text' : 'password'}
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 transition-all text-md bg-gray-50/50 hover:bg-white"
              placeholder="Enter current password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePassword('current')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Lock className="w-4 h-4 text-gray-500" />
            New Password
          </label>
          <div className="relative">
            <input 
              type={showPassword.new ? 'text' : 'password'}
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 border-2 border-gray-200 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-100/50 transition-all text-md bg-gray-50/50 hover:bg-white"
              placeholder="Create new password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePassword('new')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Lock className="w-4 h-4 text-gray-500" />
            Confirm Password
          </label>
          <div className="relative">
            <input 
              type={showPassword.confirm ? 'text' : 'password'}
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full p-2 pr-10 border-2 border-gray-200 rounded-md focus:border-purple-500 focus:ring-2 focus:ring-purple-100/50 transition-all text-md bg-gray-50/50 hover:bg-white"
              placeholder="Confirm new password"
              required
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => togglePassword('confirm')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              {showPassword.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-0.5 px-8 border-2 border-gray-300 text-gray-700 font-semibold rounded-md hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-md shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="flex-1 py-0.5 px-8 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-md shadow-lg hover:shadow-xl transition-all duration-200 text-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Updating...
              </>
            ) : (
              'Change Password'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default UpdatePassword
