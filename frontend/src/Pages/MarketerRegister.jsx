import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Loader from '../CssComponents/Loading'; 


function MarketerRegister(){
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const roleFromUrl = searchParams.get('role') || 'Marketer';

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/auth/Marketer/Register", { 
        firstName,
        lastName,
        email, 
        password,
        address,
        contactNumber,
        role: roleFromUrl
      });
      
      console.log(response);

      // Clear form
      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setAddress("");
      setContactNumber("");

      // Show success message
      alert("Registration successful! Please login.");

      // Navigate to login after 2 seconds
      setTimeout(() => {
        setLoading(false);
        navigate('/login');
      }, 2000);

    } catch (error) {
      console.log(`${error}`);
      
      if (error.response) {
        setError(error.response.data.message || 'Registration failed');
      } else if (error.request) {
        setError('No response from server. Please try again.');
      } else {
        setError('An error occurred. Please try again.');
      }
      
      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <>
    
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="relative p-4 w-full max-w-2xl">
          <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-6">
            <div className="flex items-center justify-between border-b border-gray-200 pb-4 md:pb-5">
              <div>
                <h3 className="text-lg font-medium text-gray-900">
                  Fill up the form
                </h3>
                {roleFromUrl === 'Marketer' && (
                  <span className="inline-block mt-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold">
                    Registering as Marketer
                  </span>
                )}
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded text-sm">
                {error}
              </div>
            )}

            <div className="pt-4 md:pt-6">
              <form onSubmit={handleSubmit}>
                {/* First Name & Last Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block mb-2.5 text-sm font-medium text-gray-900">
                      First Name
                    </label>
                    <input 
                      type="text" 
                      id="firstName"
                      value={firstName} 
                      onChange={(e) => setFirstName(e.target.value)}  
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5" 
                      placeholder="Juan" 
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block mb-2.5 text-sm font-medium text-gray-900">
                      Last Name
                    </label>
                    <input 
                      type="text" 
                      id="lastName"
                      value={lastName} 
                      onChange={(e) => setLastName(e.target.value)}  
                      required
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5" 
                      placeholder="Dela Cruz" 
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-gray-900">
                    Your email
                  </label>
                  <input 
                    type="email" 
                    id="email"
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}  
                    required
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5" 
                    placeholder="example@company.com" 
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-gray-900">
                    Your password
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}  
                    required
                    minLength={6}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5" 
                    placeholder="•••••••••" 
                  />
                  <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                </div>

                {/* Address */}
                <div className="mb-4">
                  <label htmlFor="address" className="block mb-2.5 text-sm font-medium text-gray-900">
                    Address
                  </label>
                  <textarea 
                    id="address"
                    value={address} 
                    onChange={(e) => setAddress(e.target.value)}  
                    required
                    rows={3}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5" 
                    placeholder="Your complete address" 
                  />
                </div>

                {/* Contact Number */}
                <div className="mb-4">
                  <label htmlFor="contactNumber" className="block mb-2.5 text-sm font-medium text-gray-900">
                    Contact Number
                  </label>
                  <input 
                    type="tel" 
                    id="contactNumber"
                    value={contactNumber} 
                    onChange={(e) => setContactNumber(e.target.value)}  
                    required
                    pattern="[0-9]{10,11}"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5" 
                    placeholder="09123456789" 
                  />
                  <p className="text-xs text-gray-500 mt-1">10-11 digits</p>
                </div>
        
                {/* Submit Button */}
                <button 
                  type="submit"
                  disabled={loading}
                  className="text-white bg-green-600 hover:bg-green-700 disabled:bg-yellow-300 disabled:cursor-not-allowed font-medium rounded-lg text-sm px-10 py-2.5 w-full mb-3"
                >
                  {loading ? 'Registering...' : 'Register'}
                </button>

                {/* Login Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => navigate('/login')}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Already have an account? Login
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MarketerRegister;