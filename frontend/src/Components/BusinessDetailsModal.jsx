import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BusinessDetailsModal = ({ business, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!business) return null;

  const nextImage = () => {
    if (business.images && business.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === business.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const prevImage = () => {
    if (business.images && business.images.length > 0) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? business.images.length - 1 : prev - 1
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">
          {business.name}
        </h2>

        {/* Image Carousel */}
        <div className="mb-6">
          <dt className="text-sm font-medium text-gray-900 mb-2">Business Images:</dt>
          {business.images && business.images.length > 0 ? (
            <div className="relative">
              {/* Main Image */}
              <img
                src={`http://localhost:5000/${business.images[currentImageIndex].path}`}
                alt={`${business.name} - Image ${currentImageIndex + 1}`}
                className="w-full h-64 object-cover rounded-lg"
              />
              
              {/* Navigation Arrows */}
              {business.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Image Counter */}
              <div className="absolute bottom-2 right-2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
                {currentImageIndex + 1} / {business.images.length}
              </div>

              {/* Thumbnail Strip */}
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {business.images.map((img, index) => (
                  <img
                    key={img.id}
                    src={`http://localhost:5000/${img.path}`}
                    alt={`Thumbnail ${index + 1}`}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 object-cover rounded cursor-pointer border-2 flex-shrink-0 ${
                      index === currentImageIndex 
                        ? 'border-blue-500' 
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 h-64 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>

        {/* Business Information */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-10 gap-y-6">

          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase">Owner Name.</dt>
            <dd className="mt-1 text-sm text-gray-900">{business.ownerName}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase">Operating Since</dt>
            <dd className="mt-1 text-sm text-gray-900">{business.date}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase">Business Email</dt>
            <dd className="mt-1 text-sm text-gray-900">{business.email}</dd>
          </div>

          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase">Industry.</dt>
            <dd className="mt-1 text-sm text-gray-900">{business.industry}</dd>
          </div>

        

          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase">Registration No.</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {business.registrationNumber}
            </dd>
          </div>

          <div>
            <dt className="text-xs font-semibold text-gray-500 uppercase">TIN Number.</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {business.tinNumber}
            </dd>
          </div>

            {/* PRODUCTS - Display from products table */}
          <div className="lg:col-span-4 sm:col-span-2">
            <dt className="text-xs font-semibold text-gray-500 uppercase">Products.</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {business.products && business.products.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {business.products.map((product) => (
                    <div 
                      key={product.product_id} 
                      className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                    >
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      {product.category && (
                        <p className="text-xs text-gray-500 mt-1">
                          Category: {product.category}
                        </p>
                      )}
                      {product.description && (
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                          {product.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <span className="text-gray-500 italic">No products listed</span>
              )}
            </dd>
          </div>


          {/* DESCRIPTION – FULL WIDTH */}
          <div className="lg:col-span-4 sm:col-span-2">
            <dt className="text-xs font-semibold text-gray-500 uppercase">Description.</dt>
            <dd className="mt-1 text-sm text-gray-900 leading-relaxed">
              {business.description}
            </dd>
          </div>

        </dl>

      </div>
    </div>
  );
};

export default BusinessDetailsModal;