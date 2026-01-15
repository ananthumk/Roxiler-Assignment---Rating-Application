// FILE: src/components/RegisterForm.jsx
import { useContext, useState } from 'react';
import { IoIosMail, IoMdPerson } from "react-icons/io";
import { FaLock } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { AppContext } from "../context/storeContext";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
    const [registerDetails, setRegister] = useState({
        email: '', password: '', address: '', name: '', role: 'user'
    });
    const [errMsg, setErrMsg] = useState('');
    const { url, setCurrentUser, setToken } = useContext(AppContext);
    const navigate = useNavigate();

    const registerForm = async (e) => {
        e.preventDefault();
        setErrMsg('');

        const urlValue = '/auth/signup';
      
        try {
            const response = await axios.post(url + urlValue, registerDetails);
            console.log('Full response: ', response);

            if (response.status === 201 || response.status === 200) {
                if (!response.data.token || !response.data.user) {
                    setErrMsg('Invalid response from server');
                    console.error('Missing token or user in response:', response.data);
                    return;
                }
                
                setCurrentUser(response.data.user)
                setToken(response.data.token)
                
                setRegister({ email: '', password: '', address: '', name: '', role: 'user' });

                if(response.data.role === 'admin'){
                    navigate('/admin')
                } else if (response.data.role === 'owner'){
                    navigate('/owner')
                } else {
                    navigate('/')
                }
                

                setErrMsg('');
            } else {
                setErrMsg(response.data.message || 'Registration failed');
            }
        } catch (error) {
            console.error('Register error:', error);

            if (error.response) {
                const message = error.response.data?.message || error.response.data?.error;
                setErrMsg(message || `Error: ${error.response.status}`);
                console.error('Server error:', error.response.data);
            } else if (error.request) {
                setErrMsg('Cannot reach server. Please check your connection.');
                console.error('No response from server:', error.request);
            } else {
                setErrMsg('Something went wrong. Please try again.');
                console.error('Error:', error.message);
            }
        }
    };

    const handleRegister = (e) => {
        const { name, value } = e.target;
        setRegister(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="bg-white shadow-2xl rounded-2xl p-8 border border-gray-100">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Store <span className="text-[#ff6b6b]">Rating</span>
                        </h1>
                    </div>
                    
                    <form onSubmit={registerForm} className="space-y-6">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
                                <IoMdPerson className="w-4 h-4 mr-2 text-gray-500" />
                                Full Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={registerDetails.name}
                                onChange={handleRegister}
                                required
                                className="w-full px-4 py-2 border-3 border-gray-300 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
                                <IoIosMail className="w-4 h-4 mr-2 text-gray-500" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={registerDetails.email}
                                onChange={handleRegister}
                                required
                                className="w-full px-4 py-2 border-3 border-gray-300 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                                placeholder="Enter your email"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
                                <FaLock className="w-4 h-4 mr-2 text-gray-500" />
                                Password
                            </label>
                            <input
                                type="password"
                                name="password"
                                value={registerDetails.password}
                                onChange={handleRegister}
                                required
                                className="w-full px-4 py-2 border-3 border-gray-300 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                                placeholder="Enter your password"
                            />
                        </div>

                        {/* Address */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2 flex items-center">
                                <FaLocationDot className="w-4 h-4 mr-2 text-gray-500" />
                                Address
                            </label>
                            <input
                                type="text"
                                name="address"
                                value={registerDetails.address}
                                onChange={handleRegister}
                                required
                                className="w-full px-4 py-2 border-3 border-gray-300 rounded-xl text-gray-900 text-base placeholder-gray-400 focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200"
                                placeholder="Enter your address"
                            />
                        </div>

                        {/* Role Select */}
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-2">
                                Account Type
                            </label>
                            <select
                                name="role"
                                value={registerDetails.role}
                                onChange={handleRegister}
                                required
                                className="w-full px-4 py-2 border-3 border-gray-300 rounded-xl text-gray-900 text-base bg-white focus:outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200 transition-all duration-200 appearance-none"
                            >
                                <option value="user">Customer</option>
                                <option value="owner">Store Owner</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>

                        
                        <button
                            type="submit"
                            className="w-full py-3 px-6 bg-[#071E22] hover:bg-[#071E22]/90 text-white font-bold text-xl rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#071E22]/20"
                        >
                            Create Account
                        </button>
                    </form>

                    {/* Error Message */}
                    {errMsg && (
                        <p className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 text-center rounded-xl text-sm font-medium">
                            {errMsg}
                        </p>
                    )}

                    
                    <div className="mt-8 text-center">
                        <p className="text-sm text-gray-600">
                            Already have an account?{' '}
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    navigate('/login');
                                }}
                                className="font-semibold text-[#071E22] hover:text-[#ff6b6b] transition-colors duration-200 underline underline-offset-2"
                            >
                                Sign In
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signup;
