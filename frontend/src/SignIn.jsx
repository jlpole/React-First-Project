import { useState } from 'react';
import {useNavigate} from 'react-router-dom';

function SignIn() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); 
  return (
    <>
      <div>
        <button
      onClick={() => navigate('/login')}
      className="bg-green-800 text-white px-4 py-2 rounded-lg font-bold hover:bg-green-700 transition"
    >
      Sign In
    </button>
      </div>
       
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
          <div className="relative p-4 w-full max-w-md">
            <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-6">
              <div className="flex items-center justify-between border-b border-gray-200 pb-4 md:pb-5">
                <h3 className="text-lg font-medium text-gray-900">
                  Sign in to our platform
                </h3>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-9 h-9 inline-flex justify-center items-center"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 17.94 6M18 18 6.06 6"/>
                  </svg>
                </button>
              </div>
      
              <div className="pt-4 md:pt-6">
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-gray-900">
                    Your email
                  </label>
                  <input 
                    type="email" 
                    id="email" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5" 
                    placeholder="example@company.com" 
                  />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="block mb-2.5 text-sm font-medium text-gray-900">
                    Your password
                  </label>
                  <input 
                    type="password" 
                    id="password" 
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5" 
                    placeholder="•••••••••" 
                  />
                </div>
                <div className="flex items-center justify-between my-6">
                  <div className="flex items-center">
                    <input 
                      id="remember" 
                      type="checkbox" 
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50"
                    />
                    <label htmlFor="remember" className="ms-2 text-sm font-medium text-gray-900">
                      Remember me
                    </label>
                  </div>
                  <a href="#" className="text-sm font-medium text-blue-700 hover:underline">
                    Lost Password?
                  </a>
                </div>
                <button 
                  className="text-black bg-yellow-400 hover:bg-yellow-500 font-medium rounded-lg text-sm px-4 py-2.5 w-full mb-3"
                >
                  Continue
                </button>
                <div className="text-sm font-medium text-gray-500 text-center">
                  Not registered? <a href="#" className="text-blue-700 hover:underline">Create account</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default SignIn;