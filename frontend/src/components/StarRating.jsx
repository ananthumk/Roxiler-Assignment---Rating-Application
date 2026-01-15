import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/storeContext'
import axios from 'axios'

const StarRating = ({ store, onRated }) => {
  const { url, token } = useContext(AppContext)
  const [hoverRating, setHoverRating] = useState(0)
  const [rating, setRating] = useState(store.user_rating || 0)
  const [hasRated, setHasRated] = useState(!!store.user_rating)
  const [loading, setLoading] = useState(false)

  console.log(store)

  useEffect(() => {
    setRating(store.user_rating || 0)
    setHasRated(!!store.user_rating)
  }, [store.user_rating])

  const handleRate = async (value) => {
    if (loading) return

    const prevRating = rating
    setRating(value)
    setLoading(true)

    try {
      if (!hasRated) {
        await axios.post(`${url}/user/ratings`, 
          { storeId: store.id, rating: value }, 
          { headers: { Authorization: `Bearer ${token}` } }
        )
        setHasRated(true)
      } else {
        await axios.patch(`${url}/user/ratings/${store.id}`, 
          { rating: value }, 
          { headers: { Authorization: `Bearer ${token}` } }
        )
      }

      if (onRated) onRated()
    } catch (error) {
      console.error("Rating error:", error)
      setRating(prevRating)
    } finally {
      setLoading(false)
    }
  }

  const displayRating = hoverRating || rating || 0 

  return (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <svg
          key={star}
          width="16"      
          height="16"  
          className={`cursor-pointer transition-all ${loading ? 'opacity-50' : ''}`}
          style={{      
            fill: displayRating >= star ? '#fbbf24' : '#d1d5db',
            stroke: 'none'
          }}
          onMouseEnter={() => !loading && setHoverRating(star)}
          onMouseLeave={() => !loading && setHoverRating(0)}
          onClick={() => !loading && handleRate(star)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
        </svg>
      ))}
    </div>
  )
}

export default StarRating
