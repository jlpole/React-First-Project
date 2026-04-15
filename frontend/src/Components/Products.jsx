import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';

const ProductDetailsModal = ({ product, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!product) return null;

  const getGradientClass = (name) => {
    const gradients = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-yellow-500 to-yellow-600',
    ];
    const index = (name?.charCodeAt(0) || 0) % gradients.length;
    return gradients[index];
  };

  // Image navigation functions
  const nextImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === product.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (product.images && product.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? product.images.length - 1 : prev - 1
      );
    }
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Helper to construct full image URL
  const getImageUrl = (imagePath) => {
    if (!imagePath) return 'https://via.placeholder.com/800x600?text=No+Image';
    
    // If path already starts with http, use as is
    if (imagePath.startsWith('http')) return imagePath;
    
    // Remove leading slashes if any
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    
    // Construct full URL
    return `http://localhost:5000/${cleanPath}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between z-10">
          <h2 className="text-2xl font-semibold text-gray-900">Product Details</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Product Header with Icon */}
          <div className="flex items-center mb-6">
            <div className={`w-20 h-20 bg-gradient-to-r ${getGradientClass(product.product_name)} rounded-lg flex items-center justify-center text-white font-bold text-3xl shadow-lg`}>
              {product.product_name?.charAt(0)?.toUpperCase() || 'P'}
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900">
                {product.product_name || 'N/A'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Product ID: {product.product_id}
              </p>
              {product.business_name && (
                <p className="text-sm text-gray-600 mt-1">
                  Business: <span className="font-medium">{product.business_name}</span>
                </p>
              )}
            </div>
          </div>

          {/* ✅ Product Images Carousel */}
          {product.images && product.images.length > 0 ? (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Images ({product.images.length})
              </label>
              
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                {/* Main Image Display */}
                <div className="relative aspect-video bg-gray-200">
                  <img
                    src={getImageUrl(product.images[currentImageIndex].image_path)}
                    alt={`${product.product_name} - Image ${currentImageIndex + 1}`}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      console.error('Failed to load image:', e.target.src);
                      e.target.src = 'https://via.placeholder.com/800x600?text=Image+Not+Available';
                    }}
                  />

                  {/* Navigation Arrows */}
                  {product.images.length > 1 && (
                    <>
                      <button
                        onClick={prevImage}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                      >
                        <ChevronLeft size={24} />
                      </button>
                      <button
                        onClick={nextImage}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-75 text-white p-2 rounded-full transition-all"
                      >
                        <ChevronRight size={24} />
                      </button>
                    </>
                  )}

                  {/* Image Counter */}
                  <div className="absolute bottom-4 right-4 bg-black bg-opacity-75 text-white px-3 py-1 rounded-full text-sm">
                    {currentImageIndex + 1} / {product.images.length}
                  </div>

                  {/* Primary Badge */}
                  {product.images[currentImageIndex].is_primary === 1 && (
                    <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold">
                      Primary Image
                    </div>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {product.images.length > 1 && (
                  <div className="p-3 bg-white border-t border-gray-200">
                    <div className="flex gap-2 overflow-x-auto">
                      {product.images.map((img, index) => (
                        <button
                          key={img.image_id || index}
                          onClick={() => goToImage(index)}
                          className={`relative flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden transition-all ${
                            index === currentImageIndex
                              ? 'border-blue-500 ring-2 ring-blue-200'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                        >
                          <img
                            src={getImageUrl(img.image_path)}
                            alt={`Thumbnail ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/80?text=No+Img';
                            }}
                          />
                          {img.is_primary === 1 && (
                            <div className="absolute top-0 right-0 bg-green-500 text-white text-xs px-1">
                              ★
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* No Images Placeholder */
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Product Images
              </label>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <div className="text-gray-400 mb-2">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-gray-500">No images available for this product</p>
              </div>
            </div>
          )}

          {/* Description */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-gray-900">
                {product.description || 'No description available'}
              </p>
            </div>
          </div>

          {/* Additional Information Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Category (if available) */}
            {product.category && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-900">{product.category}</p>
                </div>
              </div>
            )}

            {/* Price (if available) */}
            {product.price && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Price
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-900 font-semibold">
                    ₱{parseFloat(product.price).toLocaleString('en-PH', {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    })}
                  </p>
                </div>
              </div>
            )}

            {/* Stock/Quantity (if available) */}
            {product.quantity !== undefined && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stock Quantity
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-900">{product.quantity}</p>
                </div>
              </div>
            )}

            {/* Created Date (if available) */}
            {product.created_at && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Created Date
                </label>
                <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                  <p className="text-gray-900">
                    {new Date(product.created_at).toLocaleDateString('en-PH', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Business Information */}
          {(product.business_name || product.business_email || product.business_phone) && (
            <div className="border-t border-gray-200 pt-6">
              <h4 className="text-lg font-semibold text-gray-900 mb-4">
                Business Information
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.business_name && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Name
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900">{product.business_name}</p>
                    </div>
                  </div>
                )}
                {product.business_email && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Email
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900">{product.business_email}</p>
                    </div>
                  </div>
                )}
                {product.business_phone && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Phone
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900">{product.business_phone}</p>
                    </div>
                  </div>
                )}
                {product.Business_Address && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Address
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900">{product.Business_Address}</p>
                    </div>
                  </div>
                )}
                {product.Registration_number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900">{product.Registration_number}</p>
                    </div>
                  </div>
                )}
                {product.Tin_Number && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      TIN Number
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <p className="text-gray-900">{product.Tin_Number}</p>
                    </div>
                  </div>
                )}
                {product.business_status && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Business Status
                    </label>
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                      <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                        product.business_status?.toLowerCase() === 'active' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {product.business_status}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => console.log('Edit product:', product)}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
          >
            Edit Product
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsModal;