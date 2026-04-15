import { useState } from 'react';

const OwnersDetail = ({ business, onClose }) => {
  if (!business) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-full max-w-4xl p-6 relative max-h-[90vh] overflow-y-auto">
        
        <button
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 z-10 text-xl"
          onClick={onClose}
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex items-center gap-4 mb-6 pb-4 border-b border-gray-200">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-green-700 flex items-center justify-center text-white font-bold text-2xl">
            {business.ownerName?.charAt(0)?.toUpperCase() || 'O'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{business.ownerName || 'N/A'}</h2>
            <p className="text-sm text-gray-500">{business.ownerEmail || 'N/A'}</p>
            <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-semibold ${
              business.status?.toLowerCase() === 'active'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {business.status || 'N/A'}
            </span>
          </div>
        </div>

        {/* Owner Information */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b">
            Owner Information
          </h3>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Owner Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerName || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Gender</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerGender || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Age</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerAge ?? 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Date of Birth</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerBirthday || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Contact #</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerContactNumber || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Alternate Contact #</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerAlternateContact || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Emergency Contact</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerEmergencyContact || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Emergency Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerEmergencyContactName || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {/* Address */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b">
            Address
          </h3>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Address Line 1</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerAddress1 || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Address Line 2</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerAddress2 || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">City</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerCity || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Province</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerProvince || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Postal Code</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerPostalCode || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Country</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.ownerCountry || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {/* Business Info */}
        <div className="mb-5">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b">
            Business Information
          </h3>
          <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Business Name</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.name || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Business Type</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.businessType || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Address</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.address || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Operating Since</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.date || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Business Email</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.email || 'N/A'}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold text-gray-500 uppercase">Business Phone</dt>
              <dd className="mt-1 text-sm text-gray-900">{business.phone || 'N/A'}</dd>
            </div>
          </dl>
        </div>

        {/* Products */}
        {business.products && business.products.length > 0 && (
          <div className="mb-5">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3 pb-1 border-b">
              Products & Services ({business.products.length})
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {business.products.map((product, idx) => (
                <div key={idx} className="bg-gray-50 border border-gray-200 rounded-lg p-3">
                  <p className="text-sm font-semibold text-gray-800">{product.name}</p>
                  {product.description && (
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={onClose}
          className="w-full mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2.5 rounded-xl transition"
        >
          Close
        </button>

      </div>
    </div>
  );
};

export default OwnersDetail;