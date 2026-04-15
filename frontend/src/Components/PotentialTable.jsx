import { EyeIcon, EnvelopeIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { MagnifyingGlassIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { MessageSquare, X, Phone, Mail, Calendar, User, Building2 } from 'lucide-react';

const TABLE_HEAD = ["Marketer", "Business", "Message", "Date", "Status", "Actions"];

export default function InterestMessagesTable() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, unread: 0, read: 0, replied: 0 });
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalMessages, setTotalMessages] = useState(0);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  // Modal states
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case 'sent':
        return 'bg-blue-100 text-blue-800';
      case 'read':
        return 'bg-green-100 text-green-800';
      case 'replied':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getGradientClass = (index) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-orange-500 to-orange-600',
    ];
    return gradients[index % gradients.length];
  };

  // Fetch messages function with pagination
  const fetchMessages = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await axios.get(
        `http://localhost:5000/api/interest/owner/messages?page=${page}&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      console.log('✅ Fetched messages:', response.data);
      setMessages(response.data.messages);
      setCurrentPage(response.data.pagination.currentPage);
      setTotalPages(response.data.pagination.totalPages);
      setTotalMessages(response.data.pagination.totalMessages);
      setLoading(false);
    } catch (err) {
      console.error('❌ Error fetching messages:', err);
      setError('Failed to load interest messages');
      setLoading(false);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    try {
      const response = await axios.get(
        'http://localhost:5000/api/interest/owner/stats',
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      setStats(response.data.stats);
    } catch (err) {
      console.error('❌ Error fetching stats:', err);
    }
  };

  // Mark as read
  const markAsRead = async (messageId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/interest/owner/messages/${messageId}/read`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        }
      );
      
      // Refresh messages
      fetchMessages(currentPage);
      fetchStats();
    } catch (err) {
      console.error('❌ Error marking message as read:', err);
    }
  };

  // View message details
  const viewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
    
    // Mark as read if it's unread
    if (message.status === 'sent') {
      markAsRead(message.id);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchMessages(currentPage);
    fetchStats();
  }, [currentPage]);

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Filter function (client-side filtering of current page)
  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const matchesSearch = 
        msg.marketer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.marketer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.business_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        msg.message?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchQuery, statusFilter]);

  const hasActiveFilters = searchQuery !== "" || statusFilter !== "all";

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading messages...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 mb-4">{error}</div>
        <button 
          onClick={() => fetchMessages(currentPage)}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
      {/* Header with Stats */}
      <div className="p-6 border-b border-gray-200">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900">Messages Details</h2>
          <p className="mt-1 text-sm text-gray-600">
            Manage inquiries from potential marketers
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-green-600 rounded-lg p-4 text-white">
            <div className="text-2xl font-bold">{stats.total || 0}</div>
            <div className="text-sm opacity-90">Total Messages</div>
          </div>
       
         
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="flex-1">
            <div className="rex lative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by marketer name, email, or message..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="sent">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>

          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <X size={16} />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredMessages.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center">
                  <div className="flex flex-col items-center justify-center py-8">
                    <MessageSquare size={48} className="text-gray-300 mb-4" />
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      {hasActiveFilters
                        ? "No messages found matching your filters" 
                        : "No interest messages yet"}
                    </p>
                    {hasActiveFilters ? (
                      <button
                        onClick={clearFilters}
                        className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                      >
                        <X size={16} />
                        Clear Filters
                      </button>
                    ) : (
                      <p className="text-sm text-gray-500">
                        Interest messages will appear here when marketers express interest
                      </p>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              filteredMessages.map((msg, index) => (
                <tr 
                  key={msg.id} 
                  className={`hover:bg-gray-50 transition-colors ${msg.status === 'sent' ? 'bg-blue-50/30' : ''}`}
                >
                  {/* Marketer */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 bg-gradient-to-r ${getGradientClass(index)} rounded-lg flex items-center justify-center text-white font-bold`}>
                        {msg.marketer_name?.charAt(0)?.toUpperCase() || 'M'}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {msg.marketer_name}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1">
                          <Mail size={12} />
                          {msg.marketer_email}
                        </div>
                      </div>
                    </div>
                  </td>

                  {/* Business */}
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {msg.actual_business_name || msg.business_name}
                    </div>
                  </td>

                  {/* Message Preview */}
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 max-w-xs truncate">
                      {msg.message}
                    </div>
                  </td>

                  {/* Date */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{msg.date_only}</div>
                    <div className="text-xs text-gray-500">{msg.formatted_date}</div>
                  </td>

                  {/* Status */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(msg.status)}`}>
                      {msg.status === 'sent' && '● Unread'}
                      {msg.status === 'read' && '✓ Read'}
                      {msg.status === 'replied' && '✉ Replied'}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => viewMessage(msg)}
                      className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
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

      {/* Pagination Footer */}
      <div className="px-6 py-4 border-t border-gray-200">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Info */}
          <div className="text-sm text-gray-600">
            Showing <span className="font-semibold">{((currentPage - 1) * 10) + 1}</span> to{' '}
            <span className="font-semibold">{Math.min(currentPage * 10, totalMessages)}</span> of{' '}
            <span className="font-semibold">{totalMessages}</span> messages
          </div>

          {/* Pagination Controls */}
          <div className="flex items-center gap-2">
            <button 
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              Previous
            </button>

            <div className="flex gap-1">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                if (
                  pageNumber === 1 ||
                  pageNumber === totalPages ||
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => goToPage(pageNumber)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        currentPage === pageNumber
                          ? 'bg-green-800 text-white'
                          : 'border border-gray-300 hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                } else if (
                  pageNumber === currentPage - 2 ||
                  pageNumber === currentPage + 2
                ) {
                  return <span key={pageNumber} className="px-2 py-2 text-gray-500">...</span>;
                }
                return null;
              })}
            </div>

            <button 
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
            >
              Next
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Detail Modal */}
      {showMessageModal && selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
            <button 
              onClick={() => setShowMessageModal(false)}
              className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100 transition"
            >
              <X className="w-6 h-6 text-gray-600" />
            </button>

            <div className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Message Details</h2>
             
              </div>

              {/* Marketer Info */}
              <div className="bg-green-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Potential Buyer Information
                </h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Name</p>
                    <p className="text-gray-900 font-semibold">{selectedMessage.marketer_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Email</p>
                    <p className="text-gray-900">{selectedMessage.marketer_email}</p>
                  </div>
                  {selectedMessage.marketer_phone && (
                    <div>
                      <p className="text-gray-500 font-medium">Phone</p>
                      <p className="text-gray-900">{selectedMessage.marketer_phone}</p>
                    </div>
                  )}
                  {selectedMessage.marketer_address && (
                    <div>
                      <p className="text-gray-500 font-medium">Address</p>
                      <p className="text-gray-900">{selectedMessage.marketer_address}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Business Info */}
              <div className="bg-gray-50 rounded-xl p-6 mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
                  <Building2 className="w-5 h-5 mr-2 text-gray-600" />
                  Business
                </h3>
                <p className="text-gray-900 font-semibold">{selectedMessage.actual_business_name || selectedMessage.business_name}</p>
              </div>

              {/* Message */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2 text-gray-600" />
                  Message
                </h3>
                <div className="bg-gray-100 rounded-lg p-4">
                  <p className="text-gray-900 whitespace-pre-line">{selectedMessage.message}</p>
                </div>
              </div>

              {/* Date */}
              <div className="text-sm text-gray-500 flex items-center gap-2 mb-6">
                <Calendar size={14} />
                Sent on {selectedMessage.formatted_date}
              </div>

    {/* Actions */}
<div className="flex gap-3">
  
  
  <button 
    onClick={() => setShowMessageModal(false)}
    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-bold hover:bg-gray-300 transition"
  >
    Close
  </button>
</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}