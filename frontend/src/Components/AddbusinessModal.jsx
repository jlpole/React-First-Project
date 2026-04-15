import React, { useState } from 'react';
import { X, Upload, Building2, User, Mail, Phone, MapPin, Calendar, FileText, Users, Package, Plus, Trash2, ImagePlus } from 'lucide-react';
import axios from 'axios';

export default function AddBusinessModal({ onClose, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [currentStep, setCurrentStep] = useState(1); // Multi-step form
  
  const [formData, setFormData] = useState({
    // Business Information
    business_name: '',
    business_email: '',
    business_phone: '',
    description: '',
    category: '',
    industry: '',
    business_address: '',
    tin_number: '',
    registration_number: '',
    date_established: '',
    image: null,
    
    // Owner Information
    ownerName: '',
    ownerEmail: '',
    ownerContactNumber: '',
    ownerGender: '',
    ownerDateOfBirth: '',
    ownerAge: '',
    ownerAddressLine1: '',
    ownerAddressLine2: '',
    ownerCity: '',
    ownerStateProvince: '',
    ownerPostalCode: '',
    ownerCountry: 'Philippines',
    ownerAlternateContact: '',
    ownerEmergencyContact: '',
    ownerEmergencyContactName: '',
    ownerComment: '',
    ownerImage: null
  });

  // Products state
  const [products, setProducts] = useState([]);
  const [errors, setErrors] = useState({});

  const categories = [
    'Retail', 'Food & Beverage', 'Technology', 'Healthcare', 'Education',
    'Construction', 'Manufacturing', 'Services', 'Agriculture', 'Transportation',
    'Real Estate', 'Entertainment', 'Other'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Auto-calculate age when DOB changes
    if (name === 'ownerDateOfBirth' && value) {
      const age = calculateAge(value);
      setFormData(prev => ({
        ...prev,
        ownerAge: age
      }));
    }
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const calculateAge = (dateString) => {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          image: 'Image size should be less than 5MB'
        }));
        return;
      }

      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          image: 'Please upload a valid image file'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        image: file
      }));

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);

      if (errors.image) {
        setErrors(prev => ({
          ...prev,
          image: ''
        }));
      }
    }
  };

  const handleOwnerImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          ownerImage: 'Image size should be less than 5MB'
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        ownerImage: file
      }));
    }
  };

  // Product Management
  const addProduct = () => {
    setProducts([...products, {
      id: Date.now(),
      name: '',
      description: '',
      images: []
    }]);
  };

  const removeProduct = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
  };

  const updateProduct = (productId, field, value) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, [field]: value } : p
    ));
  };

  const handleProductImageChange = (productId, files) => {
    const fileArray = Array.from(files);
    
    // Validate files
    const validFiles = fileArray.filter(file => {
      if (file.size > 5 * 1024 * 1024) {
        alert('Each image should be less than 5MB');
        return false;
      }
      if (!file.type.startsWith('image/')) {
        alert('Please upload valid image files');
        return false;
      }
      return true;
    });

    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, images: [...p.images, ...validFiles] }
        : p
    ));
  };

  const removeProductImage = (productId, imageIndex) => {
    setProducts(products.map(p => 
      p.id === productId 
        ? { ...p, images: p.images.filter((_, index) => index !== imageIndex) }
        : p
    ));
  };

  const validateForm = () => {
    const newErrors = {};

    // Business validation
    if (!formData.business_name.trim()) {
      newErrors.business_name = 'Business name is required';
    }

    if (!formData.business_email.trim()) {
      newErrors.business_email = 'Business email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.business_email)) {
      newErrors.business_email = 'Invalid email format';
    }

    if (!formData.business_phone.trim()) {
      newErrors.business_phone = 'Business phone is required';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.business_address.trim()) {
      newErrors.business_address = 'Business address is required';
    }

    if (!formData.date_established) {
      newErrors.date_established = 'Date established is required';
    }

    // Owner validation
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required';
    }

    if (formData.ownerEmail && !/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Invalid email format';
    }

    if (!formData.ownerAddressLine1.trim()) {
      newErrors.ownerAddressLine1 = 'Address is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      
      // Append business fields
      Object.keys(formData).forEach(key => {
        if (formData[key] !== null && formData[key] !== '' && key !== 'ownerImage') {
          submitData.append(key, formData[key]);
        }
      });

      // Append owner image if exists
      if (formData.ownerImage) {
        submitData.append('ownerImage', formData.ownerImage);
      }

      // Append products data
      submitData.append('products', JSON.stringify(products.map(p => ({
        name: p.name,
        description: p.description,
        imageCount: p.images.length
      }))));

      // Append product images
      products.forEach((product, productIndex) => {
        product.images.forEach((image, imageIndex) => {
          submitData.append(`product_${productIndex}_image_${imageIndex}`, image);
        });
      });

      const token = localStorage.getItem('token');
      
      const response = await axios.post(
        'http://localhost:5000/api/Business/Add',
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          }
        }
      );

      console.log('✅ Business added successfully:', response.data);
      
      if (onSuccess) {
        onSuccess(response.data);
      }
      
      onClose();
    } catch (error) {
      console.error('❌ Error adding business:', error);
      
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({
          submit: error.response?.data?.message || 'Failed to add business. Please try again.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = (e) => {
    e.preventDefault(); // ✅ PREVENT FORM SUBMISSION
    e.stopPropagation(); // ✅ STOP EVENT BUBBLING
    
    if (currentStep === 1) {
      // Validate business info before moving to step 2
      const businessErrors = {};
      if (!formData.business_name.trim()) businessErrors.business_name = 'Required';
      if (!formData.business_email.trim()) businessErrors.business_email = 'Required';
      if (!formData.business_phone.trim()) businessErrors.business_phone = 'Required';
      if (!formData.category) businessErrors.category = 'Required';
      
      if (Object.keys(businessErrors).length > 0) {
        setErrors(businessErrors);
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = (e) => {
    e.preventDefault(); // ✅ PREVENT FORM SUBMISSION
    e.stopPropagation(); // ✅ STOP EVENT BUBBLING
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center">
            <Building2 className="text-white mr-3" size={24} />
            <div>
              <h2 className="text-xl font-bold text-white">Add New Business</h2>
              <p className="text-green-100 text-sm">
                Step {currentStep} of 3: {
                  currentStep === 1 ? 'Business Information' :
                  currentStep === 2 ? 'Owner Information' :
                  'Products (Optional)'
                }
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-green-800 rounded-full p-1 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div 
            className="bg-green-600 h-2 transition-all duration-300"
            style={{ width: `${(currentStep / 3) * 100}%` }}
          />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="p-6 space-y-6">
            
            {/* Error Message */}
            {errors.submit && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {errors.submit}
              </div>
            )}

            {/* STEP 1: BUSINESS INFORMATION */}
            {currentStep === 1 && (
              <>
                {/* Business Image Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Business Logo/Image
                  </label>
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      {imagePreview ? (
                        <img
                          src={imagePreview}
                          alt="Preview"
                          className="w-24 h-24 rounded-lg object-cover border-2 border-gray-300"
                        />
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                          <Upload className="text-gray-400" size={32} />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="business-image"
                      />
                      <label
                        htmlFor="business-image"
                        className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                      >
                        <Upload size={16} className="mr-2" />
                        Choose Image
                      </label>
                      <p className="mt-2 text-xs text-gray-500">
                        PNG, JPG up to 5MB
                      </p>
                      {errors.image && (
                        <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Business Information */}
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="mr-2 text-green-600" size={20} />
                    Business Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Business Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="business_name"
                        value={formData.business_name}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.business_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter business name"
                      />
                      {errors.business_name && (
                        <p className="mt-1 text-sm text-red-600">{errors.business_name}</p>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.category ? 'border-red-500' : 'border-gray-300'
                        }`}
                      >
                        <option value="">Select category</option>
                        {categories.map(cat => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                      )}
                    </div>

                    {/* Business Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Email <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="business_email"
                          value={formData.business_email}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors.business_email ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="business@example.com"
                        />
                      </div>
                      {errors.business_email && (
                        <p className="mt-1 text-sm text-red-600">{errors.business_email}</p>
                      )}
                    </div>

                    {/* Business Phone */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Phone <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="business_phone"
                          value={formData.business_phone}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors.business_phone ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="+63 XXX XXX XXXX"
                        />
                      </div>
                      {errors.business_phone && (
                        <p className="mt-1 text-sm text-red-600">{errors.business_phone}</p>
                      )}
                    </div>

                    {/* Industry */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Industry
                      </label>
                      <input
                        type="text"
                        name="industry"
                        value={formData.industry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="e.g., Technology, Retail"
                      />
                    </div>

                    {/* Date Established */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Established <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="date"
                          name="date_established"
                          value={formData.date_established}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors.date_established ? 'border-red-500' : 'border-gray-300'
                          }`}
                        />
                      </div>
                      {errors.date_established && (
                        <p className="mt-1 text-sm text-red-600">{errors.date_established}</p>
                      )}
                    </div>

                    {/* TIN Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        TIN Number
                      </label>
                      <input
                        type="text"
                        name="tin_number"
                        value={formData.tin_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="XXX-XXX-XXX-XXX"
                      />
                    </div>

                    {/* Registration Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Registration Number
                      </label>
                      <input
                        type="text"
                        name="registration_number"
                        value={formData.registration_number}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Business registration number"
                      />
                    </div>

                    {/* Business Address - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Business Address <span className="text-red-500">*</span>
                      </label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 text-gray-400" size={18} />
                        <textarea
                          name="business_address"
                          value={formData.business_address}
                          onChange={handleChange}
                          rows="2"
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors.business_address ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="Enter complete business address"
                        />
                      </div>
                      {errors.business_address && (
                        <p className="mt-1 text-sm text-red-600">{errors.business_address}</p>
                      )}
                    </div>

                    {/* Description - Full Width */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                      </label>
                      <div className="relative">
                        <FileText className="absolute left-3 top-3 text-gray-400" size={18} />
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleChange}
                          rows="3"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="Describe your business..."
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: OWNER INFORMATION */}
            {currentStep === 2 && (
              <>
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="mr-2 text-green-600" size={20} />
                    Owner Information
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                    {/* Owner Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ownerName"
                        value={formData.ownerName}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.ownerName ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Enter owner name"
                      />
                      {errors.ownerName && (
                        <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>
                      )}
                    </div>

                    {/* Gender */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Gender
                      </label>
                      <select
                        name="ownerGender"
                        value={formData.ownerGender}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      >
                        <option value="">Select gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date of Birth
                      </label>
                      <input
                        type="date"
                        name="ownerDateOfBirth"
                        value={formData.ownerDateOfBirth}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      />
                    </div>

                    {/* Age (Auto-calculated) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Age
                      </label>
                      <input
                        type="number"
                        name="ownerAge"
                        value={formData.ownerAge}
                        readOnly
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                        placeholder="Auto-calculated"
                      />
                    </div>

                    {/* Owner Email */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="email"
                          name="ownerEmail"
                          value={formData.ownerEmail}
                          onChange={handleChange}
                          className={`w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                            errors.ownerEmail ? 'border-red-500' : 'border-gray-300'
                          }`}
                          placeholder="owner@example.com"
                        />
                      </div>
                      {errors.ownerEmail && (
                        <p className="mt-1 text-sm text-red-600">{errors.ownerEmail}</p>
                      )}
                    </div>

                    {/* Owner Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Contact Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="ownerContactNumber"
                          value={formData.ownerContactNumber}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="+63 XXX XXX XXXX"
                        />
                      </div>
                    </div>

                    {/* Alternate Contact */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Alternate Contact
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="ownerAlternateContact"
                          value={formData.ownerAlternateContact}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="+63 XXX XXX XXXX"
                        />
                      </div>
                    </div>

                    {/* Emergency Contact Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact Name
                      </label>
                      <input
                        type="text"
                        name="ownerEmergencyContactName"
                        value={formData.ownerEmergencyContactName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Emergency contact person"
                      />
                    </div>

                    {/* Emergency Contact Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Emergency Contact Number
                      </label>
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                        <input
                          type="tel"
                          name="ownerEmergencyContact"
                          value={formData.ownerEmergencyContact}
                          onChange={handleChange}
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                          placeholder="+63 XXX XXX XXXX"
                        />
                      </div>
                    </div>

                    {/* Address Line 1 */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 1 <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        name="ownerAddressLine1"
                        value={formData.ownerAddressLine1}
                        onChange={handleChange}
                        className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                          errors.ownerAddressLine1 ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Street address, P.O. box"
                      />
                      {errors.ownerAddressLine1 && (
                        <p className="mt-1 text-sm text-red-600">{errors.ownerAddressLine1}</p>
                      )}
                    </div>

                    {/* Address Line 2 */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Address Line 2
                      </label>
                      <input
                        type="text"
                        name="ownerAddressLine2"
                        value={formData.ownerAddressLine2}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                      />
                    </div>

                    {/* City */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        City
                      </label>
                      <input
                        type="text"
                        name="ownerCity"
                        value={formData.ownerCity}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="City"
                      />
                    </div>

                    {/* State/Province */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        name="ownerStateProvince"
                        value={formData.ownerStateProvince}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="State/Province"
                      />
                    </div>

                    {/* Postal Code */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code
                      </label>
                      <input
                        type="text"
                        name="ownerPostalCode"
                        value={formData.ownerPostalCode}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Postal/ZIP code"
                      />
                    </div>

                    {/* Country */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Country
                      </label>
                      <input
                        type="text"
                        name="ownerCountry"
                        value={formData.ownerCountry}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Country"
                      />
                    </div>

                    {/* Comment */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes/Comments
                      </label>
                      <textarea
                        name="ownerComment"
                        value={formData.ownerComment}
                        onChange={handleChange}
                        rows="3"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        placeholder="Any additional information..."
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STEP 3: PRODUCTS */}
            {currentStep === 3 && (
              <>
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                      <Package className="mr-2 text-green-600" size={20} />
                      Products (Optional)
                    </h3>
                    <button
                      type="button"
                      onClick={addProduct}
                      className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Plus size={18} className="mr-2" />
                      Add Product
                    </button>
                  </div>

                  {products.length === 0 ? (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Package className="mx-auto text-gray-400 mb-4" size={48} />
                      <p className="text-gray-500 mb-4">No products added yet</p>
                      <button
                        type="button"
                        onClick={addProduct}
                        className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <Plus size={18} className="mr-2" />
                        Add Your First Product
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.map((product, index) => (
                        <div key={product.id} className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="font-medium text-gray-900">Product {index + 1}</h4>
                            <button
                              type="button"
                              onClick={() => removeProduct(product.id)}
                              className="text-red-600 hover:text-red-800 p-1"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 gap-4">
                            {/* Product Name */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Product Name
                              </label>
                              <input
                                type="text"
                                value={product.name}
                                onChange={(e) => updateProduct(product.id, 'name', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Enter product name"
                              />
                            </div>

                            {/* Product Description */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Description
                              </label>
                              <textarea
                                value={product.description}
                                onChange={(e) => updateProduct(product.id, 'description', e.target.value)}
                                rows="2"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                                placeholder="Describe the product..."
                              />
                            </div>

                            {/* Product Images */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Product Images
                              </label>
                              
                              {/* Image Preview */}
                              {product.images.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-2">
                                  {product.images.map((image, imgIndex) => (
                                    <div key={imgIndex} className="relative">
                                      <img
                                        src={URL.createObjectURL(image)}
                                        alt={`Product ${index + 1} - Image ${imgIndex + 1}`}
                                        className="w-20 h-20 object-cover rounded-lg border"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => removeProductImage(product.id, imgIndex)}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                                      >
                                        <X size={12} />
                                      </button>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Upload Button */}
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handleProductImageChange(product.id, e.target.files)}
                                className="hidden"
                                id={`product-images-${product.id}`}
                              />
                              <label
                                htmlFor={`product-images-${product.id}`}
                                className="cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                              >
                                <ImagePlus size={16} className="mr-2" />
                                Add Images
                              </label>
                              <p className="mt-1 text-xs text-gray-500">
                                You can select multiple images (PNG, JPG up to 5MB each)
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Footer with Navigation */}
          <div className="bg-gray-50 px-6 py-4 flex items-center justify-between border-t">
            <div>
              {currentStep > 1 && (
                <button
                  type="button"
                  onClick={prevStep}
                  disabled={loading}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              
              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    'Add Business'
                  )}
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}