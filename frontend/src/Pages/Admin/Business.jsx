import React, { useState, useEffect, useMemo } from 'react';
import { Search, Filter, Plus, MoreVertical, Tag, Calendar, Users, TrendingUp, Edit, CalendarX, Briefcase, CheckCircle, XCircle, Clock, Eye, Image } from 'lucide-react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from '../../Components/Sidebar';
import TopbarBusiness from '../../Components/Businesstopbar';
import axios from 'axios';
import BusinessDetailsModal from '../../Components/BusinessDetailsModal';
import Pagination from '../../Components/Pagination';
import EmptyState from '../../Components/EmptyState';
import LoadingState from '../../Components/Loadingstate';
import PageHeader from '../../Components/Pageheader';
import SearchBar from '../../Components/Searchbar';
import FilterSelect from '../../Components/Filterselect';
import ActionButton from '../../Components/Actionbutton';
import StatCard from '../../Components/StatCard';
import BusinessEditModal from '../../Components/EditModal';
import AddBusinessModal from '../../Components/AddbusinessModal';

export default function BusinessPage() {
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [statistics, setStatistics] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    pendingReview: 0
  });

  useEffect(() => {
    fetchBusinesses();
  }, [currentPage]);

  const fetchBusinesses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/api/Business", {
        params: {
          page: currentPage,
          limit: 6
        }
      });

      setBusinesses(res.data.businesses);
      setTotalPages(res.data.totalPages);
      setTotalItems(res.data.totalItems);

      if (res.data.statistics) {
        setStatistics(res.data.statistics);
      }

      setError(null);
    } catch (error) {
      console.error("Error fetching business:", error);
      setError("Failed to load businesses. Make sure your server is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (business) => {
    setSelectedBusiness(business);
    setShowModal(true);
  };

  const HandeEditModals = (business) => {
    setSelectedBusiness(business);
    setShowEditModal(true);
  };

  const handleAddBusiness = () => {
    setShowAddModal(true);
  };

  const handleAddSuccess = (newBusiness) => {
    fetchBusinesses();
    toast.success('Business added successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });
  };

  const handleEditSave = () => {
    fetchBusinesses();
    setShowEditModal(false);
    toast.success('Business updated successfully!', {
      position: 'top-right',
      autoClose: 3000,
    });
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

  const getGradientClass = (color) => {
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600',
      gray: 'from-gray-400 to-gray-500',
      pink: 'from-pink-500 to-pink-600'
    };
    return gradients[color] || gradients.blue;
  };

  const filteredBusinesses = useMemo(() => {
    return businesses.filter(business => {
      const matchesSearch =
        business.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        business.category?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory =
        categoryFilter === 'All Categories' ||
        business.businessType === categoryFilter;

      const matchesStatus =
        statusFilter === 'All Status' ||
        business.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [businesses, searchQuery, categoryFilter, statusFilter]);

  const categories = ['All Categories', ...new Set(businesses.map(b => b.businessType).filter(Boolean))];
  const statuses = ['All Status', 'Active', 'Inactive', 'Pending Review'];

  return (
    <>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="light"
      />

      <div className="flex h-screen bg-gray-50">
        <Sidebar />

        <div className="flex-1 flex flex-col overflow-hidden">
          <TopbarBusiness />

          <div className="flex-1 overflow-auto p-4 md:p-6">
            <div className="min-h-full">

              <PageHeader
                title="Business Directory"
                description="Manage and view all your members business"
              />

              {/* Filters and Search */}
              <div className="mb-6 flex flex-col md:flex-row gap-4">
                <SearchBar
                  className="flex-1"
                  placeholder="Search businesses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FilterSelect
                  className="w-full md:w-48"
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  options={categories}
                />
                <FilterSelect
                  className="w-full md:w-48"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  options={statuses}
                />
                <ActionButton
                  icon={Plus}
                  label="Add Business"
                  variant="primary"
                  onClick={handleAddBusiness}
                />
              </div>

              {/* Stats Summary */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <StatCard label="Total Businesses" value={statistics.total} color="gray" icon={Briefcase} />
                <StatCard label="Active" value={statistics.active} color="green" icon={CheckCircle} />
                <StatCard label="Inactive" value={statistics.inactive} color="gray" icon={XCircle} />
                <StatCard label="Pending Review" value={statistics.pendingReview} color="yellow" icon={Clock} />
              </div>

              {loading && <LoadingState message="Loading businesses..." color="green" />}

              {error && !loading && (
                <EmptyState
                  variant="error"
                  message={error}
                  actionLabel="Retry"
                  onAction={() => window.location.reload()}
                />
              )}

              {!loading && !error && filteredBusinesses.length === 0 && businesses.length > 0 && (
                <EmptyState
                  icon={Filter}
                  variant="filtered"
                  message="No businesses found matching your filters"
                  actionLabel="Clear filters"
                  onAction={() => {
                    setSearchQuery('');
                    setCategoryFilter('All Categories');
                    setStatusFilter('All Status');
                  }}
                />
              )}

              {/* Business Table */}
              {!loading && !error && filteredBusinesses.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operating Since</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Business Status</th>
                          <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredBusinesses.map((business) => (
                          <tr key={business.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className={`w-10 h-10 bg-gradient-to-r ${getGradientClass(business.color)} rounded-lg flex items-center justify-center text-white font-bold`}>
                                  {business.name?.charAt(0)?.toUpperCase() || 'B'}
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{business.name}</div>
                                  <div className="text-sm text-gray-500">{business.id}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center text-sm text-gray-900">
                                <Tag size={14} className="mr-2 text-gray-400" />
                                {business.category}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm">
                                <div className="font-medium text-gray-900">{business.ownerName || 'No Owner'}</div>
                                {business.ownerContactNumber && (
                                  <div className="text-gray-500">{business.ownerContactNumber}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{business.ownerEmail || business.email || '-'}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{business.date}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(business.status)}`}>
                                {business.status}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <div className="flex items-center justify-end space-x-2">
                                <button
                                  onClick={() => handleViewDetails(business)}
                                  className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                                  title="View Details"
                                >
                                  <Eye size={18} />
                                </button>
                                <button
                                  onClick={() => HandeEditModals(business)}
                                  className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                                  title="Edit Business"
                                >
                                  <Edit size={18} />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Pagination */}
              {!loading && !error && filteredBusinesses.length > 0 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                  showingCount={filteredBusinesses.length}
                  totalCount={totalItems}
                  itemLabel="businesses"
                />
              )}

            </div>
          </div>
        </div>
      </div>

      {/* Business Details Modal */}
      {showModal && selectedBusiness && (
        <BusinessDetailsModal
          business={selectedBusiness}
          onClose={() => setShowModal(false)}
        />
      )}

      {/* Business Edit Modal */}
      {showEditModal && selectedBusiness && (
        <BusinessEditModal
          business={selectedBusiness}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}

      {/* Add Business Modal */}
      {showAddModal && (
        <AddBusinessModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
        />
      )}
    </>
  );
}