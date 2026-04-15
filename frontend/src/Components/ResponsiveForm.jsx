import { useState } from 'react';
import axios from 'axios';

import toast from 'react-hot-toast'; 
export default function ResponsiveForm({ onSuccess, onClose }) {
  const [step, setStep] = useState(1);
  const [images, setImages] = useState([]);
  const [products, setProducts] = useState([{ name: '', description: '', images: [] }]);
  const [previewImage, setPreviewImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    phone: '',
    dateEstablished: '',  
     registrationNumber: '', 
    tinNumber: '',           
    businessType: '',
    industry: '',         
    businessDescription: '',
    address: '',
    city: '',
    country: '',
    state: '',
    zipcode: '',
    differentBilling: false
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const addProduct = () => {
    setProducts(prev => [...prev, { name: '', description: '', images: [] }]);
  };

  const removeProduct = (index) => {
    if (products.length > 1) {
      setProducts(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleProductChange = (index, field, value) => {
    const newProducts = [...products];
    newProducts[index][field] = value;
    setProducts(newProducts);
  };

  const handleProductImageChange = (productIndex, e) => {
    const files = Array.from(e.target.files);
    const newProducts = [...products];
    newProducts[productIndex].images = [...newProducts[productIndex].images, ...files];
    setProducts(newProducts);
  };

  const removeProductImage = (productIndex, imageIndex) => {
    const newProducts = [...products];
    newProducts[productIndex].images = newProducts[productIndex].images.filter((_, i) => i !== imageIndex);
    setProducts(newProducts);
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // ✅ Prevent double submission
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    const data = new FormData();

    data.append('businessName', formData.businessName);
    data.append('email', formData.email);
    data.append('phone', formData.phone);
    data.append('dateEstablished', formData.dateEstablished);
    data.append('registrationNumber', formData.registrationNumber); 
    data.append('tinNumber', formData.tinNumber);                   
    data.append('businessType', formData.businessType);
    data.append('industry', formData.industry);
    data.append('businessDescription', formData.businessDescription);
    data.append('address', formData.address);
    data.append('city', formData.city);
    data.append('state', formData.state);
    data.append('country', formData.country);
    data.append('zipcode', formData.zipcode);
    data.append('differentBilling', formData.differentBilling);
    
    data.append('productCount', products.length);
    
    products.forEach((product, index) => {
      data.append(`product_${index}_name`, product.name);
      data.append(`product_${index}_description`, product.description);
      
      product.images.forEach((image) => {
        data.append(`product_${index}_images`, image);
      });
    });
    
    images.forEach((image) => {
      data.append('business_images', image);
    });
    
   try {
  const response = await axios.post('http://localhost:5000/api/create', data, {
    headers: {
     Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  });
  
  console.log('✅ Response:', response.data);
  
 toast.success('Business created successfully! ', {
  duration: 5000,
  style: {
    background: '#10b981',
    color: '#fff',
    fontWeight: 'bold',
    padding: '16px',
    borderRadius: '8px',
  },
  iconTheme: {
    primary: '#fff',
    secondary: '#10b981',
  },
});
  
  if (onSuccess) {
    onSuccess();
  }
  
} catch (error) {
  console.error('❌ Error:', error);
  toast.error('Failed to create business. Please try again.');
  setIsSubmitting(false);
}
  };

  const isStep1Valid = formData.businessName && formData.email && formData.phone;
  const isStep2Valid = formData.businessType && formData.businessDescription && products.some(p => p.name.trim());

  return (
    <div className="mid-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 py-6 px-4">
      <div className="container max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-1">Add Your Business</h1>
          <p className="text-gray-600 text-sm">Quick and easy registration - just 3 simple steps!</p>
        </div>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-center gap-2">
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                1
              </div>
              <span className="ml-1 text-xs font-medium text-gray-700 hidden sm:inline">Basic Info</span>
            </div>
            
            <div className={`w-12 h-1 rounded transition-all ${
              step >= 2 ? 'bg-emerald-600' : 'bg-gray-200'
            }`} />
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                2
              </div>
              <span className="ml-1 text-xs font-medium text-gray-700 hidden sm:inline">Business Details</span>
            </div>
            
            <div className={`w-12 h-1 rounded transition-all ${
              step >= 3 ? 'bg-emerald-600' : 'bg-gray-200'
            }`} />
            
            <div className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                step >= 3 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
              <span className="ml-1 text-xs font-medium text-gray-700 hidden sm:inline">Location & Images</span>
            </div>
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <form onSubmit={handleSubmit}>
            
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4"> Basic Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label htmlFor="businessName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Name *
                    </label>
                    <input
                      type="text"
                      id="businessName"
                      name="businessName"
                      value={formData.businessName}
                      onChange={handleInputChange}
                      placeholder="Enter your business name"
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="business@example.com"
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+63 912 345 6789"
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="dateEstablished" className="block text-sm font-semibold text-gray-700 mb-2">
                      Date Established
                    </label>
                    <input
                      type="date"
                      id="dateEstablished"
                      name="dateEstablished"
                      value={formData.dateEstablished}
                      onChange={handleInputChange}
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>
                </div>

                        <div>
            <label htmlFor="registrationNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              Registration Number
            </label>
            <input
              type="text"
              id="registrationNumber"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleInputChange}
              placeholder="e.g., SEC-2024-12345"
              className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label htmlFor="tinNumber" className="block text-sm font-semibold text-gray-700 mb-2">
              TIN Number
            </label>
            <input
              type="text"
              id="tinNumber"
              name="tinNumber"
              value={formData.tinNumber}
              onChange={handleInputChange}
              placeholder="e.g., 123-456-789-000"
              className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
            />
          </div>




                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep1Valid}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Business Details */}
            {step === 2 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">🏢 Business Details</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="md:col-span-2">
                    <label htmlFor="businessType" className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Type *
                    </label>
                    <input
                      type="text"
                      id="businessType"
                      name="businessType"
                      value={formData.businessType}
                      onChange={handleInputChange}
                      placeholder="e.g., Restaurant, Retail Store, Salon"
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label htmlFor="industry" className="block text-sm font-semibold text-gray-700 mb-2">
                      Industry *
                    </label>
                    <select
                      id="industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleInputChange}
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                      required
                    >
                      <option value="">Select Industry</option>
                      <option value="Food & Beverage">Food & Beverage</option>
                      <option value="Retail">Retail</option>
                      <option value="Services">Services</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Technology">Technology</option>
                      <option value="Education">Education</option>
                      <option value="Manufacturing">Manufacturing</option>
                      <option value="Construction">Construction</option>
                      <option value="Transportation">Transportation</option>
                      <option value="Agriculture">Agriculture</option>
                      <option value="Real Estate">Real Estate</option>
                      <option value="Finance">Finance</option>
                      <option value="Entertainment">Entertainment</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="businessDescription" className="block text-sm font-semibold text-gray-700 mb-2">
                      Business Description *
                    </label>
                    <textarea
                      id="businessDescription"
                      name="businessDescription"
                      value={formData.businessDescription}
                      onChange={handleInputChange}
                      rows="3"
                      placeholder="Tell us about your business..."
                      className="w-full border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <div className="mb-2">
                      <label className="block text-sm font-semibold text-gray-700">
                        Products/Services * ({products.length} product{products.length > 1 ? 's' : ''})
                      </label>
                    </div>
                    
                    {/* Scrollable products container */}
                    <div className="max-h-96 overflow-y-auto pr-2 border border-gray-200 rounded-lg p-3 space-y-3">
                      {products.map((product, index) => (
                        <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                          <div className="flex gap-2 mb-2">
                            <div className="flex-1">
                              <label className="text-xs text-gray-600 font-medium mb-1 block">
                                Product/Service Name *
                              </label>
                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) => handleProductChange(index, 'name', e.target.value)}
                                placeholder={`e.g., Haircut, Pizza, T-Shirt`}
                                className="w-full h-9 border-2 border-gray-200 rounded-lg px-3 text-sm focus:border-emerald-500 focus:outline-none transition-colors"
                                required
                              />
                            </div>
                            {products.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeProduct(index)}
                                className="w-9 h-9 mt-5 flex items-center justify-center bg-red-100 hover:bg-red-200 text-red-600 rounded-lg transition-colors text-xl"
                                title="Remove product"
                              >
                                ×
                              </button>
                            )}
                          </div>

                          {/* Product Description */}
                          <div className="mb-2">
                            <label className="text-xs text-gray-600 font-medium mb-1 block">
                              Product Description
                            </label>
                            <textarea
                              value={product.description}
                              onChange={(e) => handleProductChange(index, 'description', e.target.value)}
                              placeholder="Describe this product or service..."
                              rows="2"
                              className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none transition-colors resize-none"
                            />
                          </div>

                          {/* Product Images Upload */}
                          <div>
                            <label className="text-xs text-gray-600 font-medium mb-1 block">
                              Product Images (Optional)
                            </label>
                            <div className="flex gap-2 items-start">
                              <div className="flex-1">
                                <input
                                  type="file"
                                  id={`product_images_${index}`}
                                  multiple
                                  accept="image/*"
                                  onChange={(e) => handleProductImageChange(index, e)}
                                  className="hidden"
                                />
                                <label
                                  htmlFor={`product_images_${index}`}
                                  className="flex items-center gap-2 cursor-pointer border-2 border-dashed border-gray-300 rounded-lg px-3 py-2 hover:border-emerald-400 hover:bg-emerald-50 transition-colors"
                                >
                                  <span className="text-lg">📷</span>
                                  <span className="text-xs text-gray-600">
                                    {product.images.length > 0 
                                      ? `${product.images.length} image${product.images.length > 1 ? 's' : ''} selected` 
                                      : 'Click to add images'}
                                  </span>
                                </label>
                              </div>
                            </div>

                            {/* Product Image Previews */}
                            {product.images.length > 0 && (
                              <div className="mt-2 overflow-x-auto">
                                <div className="flex gap-2 pb-2">
                                  {product.images.map((img, imgIndex) => (
                                    <div key={imgIndex} className="relative flex-shrink-0 group">
                                      <div 
                                        className="w-20 h-20 bg-white rounded border-2 border-gray-200 overflow-hidden cursor-pointer hover:border-emerald-500 transition-all"
                                        onClick={() => setPreviewImage({ file: img, index: imgIndex, productIndex: index, type: 'product' })}
                                      >
                                        <img
                                          src={URL.createObjectURL(img)}
                                          alt={`Product ${index + 1} - ${imgIndex + 1}`}
                                          className="w-full h-full object-cover"
                                        />
                                      </div>
                                      <button
                                        type="button"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeProductImage(index, imgIndex);
                                        }}
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-all"
                                        title="Remove image"
                                      >
                                        ×
                                      </button>
                                    </div>
                                  ))}
                                </div>
                                {product.images.length > 3 && (
                                  <p className="text-xs text-gray-500 italic">
                                    ← Scroll horizontally to see all images →
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      
                      {/* Add Product Button - INSIDE container at the bottom */}
                      <button
                        type="button"
                        onClick={addProduct}
                        className="w-full text-emerald-600 hover:text-emerald-700 text-sm font-semibold flex items-center justify-center gap-1 bg-emerald-50 hover:bg-emerald-100 py-3 rounded-lg border-2 border-dashed border-emerald-300 hover:border-emerald-400 transition-colors"
                      >
                        <span className="text-xl">+</span> Add Another Product
                      </button>
                    </div>
                    
                    {products.length >= 2 && (
                      <p className="text-xs text-gray-500 mt-1 italic flex items-center gap-1">
                        <span>↕️</span> Scroll up to see all products
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-between pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-all"
                  >
                    ← Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    disabled={!isStep2Valid}
                    className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105"
                  >
                    Next Step →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Location & Images */}
            {step === 3 && (
              <div className="animate-fadeIn">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">📍 Location & Photos</h2>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div className="col-span-2">
                    <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                      Street Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Main Street"
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Cagayan de Oro"
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="state" className="block text-sm font-semibold text-gray-700 mb-2">
                      Province
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      placeholder="Misamis Oriental"
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="country" className="block text-sm font-semibold text-gray-700 mb-2">
                      Country
                    </label>
                    <input
                      type="text"
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      placeholder="Philippines"
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div>
                    <label htmlFor="zipcode" className="block text-sm font-semibold text-gray-700 mb-2">
                      Zip Code
                    </label>
                    <input
                      type="text"
                      id="zipcode"
                      name="zipcode"
                      value={formData.zipcode}
                      onChange={handleInputChange}
                      placeholder="9000"
                      className="w-full h-10 border-2 border-gray-200 rounded-lg px-4 focus:border-emerald-500 focus:outline-none transition-colors"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      📸 Business Photos (Multiple Images Supported)
                    </label>
                    
                    {/* Upload Button */}
                    <div className="border-2 border-dashed border-emerald-300 rounded-lg p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-emerald-50">
                      <input
                        type="file"
                        id="business_images"
                        multiple
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                      <label htmlFor="business_images" className="cursor-pointer">
                        <div className="flex flex-col items-center justify-center gap-2">
                          <span className="text-3xl">📷</span>
                          <div>
                            <p className="text-emerald-700 font-semibold text-sm">Click to upload multiple images</p>
                            <p className="text-gray-500 text-xs mt-1">You can select multiple photos at once</p>
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Image Previews */}
                    {images.length > 0 && (
                      <div className="mt-3">
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-semibold text-gray-700">
                            📸 Selected Images ({images.length})
                          </p>
                          <button
                            type="button"
                            onClick={() => setImages([])}
                            className="text-xs text-red-600 hover:text-red-700 font-semibold"
                          >
                            🗑️ Remove All
                          </button>
                        </div>
                        {/* Horizontal Scrollable Container */}
                        <div className="overflow-x-auto pb-2 border-2 border-gray-200 rounded-lg p-2 bg-gray-50">
                          <div className="flex gap-3">
                            {images.map((image, index) => (
                              <div key={index} className="relative flex-shrink-0 group">
                                <div 
                                  className="w-28 h-28 bg-white rounded-lg overflow-hidden border-2 border-gray-300 shadow-sm cursor-pointer hover:border-emerald-500 transition-all"
                                  onClick={() => setPreviewImage({ file: image, index, type: 'business' })}
                                >
                                  <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    removeImage(index);
                                  }}
                                  className="absolute -top-2 -right-2 w-7 h-7 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-lg transition-all opacity-0 group-hover:opacity-100"
                                  title="Remove this image"
                                >
                                  ×
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 truncate">
                                  {image.name}
                                </div>
                                <div className="absolute top-1 left-1 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-semibold">
                                  #{index + 1}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                        {images.length > 3 && (
                          <p className="text-xs text-gray-500 italic mt-2 flex items-center justify-center gap-1">
                            <span>←</span> Scroll horizontally to see all {images.length} images <span>→</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      id="differentBilling"
                      name="differentBilling"
                      checked={formData.differentBilling}
                      onChange={handleInputChange}
                      className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500"
                    />
                    <span className="ml-2 text-sm text-gray-700">
                      My billing address is different from the business address
                    </span>
                  </label>
                </div>

                <div className="flex justify-between">
                  <button
                    type="button"
                    onClick={prevStep}
                    disabled={isSubmitting}
                    className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 px-6 rounded-lg transition-all disabled:opacity-50"
                  >
                    ← Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-2 px-6 rounded-lg transition-all transform hover:scale-105 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="animate-spin">⏳</span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        ✓ Submit Business
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

          </form>
        </div>

      </div>

      {/* Image Preview Modal */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            {/* Close button */}
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center text-2xl font-bold shadow-lg z-10"
            >
              ×
            </button>
            
            {/* Image */}
            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <img
                src={URL.createObjectURL(previewImage.file)}
                alt="Preview"
                className="w-full h-auto max-h-[80vh] object-contain"
                onClick={(e) => e.stopPropagation()}
              />
              
              {/* Image Info */}
              <div className="p-4 bg-gray-50 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{previewImage.file.name}</p>
                    <p className="text-sm text-gray-600">
                      {previewImage.type === 'business' 
                        ? `Business Image #${previewImage.index + 1}` 
                        : `Product ${previewImage.productIndex + 1} - Image #${previewImage.index + 1}`}
                    </p>
                  </div>
                  <div className="text-sm text-gray-600">
                    {(previewImage.file.size / 1024).toFixed(2)} KB
                  </div>
                </div>
              </div>
            </div>
            
            <p className="text-white text-center mt-4 text-sm">
              Click anywhere outside to close
            </p>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}