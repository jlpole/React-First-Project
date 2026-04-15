import { PencilIcon, EyeIcon } from "@heroicons/react/24/solid";
import {
  ArrowDownTrayIcon,
  MagnifyingGlassIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { useState, useMemo, useEffect } from "react";
import { X } from 'lucide-react';
import axios from 'axios';
import ProductDetailsModal from '../Components/Products';

const TABLE_HEAD = ["Products Name", "Description", "Actions"];

export default function Products() {
  // ✅ Add states for API data
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // ✅ Add state for modal
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const itemsPerPage = 5;

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case 'paid':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
      case 'inactive':
        return 'bg-red-100 text-red-800';
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

  // ✅ Handle opening modal
  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // ✅ Handle closing modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get('http://localhost:5000/api/Products', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      console.log('✅ Products fetched:', response.data);
      
      setProducts(response.data.products || response.data);
      setLoading(false);

    } catch (error) {
      console.error('❌ Error fetching products:', error);
      setError('Failed to load products');
      setLoading(false);
    }
  };

  // ✅ Fetch on component mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = 
        product.product_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        product.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [products, searchQuery, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, endIndex);

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

  const clearFilters = () => {
    setSearchQuery("");
    setStatusFilter("All Status");
  };

  const statuses = ['All Status', 'Paid', 'Pending', 'Cancelled', 'Active', 'Inactive'];
  const hasActiveFilters = searchQuery !== "" || statusFilter !== "All Status";

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="text-center p-8">
          <div className="text-red-500 mb-4">{error}</div>
          <button 
            onClick={fetchProducts}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {/* Header with Search and Filters */}
        <div className="p-6 border-b border-gray-200">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">Recent Products</h2>
            <p className="mt-1 text-sm text-gray-600">
              These are all details about your Products ({products.length} total)
            </p>
          </div>

          {/* Filters and Search */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
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

            <div className="w-full md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white"
              >
                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <X size={16} />
                Clear Filters
              </button>
            )}

            <button 
              onClick={fetchProducts}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 whitespace-nowrap"
            >
              <ArrowDownTrayIcon className="h-4 w-4" />
              Refresh
            </button>
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex items-center gap-2 text-sm">
              <span className="text-gray-600">Active filters:</span>
              {searchQuery && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-md flex items-center gap-1">
                  Search: "{searchQuery}"
                  <button onClick={() => setSearchQuery("")} className="hover:text-blue-900">
                    <X size={12} />
                  </button>
                </span>
              )}
              {statusFilter !== "All Status" && (
                <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-md flex items-center gap-1">
                  {statusFilter}
                  <button onClick={() => setStatusFilter("All Status")} className="hover:text-orange-900">
                    <X size={12} />
                  </button>
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
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center">
                    <div className="flex flex-col items-center justify-center py-8">
                      <p className="text-lg font-semibold text-gray-700 mb-2">
                        {hasActiveFilters
                          ? "No products found matching your filters" 
                          : "No products yet"}
                      </p>
                      {hasActiveFilters ? (
                        <div className="flex flex-col items-center gap-3">
                          <p className="text-sm text-gray-500">
                            Try adjusting your search or filters
                          </p>
                          <button
                            onClick={clearFilters}
                            className="px-6 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors flex items-center gap-2"
                          >
                            <X size={16} />
                            Clear All Filters
                          </button>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-4">
                          Get started by adding your first product
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                currentProducts.map((product, index) => (
                  <tr key={product.product_id} className="hover:bg-gray-50 transition-colors">
                    {/* Product Name with Icon */}
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 bg-gradient-to-r ${getGradientClass(index)} rounded-lg flex items-center justify-center text-white font-bold`}>
                          {product.product_name?.charAt(0)?.toUpperCase() || 'P'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {product.product_name || 'N/A'}
                          </div>
                          <div className="text-xs text-gray-500">
                            ID: {product.product_id}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Description */}
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {product.description || '-'}
                      </div>
                    </td>

             

                    {/* Actions */}
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-50 rounded transition-colors"
                          title="View Details"
                          onClick={() => handleViewProduct(product)}
                        >
                          <EyeIcon className="h-5 w-5" />
                        </button>
                        <button
                          className="text-green-600 hover:text-green-900 p-1 hover:bg-green-50 rounded transition-colors"
                          title="Edit"
                          onClick={() => console.log('Edit product:', product)}
                        >
                        
                        </button>
                      </div>
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
              Showing <span className="font-semibold">{startIndex + 1}</span> to{' '}
              <span className="font-semibold">{Math.min(endIndex, filteredProducts.length)}</span> of{' '}
              <span className="font-semibold">{filteredProducts.length}</span> products
              {hasActiveFilters && (
                <span className="text-orange-600 ml-2">(filtered)</span>
              )}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center gap-2">
              {/* Previous Button */}
              <button 
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
              >
                <ChevronLeftIcon className="h-4 w-4" />
                Previous
              </button>

              {/* Page Numbers */}
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

              {/* Next Button */}
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
      </div>

      {/* Product Details Modal */}
      {isModalOpen && (
        <ProductDetailsModal 
          product={selectedProduct} 
          onClose={handleCloseModal} 
        />
      )}
    </>
  );
}