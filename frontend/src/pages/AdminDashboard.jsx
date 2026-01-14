import React, { useContext, useEffect, useState } from 'react'
import { Search, Plus } from 'lucide-react'
import Header from '../components/Header'
import { AppContext } from '../context/storeContext'
import axios from 'axios'
import Table from '../components/Table'
import TableS from '../components/TableS'
import PostUser from '../components/PostUser'
import PostStore from '../components/PostStore'
import UserDetails from '../components/UserDetails'
import Footer from '../components/Footer'
import Loader from '../components/Loader'

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [dashboard, setDashboard] = useState({})
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [storeSearchQuery, setStoreSearchQuery] = useState('')
  
  const [userLoader, setUserLoader] = useState(true)
  const [storeLoader, setStoreLoader] = useState(true)

  const [userSortBy, setUserSortBy] = useState('name')
  const [storeSortBy, setStoreSortBy] = useState('name')


  const [activeModal, setActiveModal] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const { token, url } = useContext(AppContext)

  const fetchUsers = async () => {
    try {
      const params = new URLSearchParams({
        search: userSearchQuery,
        sortBy: userSortBy

      })

      const response = await axios.get(`${url}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 200) {
        setUsers(response.data.users || [])
        setUserLoader(false)
      }
    } catch (error) {
      console.log('users: ', error)
      setUsers([])
    }
  }

  const fetchDashboard = async () => {
    try {
      const response = await axios.get(`${url}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.status === 200) {
        setDashboard(response.data)
      }
    } catch (error) {
      console.log(error)
      setDashboard({})
    }
  }

  const fetchStores = async () => {
    try {
      const params = new URLSearchParams({
        search: storeSearchQuery,
        sortBy: storeSortBy

      })

      const response = await axios.get(`${url}/admin/stores?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.status === 200) {
        setStores(response.data.stores || [])
        setStoreLoader(false)
      }
    } catch (error) {
      console.log('stores: ', error)
      setStores([])
    }
  }

  useEffect(() => { fetchDashboard() }, [url, token])
  useEffect(() => { fetchUsers() }, [url, token, userSearchQuery, userSortBy, activeModal])
  useEffect(() => { fetchStores() }, [url, token, storeSearchQuery, storeSortBy, activeModal])

  const closeModal = () => {
    setActiveModal(null)
    setSelectedId(null)
  }

  const openAddUser = () => setActiveModal('addUser')
  const openAddStore = () => setActiveModal('addStore')
  const openViewUser = (id) => {
    setSelectedId(id)
    setActiveModal('viewUser')
  }

  return (
    <>
      <div>
        <Header />
        <div className='flex flex-col py-[2%] px-[5%] gap-8'>
          <h2 className='text-2xl lg:text-3xl font-bold text-gray-900'>Admin Dashboard</h2>

          {/* Dashboard Summary */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-20 lg:gap-50'>
            <div className='flex flex-col border border-gray-300 shadow-lg gap-2 p-2 px-4 rounded-md hover:shadow-xl transition-shadow'>
              <p className='text-sm text-gray-500 font-medium'>Total Users</p>
              <h4 className='text-3xl text-gray-900 font-semibold'>{dashboard.totalUsers || 0}</h4>
            </div>
            <div className='flex flex-col border border-gray-300 shadow-lg gap-2 p-2 px-4 rounded-md hover:shadow-xl transition-shadow'>
              <p className='text-sm text-gray-500 font-medium'>Total Stores</p>
              <h4 className='text-3xl text-gray-900 font-semibold'>{dashboard.totalStores || 0}</h4>
            </div>
            <div className='flex flex-col border border-gray-300 shadow-lg gap-2 p-2 px-4 rounded-md hover:shadow-xl transition-shadow'>
              <p className='text-sm text-gray-500 font-medium'>Total Ratings</p>
              <h4 className='text-3xl text-gray-900 font-semibold'>{dashboard.totalRatings || 0}</h4>
            </div>
          </div>

          {/* Users Section */}
          <div className='flex flex-col gap-2 p-4 border-2 border-gray-300 rounded-md shadow-lg'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl text-gray-800 font-semibold'>User Details</h3>
              <button
                onClick={openAddUser}
                className='bg-blue-500 hover:bg-blue-600 text-white font-semibold border-0 outline-0 rounded-md text-sm flex justify-center items-center py-2 px-4 gap-2 shadow-md hover:shadow-lg transition-all duration-200'
              >
                <Plus className='w-4 h-4' /> Add User
              </button>
            </div>

            {/* Search */}
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='flex items-center border-2 border-gray-200 rounded-sm gap-2 py-2 px-3 bg-gray-50'>
                <Search className='w-4 h-4 text-gray-500' />
                <input
                  type="search"
                  value={userSearchQuery}
                  onChange={(e) => setUserSearchQuery(e.target.value)}
                  placeholder='Search users by name, email, location...'
                  className='w-full bg-transparent border-0 outline-0 text-sm text-gray-700 placeholder:text-gray-500 focus:placeholder:text-gray-400'
                />
              </div>

              <select
                value={userSortBy}
                onChange={(e) => setUserSortBy(e.target.value)}
                className='px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-blue-200 focus:border-blue-400 text-sm bg-white'
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="address">Sort by Location</option>
              </select>
            </div>
            {userLoader ? <Loader /> : 
            <Table setSelectedId={openViewUser} details={users} />}
          </div>

          {/* Stores Section */}
          <div className='flex flex-col p-4 gap-2 border-2 border-gray-300 rounded-md shadow-lg'>
            <div className='flex items-center justify-between'>
              <h3 className='text-xl text-gray-800 font-semibold'>Store Details</h3>
              <button
                onClick={openAddStore}
                className='bg-blue-500 hover:bg-blue-600 text-white font-semibold border-0 outline-0 rounded-md text-sm flex justify-center items-center py-2 px-4 gap-2 shadow-md hover:shadow-lg transition-all duration-200'
              >
                <Plus className='w-4 h-4' /> Add Store
              </button>
            </div>

          
            <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
              <div className='flex items-center border-2 border-gray-200 rounded-sm gap-2 py-2 px-3 bg-gray-50'>
                <Search className='w-4 h-4 text-gray-500' />
                <input
                  type="search"
                  value={storeSearchQuery}
                  onChange={(e) => setStoreSearchQuery(e.target.value)}
                  placeholder='Search stores by name, email, location...'
                  className='w-full bg-transparent border-0 outline-0 text-sm text-gray-700 placeholder:text-gray-500 focus:placeholder:text-gray-400'
                />
              </div>

              <select
                value={storeSortBy}
                onChange={(e) => setStoreSortBy(e.target.value)}
                className='px-3 py-2 border border-gray-200 rounded-sm focus:ring-1 focus:ring-blue-200 focus:border-blue-400 text-sm bg-white'
              >
                <option value="name">Sort by Name</option>
                <option value="email">Sort by Email</option>
                <option value="address">Sort by Location</option>
              </select>
            </div>
            
            {storeLoader ? <Loader /> : 
            <TableS details={stores} />}
          </div>
        </div>
      </div>

      {/* Single Modal Overlay */}
      {activeModal && (
        <div
          className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex justify-center items-center p-4 animate-in fade-in zoom-in duration-200"
          onClick={closeModal}
        >
          <div
            className="max-w-md w-full max-h-[90vh] overflow-y-auto bg-white rounded-md shadow-2xl animate-in slide-in-from-bottom-4 duration-200 border border-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            {activeModal === 'addUser' && <PostUser onClose={closeModal} />}
            {activeModal === 'addStore' && <PostStore onClose={closeModal} users={users} />}
            {activeModal === 'viewUser' && <UserDetails onClose={closeModal} id={selectedId} />}
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

export default AdminDashboard
