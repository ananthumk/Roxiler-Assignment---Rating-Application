import React, { useState } from 'react'
import { Ellipsis } from 'lucide-react'

const Table = ({ details, setSelectedId }) => {
  const [openId, setOpenId] = useState(null)

  const toggleMenu = (id) => {
    setOpenId(openId === id ? null : id)
  }

  const roleColor = {
    owner: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    admin: 'bg-green-100 text-green-800 border-green-200',
    user: 'bg-blue-100 text-blue-800 border-blue-200'
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg border border-gray-200 shadow-sm">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="p-4 border-b border-gray-200 text-left font-semibold text-gray-700">Name</th>
            <th className="p-4 border-b border-gray-200 text-left font-semibold text-gray-700">Email</th>
            <th className="p-4 border-b border-gray-200 text-left font-semibold text-gray-700">Address</th>
            <th className="p-4 border-b border-gray-200 text-left font-semibold text-gray-700">Role</th>
            <th className="p-4 border-b border-gray-200 text-center font-semibold text-gray-700">Action</th>
          </tr>
        </thead>

        <tbody>
          {details.length === 0 ? (
            <tr>
              <td colSpan="5" className="p-8 text-center text-gray-500">
                No users found
              </td>
            </tr>
          ) : (
            details.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                <td className="p-4 font-medium text-gray-900">{u.name}</td>
                <td className="p-4 text-gray-700 max-w-xs truncate">{u.email}</td>
                <td className="p-4 text-gray-600 max-w-md truncate">{u.address}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${roleColor[u.role] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                    {u.role}
                  </span>
                </td>

                <td className="p-4 relative">
                  <Ellipsis 
                    onClick={() => toggleMenu(u.id)} 
                    className="w-5 h-5 mx-auto cursor-pointer text-gray-500 hover:text-gray-700 transition-colors p-1 hover:bg-gray-100 rounded-full" 
                  />

                  {openId === u.id && (
                    <div className="absolute right-2 top-12 bg-white border border-gray-200 rounded-xl shadow-xl py-1 w-44 z-50 animate-in slide-in-from-top-2">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-all duration-150"
                        onClick={() => {
                          setSelectedId(u.id)
                          setOpenId(null)
                        }}
                      >
                        👁️ View Details
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default Table
