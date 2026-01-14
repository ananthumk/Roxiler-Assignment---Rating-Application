import React, { useContext, useEffect, useState } from 'react'
import { X } from 'lucide-react'
import axios from 'axios'
import { AppContext } from '../context/storeContext'

const UserDetails = ({ onClose, id }) => {
  const [user, setUser] = useState({})
  const [loading, setLoading] = useState(true)
  const { url, token } = useContext(AppContext)

  const fetchUser = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${url}/admin/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200) {
        setUser(response.data.user || {})
      }
    } catch (error) {
      console.log('Error fetching user:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) fetchUser()
  }, [id, url, token])

  const getRoleBadge = (role) => {
    const badges = {
      admin: 'bg-gradient-to-r from-emerald-500 to-green-600 text-white',
      owner: 'bg-gradient-to-r from-amber-500 to-yellow-600 text-white',
      user: 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white'
    }
    return badges[role] || 'bg-gray-500 text-white'
  }

  if (loading) {
    return (
      <div className="p-12 flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin" />
        <p className="text-gray-600 font-medium">Loading user details...</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-md w-full">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          User Details
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
        >
          <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Card */}
        <div className="grid grid-cols-1 gap-6">
          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">{user?.name[0]}</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{user?.name || 'N/A'}</h3>
                  <span className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${getRoleBadge(user?.role)}`}>
                    {user?.role || 'Unknown'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-6 bg-gradient-to-r from-emerald-50 to-green-50 rounded-2xl border border-emerald-100">
              <h4 className="text-sm font-semibold text-emerald-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                Email
              </h4>
              <p className="text-lg font-medium text-gray-900 break-all">
                {user?.email || 'No email'}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="p-6 bg-gradient-to-r from-purple-50 to-violet-50 rounded-2xl border border-purple-100">
              <h4 className="text-sm font-semibold text-purple-800 uppercase tracking-wide mb-3 flex items-center gap-2">
                Address
              </h4>
              <p className="text-lg font-medium text-gray-900 leading-relaxed">
                {user?.address || 'No address provided'}
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-100 flex justify-end">
          <button 
            onClick={onClose}
            className="py-3 px-8 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-lg flex items-center gap-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

export default UserDetails
