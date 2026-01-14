import React, { useState, useEffect, useContext } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { AppContext } from '../context/storeContext'
import { Star, Clock, User, Store } from 'lucide-react'

const OwnerDashboard = () => {
  const [dashBoard, setDashBoard] = useState([])
  const [reviews, setReviews] = useState([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)
  
  const { url, token } = useContext(AppContext)

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${url}/owner/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200) {
        setDashBoard(response.data.stores)
      }
    } catch (error) {
      console.log('Dashboard error:', error)
    }
  }

  const fetchReviews = async () => {
    try {
      // FIXED: Use correct endpoint from previous API
      const response = await axios.get(`${url}/owner/reviews`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log(response)
      if (response.status === 200) {
        
        setReviews(response.data.recentReviews || [])
        setTotalReviews(response.data.totalRecentReviews || 0)
      }
    } catch (error) {
      console.log('Reviews error:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboard()
    fetchReviews()
  }, [url, token])

  // Dynamic colors for user avatars
  const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500', 'bg-pink-500', 'bg-indigo-500']
  
  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-3 text-gray-500">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <span>Loading dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className='px-6 py-8 max-w-6xl mx-auto'>
        <h1 className='text-2xl md:text-3xl font-bold text-gray-900 mb-2'>Welcome Back!</h1>
        <p className='text-gray-600 mb-8'>Here's what's happening with your stores</p>

        {/* Store Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10'>
          {dashBoard.map((store, index) => (
            <div key={store.storeId} className='bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6'>
              <div className='flex items-center gap-3 mb-3'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <Store className='w-5 h-5 text-blue-600' />
                </div>
                <div>
                  <h3 className='font-semibold text-gray-900 text-lg'>{store.storeName}</h3>
                  <p className='text-sm text-gray-500'>Average Rating</p>
                </div>
              </div>
              
              <div className='flex items-center gap-2 mb-2'>
                <Star className="w-6 h-6 text-yellow-400 fill-current" />
                <span className='text-2xl font-bold text-gray-900'>
                  {typeof store.averageRating === 'number' 
                    ? store.averageRating.toFixed(1) 
                    : parseFloat(store.averageRating).toFixed(1)}
                </span>
                <span className='text-sm text-gray-500'>({store.totalRatings} reviews)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Reviews Section */}
        <div className='bg-white border border-gray-200 rounded-lg shadow-sm'>
          <div className='p-6 border-b border-gray-100'>
            <div className='flex items-center gap-3'>
              <Star className='w-6 h-6 text-yellow-500' />
              <div>
                <h2 className='text-2xl font-bold text-gray-900'>Recent Reviews</h2>
                <p className='text-gray-500 flex items-center gap-1'>
                  <span>{totalReviews}</span>
                  
                </p>
              </div>
            </div>
          </div>

          <div className='divide-y divide-gray-100'>
            {reviews.length === 0 ? (
              <div className='p-12 text-center text-gray-500'>
                <Star className='w-12 h-12 text-gray-300 mx-auto mb-4' />
                <h3 className='text-lg font-semibold mb-2'>No reviews yet</h3>
                <p>Your customers haven't left any reviews yet.</p>
              </div>
            ) : (
              reviews.map((r, i) => (
                <div key={r.id} className='p-6 hover:bg-gray-50 transition-colors'>
                  <div className='flex items-start gap-4'>
                    {/* User Avatar */}
                    <div className={`${colors[i % colors.length]} text-white w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm`}>
                      {r.userName?.charAt(0)?.toUpperCase() || 'U'}
                    </div>

                    {/* Review Content */}
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center justify-between mb-2'>
                        <h4 className='font-semibold text-gray-900 truncate'>{r.userName || 'Anonymous'}</h4>
                        <div className='flex items-center gap-1 text-sm text-gray-500'>
                          <Clock className='w-4 h-4' />
                          <span>{formatDate(r.created_at)}</span>
                        </div>
                      </div>

                      {/* Rating */}
                      <div className='flex items-center gap-2 mb-3'>
                        {[...Array(5)].map((_, starIndex) => (
                          <Star
                            key={starIndex}
                            className={`w-5 h-5 ${
                              starIndex < Math.floor(r.rating || 0)
                                ? 'text-yellow-400 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                        <span className='font-semibold text-gray-900 text-sm'>
                          {r.rating}/5
                        </span>
                      </div>

                      {/* Store Name */}
                      {r.storeName && (
                        <p className='text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mb-3 max-w-max'>
                          {r.storeName}
                        </p>
                      )}

                      {/* Comment */}
                      {r.comment && (
                        <p className='text-gray-700 leading-relaxed'>{r.comment}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default OwnerDashboard
