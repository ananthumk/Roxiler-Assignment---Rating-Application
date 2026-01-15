import React, { useContext, useEffect, useState } from 'react';
import { MapPin, Mail, Search } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { AppContext } from '../context/storeContext';
import axios from 'axios';
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';

const API_STATUS = {
  INITIAL: 'INITIAL',
  IN_PROGRESS: 'IN_PROGRESS',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
};

const Dashboard = () => {
  const [stores, setStores] = useState([]);
  const [apiStatus, setApiStatus] = useState(API_STATUS.INITIAL);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    totalPages: 1,
    total: 0,
  });

  const { url, token, currentUser } = useContext(AppContext);
  console.log(currentUser);

  const handlePaginationN = () => {
    if (currentPage === 1) return;
    setCurrentPage(prev => prev - 1);
  };

  const handlePaginationP = () => {
    if (currentPage === pagination.totalPages) return;
    setCurrentPage(prev => prev + 1);
  };


  const fetchStoreDetails = async () => {
    try {
      setApiStatus(API_STATUS.IN_PROGRESS);

      const params = new URLSearchParams({
        search: searchQuery.trim(),
        page: currentPage,
      });

      const urlValue = `${url}/user/stores?${params.toString()}`;

      const response = await axios.get(urlValue, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setStores(response.data.stores);
      setPagination({
        totalPages: response.data.pagination.totalPages,
        total: response.data.pagination.total,
      });

      setApiStatus(API_STATUS.SUCCESS);
    } catch (error) {
      console.log('Fetch stores error:', error.message);
      setApiStatus(API_STATUS.FAILED);
    }
  };


  useEffect(() => {
    if (token && url) {
      fetchStoreDetails();
    }
  }, [token, url, currentPage, searchQuery]);
  
  const renderNoStore = () => (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <p className="text-lg font-semibold text-gray-600">
        No stores available
      </p>
    </div>
  )

  const renderLoader = () => <Loader />;

  const renderFailure = () => (
    <div className="flex flex-col items-center justify-center gap-4 py-10">
      <p className="text-lg font-semibold text-red-500">
        Something went wrong
      </p>
      <button
        onClick={fetchStoreDetails}
        className="bg-[#d33b3b] px-5 py-2 text-white rounded-md font-medium"
      >
        Try Again
      </button>
    </div>
  );

  const renderSuccess = () => (
    <>
    {stores.length === 0 ? (
      renderNoStore()
    ) : (<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((store) => (
          <div
            key={store.id}
            className="py-3 px-6 bg-white w-full md:max-w-[400px] shadow-2xl shadow-gray-200 rounded-sm flex flex-col gap-2"
          >
            <h3 className="text-[19px] font-semibold">{store.name}</h3>

            <div className="flex text-gray-500 items-center gap-2">
              <Mail className="w-5 h-5" />
              <p className="text-[15px]">{store.email}</p>
            </div>

            <div className="flex text-gray-600 items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-500" />
              <p className="text-[15px]">{store.address}</p>
            </div>

            <div className="flex items-center gap-1">
              <svg
                className="w-5 h-5 text-yellow-400"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" />
              </svg>
              <p className="text-sm font-medium">
                {store.average_rating || 0}
              </p>
              <p className="text-sm font-medium">
                ({store.rating_count || 0})
              </p>
            </div>

            <div className="flex justify-between items-center pt-3 border-t border-gray-200">
              <p className="text-md text-gray-500 font-medium">
                Your Rating: {store.user_rating || 0}
              </p>
              <StarRating store={store} onRated={fetchStoreDetails} />
            </div>
          </div>
        ))}
      </div>)}
      

      {/* Pagination */}
      <div className="flex justify-center gap-2 items-center mt-6">
        <button
          onClick={handlePaginationN}
          disabled={currentPage === 1}
          className="bg-[#d33b3b] disabled:opacity-50 py-0.5 px-3 text-sm rounded-sm text-white font-medium"
        >
          Previous
        </button>

        <p className="text-lg font-medium text-gray-600">{currentPage}</p>

        <button
          onClick={handlePaginationP}
          disabled={currentPage === pagination.totalPages}
          className="bg-[#d33b3b] disabled:opacity-50 py-0.5 px-3 text-sm rounded-sm text-white font-medium"
        >
          Next
        </button>
      </div>
    </>
  );


  return (
    <div className="bg-[#fffefe] min-h-screen">
      <Header />

      <div className="flex flex-col py-[2%] px-[5%] gap-8">
        <h2 className="text-2xl lg:text-3xl font-bold">Available Stores</h2>

        <div className="flex items-center border-2 border-gray-200 rounded-md gap-3 py-2 md:py-3 px-4 md:px-8">
          <Search className="w-5 h-5 text-gray-700" />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location..."
            className="w-full bg-transparent border-0 outline-0 text-lg text-gray-700 placeholder:text-gray-400"
          />
        </div>

        {apiStatus === API_STATUS.IN_PROGRESS && renderLoader()}
        {apiStatus === API_STATUS.FAILED && renderFailure()}
        {apiStatus === API_STATUS.SUCCESS && renderSuccess()}
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
