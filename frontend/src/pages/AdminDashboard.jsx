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

const API_STATUS = {
  INITIAL: 'INITIAL',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const AdminDashboard = () => {
  const [users, setUsers] = useState([])
  const [stores, setStores] = useState([])
  const [dashboard, setDashboard] = useState({})
  const [userSearchQuery, setUserSearchQuery] = useState('')
  const [storeSearchQuery, setStoreSearchQuery] = useState('')

  const [userCurrentPage, setUserCurrentPage] = useState(1)
  const [userPagination, setUserPagination] = useState({
    totalPages: 0,
    total: 0
  })

  const [storeCurrentPage, setStoreCurrentPage] = useState(1)
  const [storePagination, setStorePagination] = useState({
    totalPages: 0,
    total: 0
  })

  const [userApiStatus, setUserApiStatus] = useState(API_STATUS.INITIAL);
  const [storeApiStatus, setStoreApiStatus] = useState(API_STATUS.INITIAL);
  // const [dashboardApiStatus, setDashboardApiStatus] = useState(API_STATUS.INITIAL);


  const [userSortBy, setUserSortBy] = useState('name')
  const [storeSortBy, setStoreSortBy] = useState('name')

  const [owner, setOwner] = useState([])

  const [activeModal, setActiveModal] = useState(null)
  const [selectedId, setSelectedId] = useState(null)

  const { token, url } = useContext(AppContext)

  const fetchUsers = async () => {
    try {
      setUserApiStatus(API_STATUS.IN_PROGRESS);

      const params = new URLSearchParams({
        search: userSearchQuery,
        sortBy: userSortBy,
        page: userCurrentPage
      });

      const response = await axios.get(`${url}/admin/users?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setUsers(response.data.users || []);
        setUserPagination({
          totalPages: response.data.pagination.totalPages,
          total: response.data.pagination.total,
        });
        setUserApiStatus(API_STATUS.SUCCESS);
      }
    } catch (error) {
      console.log('users:', error);
      setUsers([]);
      setUserApiStatus(API_STATUS.FAILED);
    }
  };
  
  const getAllUsers = async () => {
     try {
           const response = await axios.get(`${url}/admin/allusers`, {
             headers: {
               Authorization: `Bearer ${token}`
             }
           });
           if (response.status === 200) {
             setOwner(response.data.users || []);
             console.log('Fetched owner as users:', response.data.users);
           }
       } catch(error){
           console.log('Error fetching users:', error);
       }
     
  }

  const fetchDashboard = async () => {
    try {
      // setDashboardApiStatus(API_STATUS.IN_PROGRESS);

      const response = await axios.get(`${url}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setDashboard(response.data);
        // setDashboardApiStatus(API_STATUS.SUCCESS);
      }
    } catch (error) {
      console.log(error);
      // setDashboardApiStatus(API_STATUS.FAILED);
    }
  };


  const fetchStores = async () => {
    try {
      setStoreApiStatus(API_STATUS.IN_PROGRESS);

      const params = new URLSearchParams({
        search: storeSearchQuery,
        sortBy: storeSortBy,
        page: storeCurrentPage
      });

      const response = await axios.get(`${url}/admin/stores?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 200) {
        setStores(response.data.stores || []);
        setStorePagination({
          totalPages: response.data.pagination.totalPages,
          total: response.data.pagination.total,
        });
        setStoreApiStatus(API_STATUS.SUCCESS);
      }
    } catch (error) {
      console.log('stores:', error);
      setStores([]);
      setStoreApiStatus(API_STATUS.FAILED);
    }
  };

  useEffect(() => { getAllUsers() }, [url, token, activeModal])
  useEffect(() => { fetchDashboard() }, [url, token, activeModal])
  useEffect(() => { fetchUsers() }, [url, token, userSearchQuery, userCurrentPage, userSortBy, activeModal, activeModal])
  useEffect(() => { fetchStores() }, [url, token, storeSearchQuery, storeCurrentPage, storeSortBy, activeModal, activeModal])

  useEffect(() => {
    setUserCurrentPage(1);
  }, [userSearchQuery, userSortBy]);

  useEffect(() => {
    setStoreCurrentPage(1);
  }, [storeSearchQuery, storeSortBy]);


  const closeModal = () => {
    setActiveModal(null)
    setSelectedId(null)
  }

  const handlePaginationNUser = () => {
    setUserCurrentPage(prev => prev - 1)
  }

  const handlePaginationPUser = () => {
    setUserCurrentPage(prev => prev + 1)
  }

  const handlePaginationNStore = () => {
    setStoreCurrentPage(prev => prev - 1)
  }

  const handlePaginationPStore = () => {
    setStoreCurrentPage(prev => prev + 1)
  }

  const openAddUser = () => setActiveModal('addUser')
  const openAddStore = () => setActiveModal('addStore')
  const openViewUser = (id) => {
    setSelectedId(id)
    setActiveModal('viewUser')
  }

  const FailureView = ({ onRetry }) => (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <p className="text-gray-600 font-medium">Something went wrong</p>
      <button
        onClick={onRetry}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-md text-sm"
      >
        Try Again
      </button>
    </div>
  );


  return (
    <>
      <div>
        <Header />
        <div className='flex flex-col py-[2%] px-[5%] gap-8'>
          <h2 className='text-2xl lg:text-3xl font-bold text-gray-900'>Admin Dashboard</h2>

          {/* Dashboard Summary */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-10 lg:gap-25 xl:gap-50'>
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
            {userApiStatus === API_STATUS.IN_PROGRESS && <Loader />}

            {userApiStatus === API_STATUS.FAILED && (
              <FailureView onRetry={fetchUsers} />
            )}

            {userApiStatus === API_STATUS.SUCCESS && (
              <>
                <Table setSelectedId={openViewUser} details={users} />

                {/* Pagination */}
                <div className="flex justify-center gap-2 items-center mt-6">
                  <button
                    onClick={handlePaginationNUser}
                    disabled={userCurrentPage === 1}
                    className="bg-[#d33b3b] disabled:opacity-50 py-0.5 px-3 text-sm rounded-sm text-white font-medium"
                  >
                    Previous
                  </button>

                  <p className="text-lg font-medium text-gray-600">{userCurrentPage}</p>

                  <button
                    onClick={handlePaginationPUser}
                    disabled={userCurrentPage === userPagination.totalPages}
                    className="bg-[#d33b3b] disabled:opacity-50 py-0.5 px-3 text-sm rounded-sm text-white font-medium"
                  >
                    Next
                  </button>
                </div>
              </>
            )}


            \
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

            {storeApiStatus === API_STATUS.IN_PROGRESS && <Loader />}

            {storeApiStatus === API_STATUS.FAILED && (
              <FailureView onRetry={fetchStores} />
            )}

            {storeApiStatus === API_STATUS.SUCCESS && (
              <>
                <TableS details={stores} />

                {/* Pagination */}
                <div className="flex justify-center gap-2 items-center mt-6">
                  <button
                    onClick={handlePaginationNStore}
                    disabled={storeCurrentPage === 1}
                    className="bg-[#d33b3b] disabled:opacity-50 py-0.5 px-3 text-sm rounded-sm text-white font-medium"
                  >
                    Previous
                  </button>

                  <p className="text-lg font-medium text-gray-600">{storeCurrentPage}</p>

                  <button
                    onClick={handlePaginationPStore}
                    disabled={storeCurrentPage === storePagination.totalPages}
                    className="bg-[#d33b3b] disabled:opacity-50 py-0.5 px-3 text-sm rounded-sm text-white font-medium"
                  >
                    Next
                  </button>
                </div>
              </>
            )}

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
            {activeModal === 'addStore' && <PostStore onClose={closeModal} owner={owner} />}
            {activeModal === 'viewUser' && <UserDetails onClose={closeModal} id={selectedId} />}
          </div>
        </div>
      )}
      <Footer />
    </>
  )
}

export default AdminDashboard
