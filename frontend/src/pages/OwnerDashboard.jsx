import React, { useState, useEffect, useContext } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'
import axios from 'axios'
import { AppContext } from '../context/storeContext'
import { Star, Clock, Store } from 'lucide-react'
import Loader from '../components/Loader'



const API_STATUS = {
  INITIAL: 'INITIAL',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
}

const FailureView = ({ onRetry }) => (
  <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
    <p className="text-gray-600 font-medium text-lg">Something went wrong</p>
    <button
      onClick={onRetry}
      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
    >
      Try Again
    </button>
  </div>
)



const OwnerDashboard = () => {
  const [dashBoard, setDashBoard] = useState([])
  const [reviews, setReviews] = useState([])
  const [totalReviews, setTotalReviews] = useState(0)

  const [dashboardStatus, setDashboardStatus] = useState(API_STATUS.INITIAL)
  const [reviewsStatus, setReviewsStatus] = useState(API_STATUS.INITIAL)

  const { url, token } = useContext(AppContext)



  const fetchDashboard = async () => {
    try {
      setDashboardStatus(API_STATUS.IN_PROGRESS)

      const response = await axios.get(`${url}/owner/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        setDashBoard(response.data.stores || [])
        setDashboardStatus(API_STATUS.SUCCESS)
      }
    } catch (error) {
      console.log('Dashboard error:', error)
      setDashboardStatus(API_STATUS.FAILED)
    }
  }

  const fetchReviews = async () => {
    try {
      setReviewsStatus(API_STATUS.IN_PROGRESS)

      const response = await axios.get(`${url}/owner/reviews`, {
        headers: { Authorization: `Bearer ${token}` },
      })

      if (response.status === 200) {
        setReviews(response.data.recentReviews || [])
        setTotalReviews(response.data.totalRecentReviews || 0)
        setReviewsStatus(API_STATUS.SUCCESS)
      }
    } catch (error) {
      console.log('Reviews error:', error)
      setReviewsStatus(API_STATUS.FAILED)
    }
  }

  const retryAll = () => {
    fetchDashboard()
    fetchReviews()
  }

  useEffect(() => {
    if (url && token) {
      fetchDashboard()
      fetchReviews()
    }
  }, [url, token])



  const colors = [
    'bg-blue-500',
    'bg-green-500',
    'bg-purple-500',
    'bg-orange-500',
    'bg-pink-500',
    'bg-indigo-500',
  ]

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  const isLoading =
    dashboardStatus === API_STATUS.IN_PROGRESS ||
    reviewsStatus === API_STATUS.IN_PROGRESS

  const isFailed =
    dashboardStatus === API_STATUS.FAILED ||
    reviewsStatus === API_STATUS.FAILED

 

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {/* LOADER */}
      {isLoading && (
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader />
        </div>
      )}

      {/* FAILURE */}
      {isFailed && <FailureView onRetry={retryAll} />}

      {/* SUCCESS */}
      {dashboardStatus === API_STATUS.SUCCESS &&
        reviewsStatus === API_STATUS.SUCCESS && (
          <>
            <div className="px-6 py-8 max-w-6xl mx-auto">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600 mb-8">
                Here's what's happening with your stores
              </p>

              {/* STORE STATS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                {dashBoard.map((store, index) => (
                  <div
                    key={store.storeId}
                    className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 p-6"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Store className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 text-[19px] md:text-lg">
                          {store.storeName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Average Rating
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mb-2">
                      <Star className="w-6 h-6 text-yellow-400 fill-current" />
                      <span className="text-xl md:text-2xl font-bold text-gray-900">
                        {Number(store.averageRating).toFixed(1)}
                      </span>
                      <span className="text-sm text-gray-500">
                        ({store.totalRatings} reviews)
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* RECENT REVIEWS */}
              <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900">
                    Recent Reviews ({totalReviews})
                  </h2>
                </div>

                <div className="divide-y divide-gray-100">
                  {reviews.length === 0 ? (
                    <div className="p-7 md:p-12 text-center text-gray-500">
                      <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">
                        No reviews yet
                      </h3>
                      <p>Your customers haven't left any reviews yet.</p>
                    </div>
                  ) : (
                    reviews.map((r, i) => (
                      <div
                        key={r.id}
                        className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-start gap-2 md:gap-4">
                          {/* Profile */}
                          <div
                            className={`${colors[i % colors.length]} text-white w-8 h-8 md:w-12 md:h-12 rounded-full 
                            flex items-center justify-center flex-shrink-0 font-semibold text-sm`}
                          >
                            {r.userName?.charAt(0)?.toUpperCase() || 'U'}
                          </div>

                          <div className="flex-1 flex-wrap min-w-0">
                            <div className="flex items-center justify-between md:mb-2">
                              <h4 className="text-sm flex-wrap md:text-md font-semibold text-gray-900 truncate">
                                {r.userName || 'Anonymous'}
                              </h4>
                              <div className="flex items-center gap-1 text-[9px] md:text-sm text-gray-500">
                                <Clock className="w-3 h-3 md:w-4 md:h-4" />
                                <span>{formatDate(r.created_at)}</span>
                              </div>
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-2  md:mb-3">
                              {[...Array(5)].map((_, idx) => (
                                <Star
                                  key={idx}
                                  className={`w-3 h-3 md:w-5 md:h-5 ${
                                    idx < Math.floor(r.rating || 0)
                                      ? 'text-yellow-400 fill-current'
                                      : 'text-gray-300'
                                  }`}
                                />
                              ))}
                              <span className="font-semibold text-gray-900 text-sm">
                                {r.rating}
                              </span>
                            </div>

                            {/* Store name */}
                            {r.storeName && (
                              <p className="text-[9px] md:text-sm font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md inline-block mb-3">
                                {r.storeName}
                              </p>
                            )}

                            {/* Comments*/}
                            {r.comment && (
                              <p className="text-gray-700 leading-relaxed">
                                {r.comment}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </>
        )}

      <Footer />
    </div>
  )
}

export default OwnerDashboard
