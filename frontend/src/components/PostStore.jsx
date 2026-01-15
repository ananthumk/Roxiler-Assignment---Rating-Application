import { X, Store, Mail, MapPin, User, CheckCircle } from 'lucide-react';
import React, { useState, useContext } from 'react';
import { AppContext } from '../context/storeContext';
import axios from 'axios';
import { useEffect } from 'react';

const PostStore = ({ onClose, owner, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const { url, token } = useContext(AppContext);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
    setSuccessMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      const response = await axios.post(`${url}/admin/stores`, formData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.status === 201) {
        setSuccessMsg('Store created successfully! ');

      
        setFormData({
          name: '',
          email: '',
          address: '',
          ownerId: ''
        });

    
        setTimeout(() => {
          onSuccess?.(); 
          onClose();
        }, 1500);
      }
    } catch (error) {
      console.error('Error creating store:', error);
      setError(error.response?.data?.message || 'Failed to create store');
    } finally {
      setIsLoading(false);
    }
  };

  

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
          Add New Store
        </h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-xl transition-all duration-200 hover:scale-105"
          disabled={isLoading}
        >
          <X className="w-6 h-6 text-gray-500 hover:text-gray-700" />
        </button>
      </div>

      {successMsg && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          
            <p className="text-sm font-medium text-center text-green-800">{successMsg}</p>
          
        </div>
      )}

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-center text-red-700">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Store Name */}
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

        {/* Email */}
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

        {/* Address */}
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

        {/* Store Owner */}
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
            {owner?.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Actions */}
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
  );
};

export default PostStore;
