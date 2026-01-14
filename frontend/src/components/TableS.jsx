import React, { useState } from 'react'
import { Star } from 'lucide-react'

const TableS = ({ details }) => {
  const [openId, setOpenId] = useState(null)

  const toggleMenu = (id) => {
    setOpenId(openId === id ? null : id)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full rounded-lg border border-gray-200 shadow-sm">
        <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
          <tr>
            <th className="p-4 border-b border-gray-200 text-left font-semibold text-gray-700">Name</th>
            <th className="p-4 border-b border-gray-200 text-left font-semibold text-gray-700">Email</th>
            <th className="p-4 border-b border-gray-200 text-left font-semibold text-gray-700">Address</th>
            <th className="p-4 border-b border-gray-200 text-center font-semibold text-gray-700">Rating</th>
          </tr>
        </thead>

        <tbody>
          {details.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-8 text-center text-gray-500">
                No stores found
              </td>
            </tr>
          ) : (
            details.map((store) => (
              <tr key={store.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100">
                <td className="p-4 font-medium text-gray-900">{store.name}</td>
                <td className="p-4 text-gray-700 max-w-xs truncate">{store.email}</td>
                <td className="p-4 text-gray-600 max-w-md truncate">{store.address}</td>
                <td className="p-4 flex justify-center items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-400 fill-current" />
                  <span className="font-semibold text-gray-900">
                    {store.average_rating?.toFixed(1) || '0.0'}
                  </span>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default TableS
