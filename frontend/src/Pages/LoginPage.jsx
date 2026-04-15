import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import Loader from '../CssComponents/Loading';
import { useAuth } from '../AuthContext';
const role = {
  Admin: '/Admin/Dashboard',
  Owner: '/Owner/Dashboard',
  Marketer: '/'
};

const defaultroute = (userRole) => {
  return role[userRole] || '/login';
};

function Login() {
  const navigate = useNavigate();
    const { login } = useAuth(); 
  const [email, SetEmail] = useState("");
  const [password, SetPassword] = useState("");
  const [loading, SetLoading] = useState(false);
  const [error, SetError] = useState("");

  const API_URL = "http://localhost:5000/auth/login";

  const handlesubmit = async (e) => {
    e.preventDefault();
    SetLoading(true);
    SetError("");

    try {
      const response = await axios.post(API_URL, { email, password });
      const user = response.data.user;

      const userWithName = {
        ...user,
        name: user.name || user.username || user.email.split('@')[0]
      };

      // ✅ Gamita ang AuthContext login() instead of manual localStorage
      login(response.data.token, userWithName);

      const redirectPath = defaultroute(user.role);

// Login.jsx — update lang ang condition
if (user.role === 'Marketer' || user.role === 'Owner' || user.role === 'Admin') {
  sessionStorage.setItem('showWelcomeToast', 'true');
  sessionStorage.setItem('welcomeName', userWithName.name);
}
navigate(redirectPath); // ✅ navigate always, pwede na i-simplify

    } catch (error) {
      console.log(error);
      SetError("Invalid email or password. Please try again.");
    } finally {
      SetLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="relative p-4 w-full max-w-md">
        <div className="relative bg-white border border-gray-200 rounded-lg shadow-lg p-4 md:p-6">
          <div className="flex items-center justify-between border-b border-gray-200 pb-4 md:pb-5">
            <h3 className="text-lg font-medium text-gray-900">Login</h3>
          </div>

          <div className="pt-4 md:pt-6">
            <form onSubmit={handlesubmit}>
              <div className="mb-4">
                <label htmlFor="email" className="block mb-2.5 text-sm font-medium text-gray-900">
                  Your email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => SetEmail(e.target.value)}
                  required
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
                  value={password}
                  onChange={(e) => SetPassword(e.target.value)}
                  required
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full px-3 py-2.5"
                  placeholder="•••••••••"
                />
              </div>

              {/* ✅ Error message */}
              {error && (
                <p className="text-red-500 text-sm mb-3">{error}</p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="text-white bg-green-800 hover:bg-gray-500 disabled:bg-yellow-300 disabled:cursor-not-allowed font-medium rounded-lg text-sm px-10 py-2.5 w-full mb-3"
              >
                {loading ? 'Logging in...' : 'Continue'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;