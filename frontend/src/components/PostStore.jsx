import { X, Store, Mail, MapPin, User } from 'lucide-react'
import React, { useState } from 'react'
import { useContext } from 'react'
import { AppContext } from '../context/storeContext'
import axios from 'axios'

const PostStore = ({ onClose, users }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const {url, token} = useContext(AppContext)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await axios.post(`${url}/admin/stores`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      if(response.status === 201){

      }
    } catch (error) {
      console.error('Error creating store:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Add New Store
        </h2>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
        >
          <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Store className="w-4 h-4 text-gray-500" />
            Store Name
          </label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-200 rounded-md focus:border-green-500 focus:ring-2 focus:ring-green-100/50 transition-all text-md bg-gray-50/50 hover:bg-white"
            placeholder="Enter store name"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Mail className="w-4 h-4 text-gray-500" />
            Email
          </label>
          <input 
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100/50 transition-all text-md bg-gray-50/50 hover:bg-white"
            placeholder="store@example.com"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin className="w-4 h-4 text-gray-500" />
            Address
          </label>
          <input 
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-200 rounded-md focus:border-purple-500 focus:ring-2 focus:ring-purple-100/50 transition-all text-md bg-gray-50/50 hover:bg-white"
            placeholder="Store address with city"
            required
          />
        </div>

        <div className="space-y-1">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <User className="w-4 h-4 text-gray-500" />
            Store Owner
          </label>
          <select 
            name="ownerId"
            value={formData.ownerId}
            onChange={handleChange}
            className="w-full p-2 border-2 border-gray-200 rounded-md focus:border-orange-500 focus:ring-2 focus:ring-orange-100/50 transition-all text-md bg-white hover:bg-gray-50"
            required
          >
            <option value="">Select Store Owner</option>
            {users?.map(user => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-4 pt-6 border-t border-gray-100">
          <button 
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-1 px-8 border-2 border-gray-300 text-gray-700 font-semibold rounded-md
             hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 text-md shadow-sm hover:shadow-md flex items-center justify-center gap-2"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isLoading}
            className="flex-1 py-1 px-8 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600
             hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-md shadow-lg hover:shadow-xl
              transition-all duration-200 text-md flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Creating...
              </>
            ) : (
              'Create Store'
            )}
          </button>
        </div>
      </form>
    </div>
  )
}

export default PostStore
