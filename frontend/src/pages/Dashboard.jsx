import React, { useContext, useEffect, useState } from 'react'
import { MapPin, Mail,Search  } from 'lucide-react';
import Header from '../components/Header'
import { AppContext } from '../context/storeContext'
import axios from 'axios'
import StarRating from '../components/StarRating';
import Loader from '../components/Loader';
import Footer from '../components/Footer';

const Dashboard = () => {
    const [stores, setStores] = useState([])
    const [loading, setLoading] = useState(true)

    const { url, token } = useContext(AppContext)
    const [searchQuery, setSearchQuery] = useState('')


    console.log(url, token)
    useEffect(() => {
        fetchStoreDetails()
    }, [url, token, searchQuery])

    const fetchStoreDetails = async () => {
        try {
            const params = new URLSearchParams({ search: searchQuery.trim()})
            const urlValue = url + `/user/stores?${params}`
            const response = await axios.get(urlValue, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            console.log(response)
            if (response.status === 200 || response.status === 201) {
                setStores(response.data.stores)
                console.log(response)
                setLoading(false)
            } else {
                console.log(`Error: ${response}`)
                setLoading(false)

            }
        } catch (error) {
            console.log('Error whiling fetching stores details in user dashboard: ', error.message)
                setLoading(false)

        }
    }

    return (
        <div className='bg-[#fffefe] h-screen'>
            <Header />
            <div className='flex flex-col py-[2%] px-[5%] gap-8'>
                <h2 className='text-2xl lg:text-3xl font-bold'>Avaiable Stores</h2>
                <div className='flex items-center border-2 border-gray-200 rounded-md gap-3 py-2 md:py-3 px-4 md:px-8'>
                    <Search className='w-5 h-5 text-gray-700' />
                    <input 
                     type="search"
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     placeholder='Search by name, location...'
                     className='w-full bg-transparent border-0 outline-0 text-lg
                      text-gray-400 placeholder:text-lg text-gray-300' />
                </div>
                {loading ? <Loader /> :  
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {stores?.map(store => (
                        <div key={store.id} className='py-3 px-6 flex bg-white w-full md:max-w-[400px] shadow-2xl shadow-gray-200 rounded-sm flex-col gap-2'>
                            <h3 className='text-[19px] font-semibold'>{store.name}</h3>
                            <div className='flex text-gray-500 items-center gap-2'>
                                <Mail className='w-5 h-5' />
                                <p className='text-[15px]'>{store.email}</p>
                            </div>
                            <div className='flex text-gary-600 items-center gap-2'>
                                <MapPin className='w-5 h-5 text-blue-500' />
                                <p className='text-[15px]'>{store.address}</p>
                            </div>
                            
                            <div className='flex items-center gap-1'>
                                <svg className="w-5 h-5 text-yellow-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M13.849 4.22c-.684-1.626-3.014-1.626-3.698 0L8.397 8.387l-4.552.361c-1.775.14-2.495 2.331-1.142 3.477l3.468 2.937-1.06 4.392c-.413 1.713 1.472 3.067 2.992 2.149L12 19.35l3.897 2.354c1.52.918 3.405-.436 2.992-2.15l-1.06-4.39 3.468-2.938c1.353-1.146.633-3.336-1.142-3.477l-4.552-.36-1.754-4.17Z" /></svg>
                                <p className=" text-sm text-black font-medium text-body">{`${store.average_rating || 0}`}</p>
                                <p className=" text-sm text-black font-medium text-body">{`(${store.rating_count || 0})`}</p>
                                    
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t-1 border-gray-400">
                                <div className='flex flex-col justify-center'>
                                    <p className='text-md text-gary-500 font-medium'>{`Your Rating: ${store.user_rating || 0}`}</p>
                                </div>
                                <StarRating store={store} />
                                
                            </div>

                        </div>
                    ))}
                </div>}
            </div>
            <Footer />
        </div>
    )
}

export default Dashboard
