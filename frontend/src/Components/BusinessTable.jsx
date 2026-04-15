import { EyeIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Tag, X, MapPin, Phone, Mail, Building2, Calendar } from 'lucide-react';
import ResponsiveForm from '../Components/ResponsiveForm';

const TABLE_HEAD = ["Business Name", "Business Type", "Business Address", "Operating Since", "Business Status", "Actions"];

export default function TransactionsTable() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ NEW: View Details Modal
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalBusinesses, setTotalBusinesses] = useState(0);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All Categories");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [FormModal, SetModal] = useState(false);

  // ✅ NEW: Handle view details click
  const handleViewDetails = (business) => {
    setSelectedBusiness(business);
    setShowViewModal(true);
  };

  // ✅ NEW: Close view modal
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedBusiness(null);
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
      case 'pending review':
        return 'bg-yellow-100 text-yellow-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getGradientClass = (index) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-yellow-500 to-yellow-600',
    ];
    return gradients[index % gradients.length];
  };

  const fetchBusinesses = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(`http://localhost:5000/api/Business/ID?page=${page}&limit=5`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      setBusinesses(response.data.businesses);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      setTotalBusinesses(response.data.pagination.totalBusinesses);
      setLoading(false);
    } catch (err) {
      setError('Failed to load businesses');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBusinesses(currentPage);
  }, [currentPage]);

  const handleBusinessCreated = () => {
    setSearchQuery("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
    SetModal(false);
    setCurrentPage(1);
    fetchBusinesses(1);
  };

  const handleCloseModal = () => {
    SetModal(false);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All Categories");
    setStatusFilter("All Status");
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const filteredBusinesses = useMemo(() => {
    return businesses.filter((business) => {
      const matchesSearch = 
        business.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.Business_type?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.Business_Address?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = 
        categoryFilter === "All Categories" || 
        business.Business_type === categoryFilter;
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        business.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [businesses, searchQuery, categoryFilter, statusFilter]);

  const categories = ['All Categories', ...new Set(businesses.map(b => b.Business_type).filter(Boolean))];
  const statuses = ['All Status', 'Active', 'Inactive', 'Pending'];
  const hasActiveFilters = searchQuery !== "" || categoryFilter !== "All Categories" || statusFilter !== "All Status";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your businesses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => fetchBusinesses(currentPage)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">My Businesses</h2>
          <p className="mt-1 text-sm text-gray-600">Manage and view all your businesses</p>
        </div>

        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search businesses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <div className="w-full md:w-48">
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
              {categories.map((category) => <option key={category} value={category}>{category}</option>)}
            </select>
          </div>

          <div className="w-full md:w-48">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white">
              {statuses.map((status) => <option key={status} value={status}>{status}</option>)}
            </select>
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
              <X size={16} /> Clear
            </button>
          )}

          <button onClick={() => SetModal(true)} className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap">
            <span className="text-xl">+</span> Add Business
          </button>
        </div>

        {hasActiveFilters && (
          <div className="mt-3 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Active filters:</span>
            {searchQuery && (
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md flex items-center gap-1">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery("")} className="hover:text-blue-900"><X size={12} /></button>
              </span>
            )}
            {categoryFilter !== "All Categories" && (
              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-md flex items-center gap-1">
                {categoryFilter}
                <button onClick={() => setCategoryFilter("All Categories")} className="hover:text-purple-900"><X size={12} /></button>
              </span>
            )}
            {statusFilter !== "All Status" && (
              <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md flex items-center gap-1">
                {statusFilter}
                <button onClick={() => setStatusFilter("All Status")} className="hover:text-orange-900"><X size={12} /></button>
              </span>
            )}
          </div>
        )}
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredBusinesses.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {hasActiveFilters ? "No businesses found matching your filters" : "No businesses yet"}
                    </p>
                    {hasActiveFilters ? (
                      <div className="flex flex-col items-center gap-3">
                        <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
                        <button onClick={clearFilters} className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center gap-2">
                          <X size={16} /> Clear All Filters
                        </button>
                      </div>
                    ) : (
                      <>
                        <p className="text-sm text-gray-500 mb-4">Get started by adding your first business</p>
                        <button onClick={() => SetModal(true)} className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
                          <span className="text-xl">+</span> Add Your First Business
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredBusinesses.map((business, index) => (
                <tr key={business.Business_id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 bg-gradient-to-r ${getGradientClass(index)} rounded-lg flex items-center justify-center text-white font-bold`}>
                        {business.business_name?.charAt(0)?.toUpperCase() || 'B'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{business.business_name}</div>
                        <div className="text-sm text-gray-500">ID: {business.Business_id}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900">
                      <Tag size={14} className="mr-2 text-gray-400" />
                      {business.Business_type || '-'}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{business.Business_Address || '-'}</div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {business.date_established ? new Date(business.date_established).getFullYear() : '-'}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(business.status)}`}>
                      {business.status || 'N/A'}
                    </span>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {/* ✅ Updated - now calls handleViewDetails */}
                    <button
                      onClick={() => handleViewDetails(business)}
                      className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                      title="View Details"
                    >
                      <EyeIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Add Business Modal */}
      {FormModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={handleCloseModal}>
          <div className="relative w-full max-w-6xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <button onClick={handleCloseModal} className="absolute top-4 right-4 z-[60] w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-lg transition-colors" title="Close">
              <X size={24} />
            </button>
            <ResponsiveForm onSuccess={handleBusinessCreated} onClose={handleCloseModal} />
          </div>
        </div>
      )}

      {/* ✅ NEW: View Business Details Modal */}
      {showViewModal && selectedBusiness && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 bg-gradient-to-r ${getGradientClass(0)} rounded-xl flex items-center justify-center text-white font-bold text-lg`}>
                  {selectedBusiness.business_name?.charAt(0)?.toUpperCase() || 'B'}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{selectedBusiness.business_name}</h2>
                  <p className="text-sm text-green-600 font-medium">{selectedBusiness.Business_type}</p>
                </div>
              </div>
              <button onClick={handleCloseViewModal} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <X size={20} className="text-gray-500" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500 font-medium">Status:</span>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusClass(selectedBusiness.status)}`}>
                  {selectedBusiness.status || 'N/A'}
                </span>
              </div>

              {/* Business Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
                    <Building2 size={16} className="text-green-600" />
                    Business Information
                  </h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <p className="text-gray-500">Business ID</p>
                      <p className="font-medium text-gray-900">{selectedBusiness.Business_id || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Business Type</p>
                      <p className="font-medium text-gray-900">{selectedBusiness.Business_type || '-'}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Operating Since</p>
                      <p className="font-medium text-gray-900">
                        {selectedBusiness.date_established 
                          ? new Date(selectedBusiness.date_established).getFullYear() 
                          : '-'}
                      </p>
                    </div>
                  </div>
                </div>

            <div className="bg-gray-50 rounded-xl p-4">
  <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
    <MapPin size={16} className="text-green-600" />
    Location & Contact
  </h3>
  <div className="space-y-3 text-sm">
    <div>
      <p className="text-gray-500">Business Address</p>
      <p className="font-medium text-gray-900">{selectedBusiness.Business_Address || '-'}</p>
    </div>
    <div>
      <p className="text-gray-500">Business Phone</p>
      <p className="font-medium text-gray-900">{selectedBusiness.business_phone || '-'}</p>
    </div>
    <div>
      <p className="text-gray-500">Business Email</p>
      <p className="font-medium text-gray-900">{selectedBusiness.business_email || '-'}</p>
    </div>
  </div>
</div>

              </div>

              {/* Description */}
              {selectedBusiness.description && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-sm font-bold text-gray-700 mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{selectedBusiness.description}</p>
                </div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-200">
              <button
                onClick={handleCloseViewModal}
                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-bold hover:bg-gray-300 transition"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Pagination */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{((currentPage - 1) * 5) + 1}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * 5, totalBusinesses)}</span> of{' '}
            <span className="font-semibold">{totalBusinesses}</span> businesses
            {hasActiveFilters && <span className="text-orange-600 ml-2">(filtered)</span>}
          </div>

          <div className="flex items-center gap-2">
            <button onClick={goToPreviousPage} disabled={currentPage === 1} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              <ChevronLeftIcon className="h-4 w-4" /> Previous
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (pageNumber === 1 || pageNumber === totalPages || (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)) {
                  return (
                    <button key={pageNumber} onClick={() => goToPage(pageNumber)} className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentPage === pageNumber ? 'bg-green-800 text-white' : 'border border-gray-300 hover:bg-gray-50 text-gray-700'}`}>
                      {pageNumber}
                    </button>
                  );
                } else if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                  return <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                }
                return null;
              })}
            </div>

            <button onClick={goToNextPage} disabled={currentPage === totalPages} className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1">
              Next <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}