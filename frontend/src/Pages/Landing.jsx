import React, { useState, useEffect } from 'react';
import { Search, MapPin, Phone, ChevronRight, Filter, Store, Users, X, Mail, Building2, LogIn, UserPlus, Send, MessageSquare } from 'lucide-react';
import Header from '../Header';
import HeroSection from '../HeroSection';
import Informations from '../Information';  
import Features from '../Features';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom'; // ✅ added useLocation
import { ToastContainer, toast } from 'react-toastify'; // ✅ added
import 'react-toastify/dist/ReactToastify.css'; // ✅ added

export default function CooperativeBusinessListing() {
  const navigate = useNavigate();
  const location = useLocation(); // ✅ added
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [pendingBusiness, setPendingBusiness] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState(null);
  
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [interestMessage, setInterestMessage] = useState('');
  const [sendingMessage, setSendingMessage] = useState(false);
  
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pendingReview: 0
  });

  const categories = [
    'All',
    'Retail Stores',
    'Food & Beverage',
    'Services',
    'Agriculture',
    'Manufacturing',
    'Wholesale'
  ];

useEffect(() => {
  if (location.state?.showWelcomeToast) {
    const userName = location.state.userName || 'Marketer';
    toast.success(`Welcome, ${userName}! Glad to have you here.`, {
      position: "top-right",
      autoClose: 4000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
      
      // ✅ Add these
      style: {
        background: '#15803d', // green-700
        color: '#ffffff',      // white text
      },
      progressStyle: {
        background: '#facc15', // yellow progress bar
      },
      // ✅ Add this - white check icon
icon: () => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="#ffffff" 
    strokeWidth="2.5" 
    strokeLinecap="round" 
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
),
    });
    window.history.replaceState({}, document.title);
  }
}, [location.state]);

  // Check if user is logged in on component mount
  useEffect(() => {
    const checkAuthStatus = () => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      
      if (token && user) {
        try {
          const userData = JSON.parse(user);
          setIsLoggedIn(true);
          setUserRole(userData.role);
        } catch (err) {
          console.error('Error parsing user data:', err);
          setIsLoggedIn(false);
          setUserRole(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserRole(null);
      }
    };

    checkAuthStatus();
  }, []);

  const handleViewDetails = (business) => {
    if (isLoggedIn && userRole === 'Marketer') {
      setSelectedBusiness(business);
      setShowModal(true);
      document.body.style.overflow = 'hidden';
    } else {
      setPendingBusiness(business);
      setShowAuthModal(true);
      document.body.style.overflow = 'hidden';
    }
  };

  const handleRegisterAsMarketer = () => {
    setShowAuthModal(false);
    document.body.style.overflow = 'unset';
    navigate('/MarketerRegister');
  };

  const handleGoToLogin = () => {
    setShowAuthModal(false);
    document.body.style.overflow = 'unset';
    navigate('/login?redirect=business-details');
  };

  const handleCloseAuthModal = () => {
    setShowAuthModal(false);
    setPendingBusiness(null);
    document.body.style.overflow = 'unset';
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedBusiness(null);
    document.body.style.overflow = 'unset';
  };

  const handleShowInterest = () => {
    setShowInterestModal(true);
setInterestMessage(`Hi! I'm interested in the products offered by ${selectedBusiness.name}. I would like to know more details. Thank you!`);
  };

  const handleCloseInterestModal = () => {
    setShowInterestModal(false);
    setInterestMessage('');
  };

  const handleSendInterest = async () => {
    if (!interestMessage.trim()) {
      alert('Please enter a message');
      return;
    }

    try {
      setSendingMessage(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        alert('Please log in to send interest');
        navigate('/login');
        return;
      }
      
      const response = await axios.post(
        'http://localhost:5000/api/interest/send',
        {
          businessId: selectedBusiness.id,
          message: interestMessage,
          businessName: selectedBusiness.name,
          businessOwnerEmail: selectedBusiness.ownerEmail
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Interest sent:', response.data);
      alert('Your interest has been sent successfully!');
      
      setShowInterestModal(false);
      setShowModal(false);
      setInterestMessage('');
      document.body.style.overflow = 'unset';
      
    } catch (err) {
      console.error('Error sending interest:', err);
      
      if (err.response?.status === 401) {
        alert('Your session has expired. Please log in again.');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      } else {
        alert(err.response?.data?.message || 'Failed to send interest. Please try again.');
      }
    } finally {
      setSendingMessage(false);
    }
  };

  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/api/Landing');
        
        const transformedData = response.data.businesses.map(biz => ({
          id: biz.businessId,
          name: biz.name,
          category: biz.businessType || 'General',
          rating: 4.5,
          reviews: Math.floor(Math.random() * 200),
          location: biz.ownerCity || 'Cagayan de Oro',
          address: biz.address || 'N/A',
          phone: biz.phone || 'N/A',
          email: biz.email || 'N/A',
          image: biz.mainImage || 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=300&fit=crop',
          description: biz.description || 'No description available',
          member: biz.status === 'Active',
          date: biz.date || 'N/A',
          registrationNumber: biz.registrationNumber || 'N/A',
          tinNumber: biz.tinNumber || 'N/A',
          ownerName: biz.ownerName || 'N/A',
          ownerEmail: biz.ownerEmail || 'N/A',
          ownerContactNumber: biz.ownerContactNumber || 'N/A',
          images: biz.images || [],
          products: biz.products || []
        }));

        setBusinesses(transformedData);
        setStats(response.data.statistics);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching businesses:', err);
        setError('Failed to load businesses');
        setLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  const filteredBusinesses = businesses.filter(business => {
    const matchesSearch = business.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         business.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || business.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const displayedBusinesses = showAll ? filteredBusinesses : filteredBusinesses.slice(0, 6);

// ✅ Move ToastContainer BEFORE the loading/error returns
if (loading) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* ✅ Add ToastContainer here too */}
      <ToastContainer />
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading businesses...</p>
      </div>
    </div>
  );
}

if (error) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      {/* ✅ Add ToastContainer here too */}
      <ToastContainer />
      <div className="text-center text-red-600">
        <p>{error}</p>
      </div>
    </div>
  );
}

  return (   
    <div className="min-h-screen bg-gray-50">

      {/* ✅ Toast Container - place at top */}
      <ToastContainer />

      <Header/>
      <HeroSection />
      <Informations />
      <Features />

      {/* Search Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Discover Member Businesses</h3>
            <p className="text-gray-600">Find quality products and services from OIC cooperative members</p>
          </div>

          <div className="max-w-3xl mx-auto bg-gray-50 rounded-xl shadow-md p-6 mb-12">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search businesses or products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none"
                />
              </div>
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-800 focus:border-transparent outline-none appearance-none bg-white"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Member Businesses', value: `${stats.total || 0}`, color: 'green' },
              { label: 'Active Businesses', value: `${stats.active || 0}`, color: 'yellow' },
              { label: 'Products Listed', value: '2,000+', color: 'green' },
              { label: 'Cities Covered', value: '15+', color: 'yellow' }
            ].map((stat, idx) => (
              <div key={idx} className={`bg-${stat.color === 'green' ? 'green' : 'yellow'}-${stat.color === 'green' ? '800' : '400'} rounded-xl p-6 text-center shadow-lg`}>
                <div className={`text-3xl font-bold ${stat.color === 'green' ? 'text-white' : 'text-black'}`}>
                  {stat.value}
                </div>
                <div className={`text-sm ${stat.color === 'green' ? 'text-green-100' : 'text-black'} font-medium mt-1`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Business Listings */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-gray-900">
              {showAll ? 'All Member Businesses' : 'Featured Member Businesses'}
            </h3>
            <button 
              onClick={() => setShowAll(!showAll)}
              className="text-green-600 font-medium flex items-center hover:text-green-700"
            >
              {showAll ? 'Show Less' : `View All (${filteredBusinesses.length})`}
              <ChevronRight className={`w-5 h-5 ml-1 transition-transform ${showAll ? 'rotate-90' : ''}`} />
            </button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedBusinesses.map(business => (
              <div key={business.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border-t-4 border-yellow-400">
                <div className="relative">
                  <img src={business.image} alt={business.name} className="w-full h-48 object-cover" />
                  {business.member && (
                    <div className="absolute top-4 right-4 bg-green-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                      OIC MEMBER
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-900">{business.name}</h4>
                  </div>
                  <p className="text-sm text-green-600 font-medium mb-2">{business.category}</p>
                  <p className="text-sm text-gray-600 mb-4">{business.description}</p>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-green-600" />
                      {business.address}
                    </div>
                    <div className="flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-green-600" />
                      {business.phone}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-500">
  Operating Since {business.date ? new Date(business.date).getFullYear() : 'N/A'}
</span>
                    <button 
                      onClick={() => handleViewDetails(business)}
                      className="bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-green-700 transition"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {!showAll && filteredBusinesses.length > 6 && (
            <div className="text-center mt-12">
              <p className="text-gray-600 mb-4 text-lg">
                Showing <span className="font-bold text-green-800">{displayedBusinesses.length}</span> of <span className="font-bold text-green-800">{filteredBusinesses.length}</span> businesses
              </p>
              <button 
                onClick={() => setShowAll(true)}
                className="bg-green-800 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-green-700 transition-all transform hover:scale-105 shadow-lg"
              >
                View All Businesses
              </button>
            </div>
          )}

          {showAll && filteredBusinesses.length > 6 && (
            <div className="text-center mt-12">
              <button 
                onClick={() => {
                  setShowAll(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="bg-gray-600 text-white px-8 py-3 rounded-lg font-bold text-lg hover:bg-gray-700 transition-all transform hover:scale-105 shadow-lg"
              >
                Show Less
              </button>
            </div>
          )}

          {displayedBusinesses.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No businesses found matching your search.</p>
            </div>
          )}
        </div>
      </section>

      {/* Auth Check Modal */}
      {showAuthModal && pendingBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8 relative shadow-2xl">
            <button 
              onClick={handleCloseAuthModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <Users className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-3">
              Are you  Interested?
            </h2>
            
            <p className="text-gray-600 text-center mb-8">
              To view detailed business information and connect with <strong>{pendingBusiness.name}</strong>, you need to be registered as a Marketer.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleRegisterAsMarketer}
                className="w-full bg-green-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
              >
                <UserPlus className="w-5 h-5" />
                Register as Marketer
              </button>

              <button
                onClick={handleGoToLogin}
                className="w-full bg-white border-2 border-green-800 text-green-800 px-6 py-3 rounded-lg font-bold hover:bg-green-50 transition flex items-center justify-center gap-2"
              >
                <LogIn className="w-5 h-5" />
                I already have an account
              </button>

              <button
                onClick={handleCloseAuthModal}
                className="w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-200 transition"
              >
                Maybe Later
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 text-center">
                By registering as a Marketer, you'll get access to business contact details, product catalogs, and direct messaging with business owners.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Business Details Modal */}
      {showModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={handleCloseModal}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div className="relative h-64 bg-gray-200">
              <img 
                src={selectedBusiness.image} 
                alt={selectedBusiness.name} 
                className="w-full h-full object-cover"
              />
              {selectedBusiness.member && (
                <div className="absolute top-4 left-4 bg-yellow-400 text-green-900 px-4 py-2 rounded-full text-sm font-bold">
                  OIC MEMBER
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="mb-6">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedBusiness.name}</h2>
                <p className="text-lg text-green-600 font-semibold">{selectedBusiness.category}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3">About This Business</h3>
                <p className="text-gray-600 leading-relaxed">{selectedBusiness.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Phone className="w-5 h-5 mr-2 text-green-600" />
                    Business Contact Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-900">{selectedBusiness.phone}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Email</p>
                      <p className="text-gray-900">{selectedBusiness.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Address</p>
                      <p className="text-gray-900">{selectedBusiness.address}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Location</p>
                      <p className="text-gray-900">{selectedBusiness.location}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-green-600" />
                    Business Details
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Operating Since</p>
                   <p className="text-gray-900">
  {selectedBusiness.date ? new Date(selectedBusiness.date).getFullYear() : 'N/A'}
</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Status</p>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        selectedBusiness.member ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {selectedBusiness.member ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {selectedBusiness.ownerName && selectedBusiness.ownerName !== 'N/A' && (
                <div className="bg-gray-100 rounded-xl p-6 mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                    <Users className="w-5 h-5 mr-2 text-green-600" />
                    Owner Information
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">Name</p>
                      <p className="text-gray-900">{selectedBusiness.ownerName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Email</p>
                      <p className="text-gray-900">{selectedBusiness.ownerEmail}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">Contact</p>
                      <p className="text-gray-900">{selectedBusiness.ownerContactNumber}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedBusiness.products && selectedBusiness.products.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Products & Services</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {selectedBusiness.products.slice(0, 6).map((product, idx) => (
                      <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                        <p className="font-semibold text-gray-900 text-sm">{product.name}</p>
                        {product.description && (
                          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedBusiness.images && selectedBusiness.images.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Gallery ({selectedBusiness.images.length} images)</h3>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                    {selectedBusiness.images.map((img, idx) => (
                      <img 
                        key={img.id || idx}  
                        src={img.path}       
                        alt={`${selectedBusiness.name} - Image ${idx + 1}`}
                        className="w-full h-24 object-cover rounded-lg hover:opacity-75 transition cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button 
                  onClick={handleShowInterest}
                  className="flex-1 bg-green-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2"
                >
                  <MessageSquare className="w-5 h-5" />
                  Interested?
                </button>
                <button 
                  onClick={handleCloseModal}
                  className="sm:w-auto bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interest/Message Modal */}
      {showInterestModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 relative shadow-2xl">
            <button 
              onClick={handleCloseInterestModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <MessageSquare className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Express Your Interest
            </h2>
            
            <p className="text-center text-gray-600 mb-6">
              Send a message to <strong className="text-green-700">{selectedBusiness.name}</strong>
            </p>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Message
              </label>
              <textarea
                value={interestMessage}
                onChange={(e) => setInterestMessage(e.target.value)}
                rows={6}
                placeholder="Write your message here..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-2">
                {interestMessage.length} characters
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900">Your message will be sent to owners email:</p>
                  <p className="text-sm text-blue-700 mt-1">{selectedBusiness.ownerEmail}</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={handleSendInterest}
                disabled={sendingMessage || !interestMessage.trim()}
                className="flex-1 bg-green-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sendingMessage ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    Send Message
                  </>
                )}
              </button>

              <button
                onClick={handleCloseInterestModal}
                disabled={sendingMessage}
                className="sm:w-auto bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-700 to-green-600 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&h=400&fit=crop)',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}></div>
        </div>
        <div className="max-w-4xl mx-auto text-center relative">
          <h3 className="text-4xl font-bold text-white mb-4">Ready to Grow Your Business?</h3>
          <p className="text-xl text-green-50 mb-8">
            Join OIC Associates today and reach thousands of potential customers in our cooperative community
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-yellow-400 text-green-900 px-8 py-4 rounded-lg font-bold text-lg hover:bg-yellow-300 transition-all transform hover:scale-105 shadow-lg">
              Become a Partner
            </button>
            <button className="bg-white text-green-700 px-8 py-4 rounded-lg font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center">
                  <Store className="w-6 h-6 text-green-700" />
                </div>
                <div>
                  <h5 className="font-bold text-lg">OIC Associates</h5>
                  <p className="text-xs text-gray-400">Since 1966</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm">Building stronger communities through cooperative business</p>
            </div>
            <div>
              <h5 className="font-bold mb-4">Quick Links</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition">About OIC</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Become a Member</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Partner Program</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Contact Us</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Categories</h5>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-yellow-400 transition">Retail Stores</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Food & Beverage</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Agriculture</a></li>
                <li><a href="#" className="hover:text-yellow-400 transition">Services</a></li>
              </ul>
            </div>
            <div>
              <h5 className="font-bold mb-4">Connect With Us</h5>
              <p className="text-gray-400 text-sm mb-2">info@oic.coop</p>
              <p className="text-gray-400 text-sm mb-4">+63 88 XXX XXXX</p>
              <p className="text-gray-400 text-sm">Cagayan de Oro City, Philippines</p>
            </div>
          </div>
          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
            <p>© 2026 Oro Integrated Cooperative. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}