  import React, { useState, useRef, useEffect } from 'react';
  import axios from 'axios';
  import { motion, AnimatePresence } from 'framer-motion';
  import { 
    ArrowLeft,
    User,
    School,
    LogIn,
    Github,
    Twitter,
    Mail,
    Upload,
    Loader,
    Check,
    X,
    AlertTriangle,
    Sun,
    Moon
  } from 'lucide-react';
  import { toast } from 'react-hot-toast';

  const Signup = () => {
    const [step, setStep] = useState(0);
    const [role, setRole] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [profileImagePreview, setProfileImagePreview] = useState(null);
    const fileInputRef = useRef(null);
    const [theme, setTheme] = useState('dark'); // 'dark' or 'light'
    
    const [formData, setFormData] = useState({
      firstName: '', lastName: '', email: '', password: '', confirmPassword: '',
      mobile: '', dateOfBirth: '', gender: '', role: '',
      permanentAddress: { street: '', city: '', state: '', pincode: '', country: '' },
      currentAddress: { street: '', city: '', state: '', pincode: '', country: '' },
      rollNumber: '', admissionYear: '', group: '', employeeId: ''
    });
    
    const [validation, setValidation] = useState({
      email: null,
      password: null,
      confirmPassword: null
    });
    
    // Save theme preference to localStorage
    useEffect(() => {
      // Check if there's a saved preference
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setTheme(prefersDark ? 'dark' : 'light');
      }
    }, []);

    // Update localStorage when theme changes
    useEffect(() => {
      localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
      setTheme(theme === 'dark' ? 'light' : 'dark');
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      if (name.includes('.')) {
        const [parent, child] = name.split('.');
        setFormData({ ...formData, [parent]: { ...formData[parent], [child]: value } });
      } else {
        setFormData({ ...formData, [name]: value });
        
        // Simple validation
        if (name === 'email') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          setValidation({...validation, email: emailRegex.test(value)});
        } else if (name === 'password') {
          setValidation({...validation, password: value.length >= 6});
          // Update confirmPassword validation if confirmPassword exists
          if (formData.confirmPassword) {
            setValidation({
              ...validation, 
              password: value.length >= 6,
              confirmPassword: formData.confirmPassword === value
            });
          }
        } else if (name === 'confirmPassword') {
          setValidation({...validation, confirmPassword: value === formData.password});
        }
      }
    };

    const handleImageChange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      // Check file type
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif'];
      if (!validTypes.includes(file.type)) {
        toast.error('Please upload a valid image file (JPEG, PNG, GIF)');
        return;
      }
      
      // Check file size (limit to 5MB)
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (file.size > maxSize) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      
      setProfileImage(file);
      
      // Create a preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result);
      };
      reader.onerror = () => {
        toast.error('Error reading file');
      };
      reader.readAsDataURL(file);
    };

    const handleRoleSelect = (selectedRole) => {
      setRole(selectedRole);
      setFormData({ ...formData, role: selectedRole });
      setStep(1);
    };

    const nextStep = () => {
      setStep(prevStep => prevStep + 1);
    };
    
    const prevStep = () => setStep(step - 1);
    
    const handleSameAddressCheck = (e) => {
      if (e.target.checked) {
        setFormData({
          ...formData,
          currentAddress: { ...formData.permanentAddress }
        });
      } else {
        setFormData({
          ...formData,
          currentAddress: { street: '', city: '', state: '', pincode: '', country: '' }
        });
      }
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSubmitting(true);
      
      try {
        // Create a FormData object to handle the file upload
        const formDataToSend = new FormData();
        
        // Append all form fields
        Object.keys(formData).forEach(key => {
          if (typeof formData[key] === 'object' && formData[key] !== null && !(formData[key] instanceof File)) {
            // Handle nested objects (addresses)
            formDataToSend.append(key, JSON.stringify(formData[key]));
          } else {
            formDataToSend.append(key, formData[key]);
          }
        });
        
        // Append the file if it exists
        if (profileImage) {
          formDataToSend.append('profileImage', profileImage);
        }
        
        // Make API request to backend
        const response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/auth/signup`, 
          formDataToSend, 
          {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          }
        );
        
        const data = response.data;
        
        // Display success toast
        toast.success('Registration successful! Redirecting to login...');
        
        // Redirect to login after successful registration
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
        
      } catch (error) {
        // Display error toast
        toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    };

    const generateDots = () => {
      const dots = [];
      // Increased from 8 to 15 dots
      for (let i = 0; i < 15; i++) {
        const size = Math.random() * 60 + 20;
        const x = Math.random() * 40; // Concentrate dots on the left side (0-40% of width)
        const y = Math.random() * 100;
        dots.push(
          <div 
            key={i}
            className={`absolute rounded-full border-2 border-dashed ${theme === 'dark' ? 'border-slate-700/50' : 'border-gray-300/70'}`}
            style={{ width: `${size}px`, height: `${size}px`, left: `${x}%`, top: `${y}%` }}
          />
        );
      }
      return dots;
    };

    // Validation status indicator
    const ValidationIcon = ({ isValid }) => {
      if (isValid === null) return null;
      
      return isValid ? (
        <Check size={16} className="text-green-500" />
      ) : (
        <X size={16} className="text-red-500" />
      );
    };

    // Get theme-specific class names
    const getThemedClass = (darkClass, lightClass) => {
      return theme === 'dark' ? darkClass : lightClass;
    };

    // Render different steps based on current step with reduced vertical spacing
    const renderStep = () => {
      switch (step) {
        case 0:
          return (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center space-y-4 w-full"
            >
              <h2 className={`text-xl font-semibold ${getThemedClass('text-white', 'text-gray-800')} mb-4`}>Choose your role</h2>
              
              <div className="flex gap-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center p-4 ${getThemedClass('bg-slate-800/30 border-green-500/30 hover:border-green-500/50 hover:bg-slate-700/40', 'bg-gray-100 border-green-600/40 hover:border-green-600/70 hover:bg-gray-200')} rounded-lg border w-32 h-32 transition-all`}
                  onClick={() => handleRoleSelect('student')}
                >
                  <School className="text-green-500 mb-2" size={32} />
                  <span className={getThemedClass('text-white', 'text-gray-800')}>Student</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex flex-col items-center justify-center p-4 ${getThemedClass('bg-slate-800/30 border-green-500/30 hover:border-green-500/50 hover:bg-slate-700/40', 'bg-gray-100 border-green-600/40 hover:border-green-600/70 hover:bg-gray-200')} rounded-lg border w-32 h-32 transition-all`}
                  onClick={() => handleRoleSelect('teacher')}
                >
                  <User className="text-green-500 mb-2" size={32} />
                  <span className={getThemedClass('text-white', 'text-gray-800')}>Teacher</span>
                </motion.button>
              </div>
            </motion.div>
          );
        
        case 1:
          return (
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full"
            >
              <h2 className={`text-xl font-semibold ${getThemedClass('text-white', 'text-gray-800')} mb-4`}>Basic Information</h2>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-1">
                  <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                  />
                </div>
                
                <div className="col-span-1">
                  <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                  />
                </div>
                
                <div className="col-span-2 relative">
                  <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Email</label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-gray-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
                        validation.email === false ? 'border-red-500/70' : 
                        validation.email === true ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
                        getThemedClass('border-slate-700/30', 'border-gray-300')
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <ValidationIcon isValid={validation.email} />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 relative">
                  <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-gray-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
                        validation.password === false ? 'border-red-500/70' : 
                        validation.password === true ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
                        getThemedClass('border-slate-700/30', 'border-gray-300')
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <ValidationIcon isValid={validation.password} />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1 relative">
                  <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Confirm Password</label>
                  <div className="relative">
                    <input
                      type="password"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 text-white', 'bg-white text-gray-800')} border rounded-lg focus:outline-none focus:ring-1 pr-8 ${
                        validation.confirmPassword === false ? 'border-red-500/70' : 
                        validation.confirmPassword === true ? (theme === 'dark' ? 'border-green-500/70' : 'border-green-600/70') : 
                        getThemedClass('border-slate-700/30', 'border-gray-300')
                      }`}
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <ValidationIcon isValid={validation.confirmPassword} />
                    </div>
                  </div>
                </div>
                
                <div className="col-span-1">
                  <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Mobile</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                  />
                </div>
                
                <div className="col-span-1">
                  <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Date of Birth</label>
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                  />
                </div>
              </div>
              
              <div className="col-span-2 mt-3">
                <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Gender</label>
                <div className="flex space-x-4">
                  {['Male', 'Female', 'Other'].map((gender) => (
                    <div key={gender} className="flex items-center">
                      <input
                        type="radio"
                        id={gender.toLowerCase()}
                        name="gender"
                        value={gender.toLowerCase()}
                        checked={formData.gender === gender.toLowerCase()}
                        onChange={handleChange}
                        className="mr-2 accent-green-500"
                      />
                      <label htmlFor={gender.toLowerCase()} className={`${getThemedClass('text-gray-300', 'text-gray-600')} text-sm`}>
                        {gender}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex items-center px-3 py-1 ${getThemedClass('bg-slate-700/40 hover:bg-slate-700/60 text-white border-red-500/30 hover:border-red-500/50', 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-red-400/30 hover:border-red-400/50')} rounded-lg border transition-colors`}
                >
                  <ArrowLeft className="mr-1 text-red-500" size={12} /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className={`px-4 py-1 ${getThemedClass('bg-slate-700 hover:bg-slate-600 text-white border-green-500/30 hover:border-green-500/50', 'bg-green-600 hover:bg-green-700 text-white border-green-500/50')} rounded-lg border transition-colors`}
                >
                  Next
                </button>
              </div>
            </motion.div>
          );
        
        case 2:
          return (
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full"
            >
              <h2 className={`text-xl font-semibold ${getThemedClass('text-white', 'text-gray-800')} mb-3`}>Address Information</h2>
              
              <div className="mb-3">
                <h3 className={`text-md ${getThemedClass('text-slate-300', 'text-gray-600')} mb-2`}>Permanent Address</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Street</label>
                    <input
                      type="text"
                      name="permanentAddress.street"
                      value={formData.permanentAddress.street}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>City</label>
                    <input
                      type="text"
                      name="permanentAddress.city"
                      value={formData.permanentAddress.city}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>State</label>
                    <input
                      type="text"
                      name="permanentAddress.state"
                      value={formData.permanentAddress.state}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="mb-3 flex items-center">
                <input
                  type="checkbox"
                  id="sameAsPermAddress"
                  className="mr-2 accent-green-500"
                  onChange={handleSameAddressCheck}
                />
                <label htmlFor="sameAsPermAddress" className={`${getThemedClass('text-gray-300', 'text-gray-600')} text-sm`}>
                  Current address same as permanent address
                </label>
              </div>
              
              <div className="mb-3">
                <h3 className={`text-md ${getThemedClass('text-slate-300', 'text-gray-600')} mb-2`}>Current Address</h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-2">
                    <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Street</label>
                    <input
                      type="text"
                      name="currentAddress.street"
                      value={formData.currentAddress.street}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>City</label>
                    <input
                      type="text"
                      name="currentAddress.city"
                      value={formData.currentAddress.city}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>State</label>
                    <input
                      type="text"
                      name="currentAddress.state"
                      value={formData.currentAddress.state}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className={`flex items-center px-3 py-1 ${getThemedClass('bg-slate-700/40 hover:bg-slate-700/60 text-white border-red-500/30 hover:border-red-500/50', 'bg-gray-200 hover:bg-gray-300 text-gray-800 border-red-400/30 hover:border-red-400/50')} rounded-lg border transition-colors`}
                >
                  <ArrowLeft className="mr-1 text-red-500" size={12} /> Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className={`px-4 py-1 ${getThemedClass('bg-slate-700 hover:bg-slate-600 text-white border-green-500/30 hover:border-green-500/50', 'bg-green-600 hover:bg-green-700 text-white border-green-500/50')} rounded-lg border transition-colors`}
                >
                  Next
                </button>
              </div>
            </motion.div>
          );
        
        case 3:
          return (
            <motion.div 
              initial={{ opacity: 0, x: 100 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="w-full"
            >
              <h2 className={`text-xl font-semibold ${getThemedClass('text-white', 'text-gray-800')} mb-3`}>
                {role === 'student' ? 'Student Information' : 'Teacher Information'}
              </h2>
              
              {role === 'student' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div className="col-span-1">
                    <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Roll Number</label>
                    <input
                      type="text"
                      name="rollNumber"
                      value={formData.rollNumber}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                    />
                  </div>
                  
                  <div className="col-span-1">
                    <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Admission Year</label>
                    <input
                      type="number"
                      name="admissionYear"
                      value={formData.admissionYear}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  <div className="col-span-1">
                    <label className={`block ${getThemedClass('text-gray-300', 'text-gray-600')} mb-1 text-sm`}>Employee ID</label>
                    <input
                      type="text"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleChange}
                      className={`w-full p-2 ${getThemedClass('bg-slate-800/50 border-slate-700/30 text-white focus:ring-green-500/50', 'bg-white border-gray-300 text-gray-800 focus:ring-green-600/50')} border focus:border-green-500/50 rounded-lg focus:outline-none focus:ring-1`}
                    />
                  </div>
                </div>
              )}
              
              <div className="mt-4">
                <h3 className="text-md text-slate-300 mb-2">Profile Image</h3>
                <div className="flex flex-col items-center justify-center w-full">
                  {profileImagePreview ? (
                    <div className="relative mb-3">
                      <img 
                        src={profileImagePreview} 
                        alt="Profile preview" 
                        className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setProfileImage(null);
                          setProfileImagePreview(null);
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                        className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1"
                      >
                        <X size={12} className="text-white" />
                      </button>
                    </div>
                  ) : null}
                  
                  <label
                    htmlFor="profileImage"
                    className="flex flex-col items-center justify-center w-full h-20 border-2 border-dashed border-green-500/30 hover:border-green-500/50 rounded-lg cursor-pointer bg-slate-800/30 hover:bg-slate-800/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center py-2">
                      <Upload className="w-6 h-6 mb-1 text-green-400" />
                      <p className="text-xs text-slate-300">
                        {profileImage ? 'Change image' : 'Click to upload'}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        (JPG, PNG, GIF, max 5MB)
                      </p>
                    </div>
                    <input 
                      id="profileImage" 
                      type="file" 
                      className="hidden" 
                      accept="image/jpeg,image/png,image/gif" 
                      onChange={handleImageChange}
                      ref={fileInputRef}
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center px-3 py-1 bg-slate-700/40 hover:bg-slate-700/60 text-white rounded-lg border border-red-500/30 hover:border-red-500/50 transition-colors"
                  disabled={isSubmitting}
                >
                  <ArrowLeft className="mr-1 text-red-500" size={12} /> Back
                </button>
                <button
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className={`flex items-center px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-lg border border-green-500/30 hover:border-green-500/50 transition-colors ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="mr-2 animate-spin text-green-400" size={16} /> 
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="mr-2 text-green-400" size={16} />
                      Sign Up
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          );
        
        default:
          return null;
      }
    };

    // Enhanced progress indicator with colors
    const renderProgressBar = () => {
      const totalSteps = 4;
      const progress = (step / (totalSteps - 1)) * 100;
      
      return (
        <div className="w-full mb-4">
          <div className="relative h-1 bg-slate-800/50 rounded-full overflow-hidden">
            <div 
              className="absolute h-full bg-green-500 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div 
                key={index}
                className={`flex items-center justify-center h-5 w-5 text-xs rounded-full transition-colors ${
                  step > index ? 'bg-green-600 border border-green-400 text-white' : 
                  step === index ? 'bg-slate-600 border border-green-500 text-white' : 
                  'bg-slate-800/50 border border-slate-700 text-gray-400'
                }`}
              >
                {index + 1}
              </div>
            ))}
          </div>
        </div>
      );
    };


    return (
      <div className={`relative flex w-screen h-screen ${theme === 'dark' ? 'bg-slate-900' : 'bg-white'}`}>
        {/* Animated background elements - reduced */}
        <div className="absolute inset-0 overflow-hidden">
          {generateDots()}
        </div>
        
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-slate-900/20 to-slate-900/90" />
        
  <button
    onClick={toggleTheme}
    className="absolute top-4 right-4 p-2 rounded-full z-20 border transition-colors"
    style={{
      backgroundColor: theme === 'dark' ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
      borderColor: theme === 'dark' ? 'rgba(74, 222, 128, 0.3)' : 'rgba(22, 163, 74, 0.3)',
    }}
  >
    {theme === 'dark' ? (
      <Sun size={20} className="text-yellow-300" />
    ) : (
      <Moon size={20} className="text-slate-700" />
    )}
  </button>
        
        {/* Left side content */}
        <div className="relative w-3/10 p-6 flex flex-col justify-center z-10">
        <h1 className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : 'text-slate-800'} mb-2`}>Welcome to Platform</h1>
          <p className="text-gray-300 mb-4">Already have an account? <span className="text-green-400 cursor-pointer">Sign in</span></p>
          
          <div className="mt-4 space-y-2">
            <motion.button 
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-center w-full p-2 rounded-full bg-transparent border-2 border-green-500/30 text-white hover:bg-green-700/20 hover:border-green-500/50 transition-colors"
            >
              <Mail className="mr-2 text-green-400" size={16} /> Sign in with Email
            </motion.button>
            
            <div className="relative my-3">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-600"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="px-2 bg-slate-900 text-xs text-gray-400">or continue with</span>
              </div>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-center w-full p-2 rounded-full bg-transparent border-2 border-slate-700/50 text-white hover:bg-slate-700 transition-colors"
            >
              <Mail className="mr-2" size={16} /> Continue with Google
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-center w-full p-2 rounded-full bg-transparent border-2 border-red-500/30 text-white hover:bg-red-700/20 hover:border-red-500/50 transition-colors"
            >
              <Twitter className="mr-2 text-red-400" size={16} /> Continue with Twitter
            </motion.button>
            
            <motion.button 
              whileHover={{ scale: 1.01 }}
              className="flex items-center justify-center w-full p-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-colors border-2 border-green-500/30 hover:border-green-500/50"
            >
              <Github className="mr-2 text-green-400" size={16} /> Continue with Github
            </motion.button>
          </div>
        </div>
        
        {/* Right side form */}
        <div className="relative w-7/10 bg-slate-800/30 backdrop-blur-sm p-6 flex flex-col items-center justify-center z-10">
          <div className="w-full max-w-lg">
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-white">Registration</h2>
              <p className="text-sm text-gray-400 mt-2 max-w-md mx-auto">
                Join our platform to access all features and connect with students and teachers from around the world.
              </p>
            </div>
            
            {renderProgressBar()}
            
            <form className="w-full">
              <AnimatePresence mode="wait">
                {renderStep()}
              </AnimatePresence>
            </form>
          </div>
        </div>
      </div>
    );
  };

  export default Signup;