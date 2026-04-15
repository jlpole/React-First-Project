import React, { useState, useEffect } from 'react';
import { Trash2, Edit, Search, Eye } from 'lucide-react';
import Sidebar from '../../Components/Sidebar';
import TopbarMembers from '../../Components/Memberstopbar';
import axios from 'axios';
import OwnersDetail from '../../Components/OwnerDetail';
export default function TeamTable() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
    const [showModal, setShowModal] = useState(false);
  useEffect(() => {
    fetchBusinesses();
  }, [currentPage]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/Business", {
        params: { page: currentPage, limit: 10 }
      });
      setBusinesses(res.data.businesses);
      setTotalPages(res.data.totalPages);
      setError(null);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      setError("Failed to load businesses");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };


// Add this helper function sa taas sa component
const getAvatarColorClass = (color) => {
  const colors = {
    blue: 'bg-gradient-to-r from-blue-500 to-blue-600',
    green: 'bg-gradient-to-r from-green-500 to-green-600',
    purple: 'bg-gradient-to-r from-purple-500 to-purple-600',
    pink: 'bg-gradient-to-r from-pink-500 to-pink-600',
    yellow: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
    gray: 'bg-gradient-to-r from-gray-500 to-gray-600'
  };
  return colors[color] || 'bg-gradient-to-r from-gray-500 to-gray-600';
};

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-50 text-green-600';
      case 'pending':
      case 'pending review': return 'bg-yellow-50 text-yellow-600';
      case 'inactive': return 'bg-gray-50 text-gray-600';
      default: return 'bg-gray-50 text-gray-600';
    }
  };

  const getStatusDotClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active': return 'bg-green-600';
      case 'pending':
      case 'pending review': return 'bg-yellow-600';
      case 'inactive': return 'bg-gray-600';
      default: return 'bg-gray-600';
    }
  };







 const getTeamColor = (businessType) => {
    const colors = {
      Retail: "bg-blue-50 text-blue-600",
      "Retail Business": "bg-blue-50 text-blue-600",
      Service: "bg-indigo-50 text-indigo-600",
      Manufacturing: "bg-violet-50 text-violet-600",
      Technology: "bg-purple-50 text-purple-600",
      "Tech Business": "bg-purple-50 text-purple-600",
      Food: "bg-orange-50 text-orange-600",
      Forestry: "bg-green-50 text-green-600",
      Trading: "bg-amber-50 text-amber-600",
      "Trading Business": "bg-amber-50 text-amber-600",
      "Online Service Provider": "bg-cyan-50 text-cyan-600",
      Agriculture: "bg-lime-50 text-lime-600",
      Construction: "bg-stone-50 text-stone-600",
      Healthcare: "bg-red-50 text-red-600",
      Education: "bg-sky-50 text-sky-600",
      Finance: "bg-emerald-50 text-emerald-600",
      Transportation: "bg-yellow-50 text-yellow-600",
      Entertainment: "bg-fuchsia-50 text-fuchsia-600",
      Hospitality: "bg-rose-50 text-rose-600"
    };
    return colors[businessType] || "bg-gray-50 text-gray-600";
  };

  const filteredBusinesses = businesses.filter(business => {
    const searchLower = searchQuery.toLowerCase();
    return (
      business.ownerName?.toLowerCase().includes(searchLower) ||
      business.ownerEmail?.toLowerCase().includes(searchLower) ||
      business.name?.toLowerCase().includes(searchLower) ||
      business.businessType?.toLowerCase().includes(searchLower)
    );
  });

  const parseProducts = (products) => {
    if (!products) return [];
    if (Array.isArray(products)) return products;
    if (typeof products === 'string') return products.split(',').map(p => p.trim());
    return [];
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <TopbarMembers />

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-8xl mx-auto">
            {/* Header with Search */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900">Business Owners</h1>

              {/* Search Box - Aligned Right */}
              <div className="flex justify-end w-full md:w-auto">
                <div className="relative w-full md:w-80">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                  <input
                    type="text"
                    placeholder="Search by owner, email, or business..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-800 mb-4"></div>
                <p className="text-gray-600">Loading business owners...</p>
              </div>
            )}

            {/* Error State */}
            {error && !loading && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md mx-auto text-center">
                <p className="text-red-600 mb-4">{error}</p>
                <button
                  onClick={fetchBusinesses}
                  className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Table */}
            {!loading && !error && (
              <>
                <div className="overflow-hidden rounded-lg border border-gray-200 shadow-md">
                  <table className="w-full border-collapse bg-white text-left text-sm text-gray-500">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 font-medium text-gray-900">Business Owner</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Business Name</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Age</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Type of Business</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Products</th>
                        <th className="px-6 py-4 font-medium text-gray-900">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 border-t border-gray-100">
                      {filteredBusinesses.length === 0 ? (
                        <tr>
                          <td colSpan="6" className="px-6 py-12 text-center text-gray-500">
                            {searchQuery ? 'No results found' : 'No business owners found'}
                          </td>
                        </tr>
                      ) : (
                        filteredBusinesses.map((business) => {
                          const products = parseProducts(business.Products);

                          return (
                            <tr key={business.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4">
                                <div className="flex gap-3 items-center">
                                 <div className="relative h-10 w-10">
                            
                                    <div className={`h-full w-full rounded-full ${getAvatarColorClass(business.color)} flex items-center justify-center text-white font-bold text-sm`}>
                                      {business.ownerName?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                  
                                  <span className={`absolute right-0 bottom-0 h-2 w-2 rounded-full ring ring-white ${
                                    business.status?.toLowerCase() === 'active' ? 'bg-green-400' : 'bg-gray-400'
                                  }`}></span>
                                </div>
                                  <div className="text-sm">
                                    <div className="font-medium text-gray-700">{business.ownerName || 'N/A'}</div>
                                    <div className="text-gray-400">{business.ownerEmail || 'N/A'}</div>
                                  </div>
                                </div>
                              </td>

                              <td className="px-6 py-4">
                                <div className="font-medium text-gray-700">{business.name}</div>
                                <div className="text-gray-400 text-xs">{business.id}</div>
                              </td>

                            <td className="px-6 py-4">
  <div className="text-sm text-gray-700">
{business.ownerAge ?? 'N/A'}

  </div>
</td>


                              <td className="px-6 py-4">
                                <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${getTeamColor(business.businessType)}`}>
                                  {business.businessType || 'General'}
                                </span>
                              </td>

                             <td className="px-6 py-4">
  <div className="flex gap-2 flex-wrap max-w-xs">
    {business.products && business.products.length > 0 ? (
      business.products.slice(0, 3).map((product, index) => (
        <span
          key={index}
          className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-600"
          title={product.name} // Show name on hover
        >
          {product.description || product.name || 'No description'}
        </span>
      ))
    ) : (
      <span className="text-gray-400 text-xs">No products listed</span>
    )}
    {business.products && business.products.length > 3 && (
      <span className="text-xs text-gray-500">+{business.products.length - 3} more</span>
    )}
  </div>
</td>

                             <td className="px-6 py-4">
  <div className=" items-center">

    <button
      className="text-gray-600 hover:text-blue-600 transition-colors"
      title="View Details"
        onClick={() => handleViewDetails(business)}
    >
      <Eye className="h-5 w-6" />
    </button>
  </div>
</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                <div className="mt-6 flex justify-between items-center">
                  <p className="text-gray-600">
                    Showing {filteredBusinesses.length} of {businesses.length} business owners
                  </p>
                  <nav className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Previous
                    </button>

                    <span className="px-4 py-2">
                      Page {currentPage} of {totalPages}
                    </span>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </>
            )}


             {showModal && selectedBusiness && (
        <OwnersDetail
          business={selectedBusiness}
          onClose={() => setShowModal(false)}
        />
      )}
          </div>
        </div>
      </div>
    </div>

                  










  );
}
