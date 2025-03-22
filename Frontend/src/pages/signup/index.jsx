import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaCamera, FaGraduationCap, FaChalkboardTeacher, FaBuilding } from 'react-icons/fa';
import './index.css';

const SignUp = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [role, setRole] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null,
    // Student specific fields
    studentId: '',
    batch: '',
    department: '',
    // Teacher specific fields
    teacherId: '',
    designation: '',
    department: '',
    courses: []
  });
  
  const [errors, setErrors] = useState({});
  
  const validateStep = (currentStep) => {
    let stepErrors = {};
    let isValid = true;
    
    if (currentStep === 1) {
      if (!role) {
        stepErrors.role = 'Please select a role';
        isValid = false;
      }
    } 
    else if (currentStep === 2) {
      if (!formData.firstName.trim()) {
        stepErrors.firstName = 'First name is required';
        isValid = false;
      }
      if (!formData.lastName.trim()) {
        stepErrors.lastName = 'Last name is required';
        isValid = false;
      }
      if (!formData.email.trim()) {
        stepErrors.email = 'Email is required';
        isValid = false;
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        stepErrors.email = 'Email is invalid';
        isValid = false;
      }
    }
    else if (currentStep === 3) {
      if (!formData.password) {
        stepErrors.password = 'Password is required';
        isValid = false;
      } else if (formData.password.length < 6) {
        stepErrors.password = 'Password must be at least 6 characters';
        isValid = false;
      }
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Passwords do not match';
        isValid = false;
      }
    }
    else if (currentStep === 4) {
      if (role === 'student') {
        if (!formData.studentId) {
          stepErrors.studentId = 'Student ID is required';
          isValid = false;
        }
        if (!formData.batch) {
          stepErrors.batch = 'Batch is required';
          isValid = false;
        }
        if (!formData.department) {
          stepErrors.department = 'Department is required';
          isValid = false;
        }
      } else if (role === 'teacher') {
        if (!formData.teacherId) {
          stepErrors.teacherId = 'Teacher ID is required';
          isValid = false;
        }
        if (!formData.designation) {
          stepErrors.designation = 'Designation is required';
          isValid = false;
        }
        if (!formData.department) {
          stepErrors.department = 'Department is required';
          isValid = false;
        }
      }
    }
    
    setErrors(stepErrors);
    return isValid;
  };
  
  const nextStep = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };
  
  const prevStep = () => {
    setStep(step - 1);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleRoleSelect = (selectedRole) => {
    setRole(selectedRole);
    setFormData({
      ...formData,
      role: selectedRole
    });
  };
  
  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setFormData({
        ...formData,
        profileImage: e.target.files[0]
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateStep(step)) {
      // In a real app, you would send this data to your backend
      console.log('Form submitted with data:', formData);
      
      try {
        // Simulate API call
        // const response = await fetch('/api/signup', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify(formData),
        // });
        
        // const data = await response.json();
        
        // if (data.success) {
        //   navigate('/login');
        // }
        
        // For demo, just navigate to login
        navigate('/login');
      } catch (error) {
        console.error('Error during signup:', error);
        setErrors({ submit: 'Failed to create account. Please try again.' });
      }
    }
  };
  
  // Render step 1 - Role Selection
  const renderStepOne = () => (
    <div className="step-container role-selection">
      <h2>Select Your Role</h2>
      <div className="role-options">
        <div 
          className={`role-card ${role === 'student' ? 'selected' : ''}`} 
          onClick={() => handleRoleSelect('student')}
        >
          <div className="role-icon">
            <FaGraduationCap />
          </div>
          <h3>Student</h3>
          <p>Enroll in courses and track your attendance</p>
        </div>
        
        <div 
          className={`role-card ${role === 'teacher' ? 'selected' : ''}`} 
          onClick={() => handleRoleSelect('teacher')}
        >
          <div className="role-icon">
            <FaChalkboardTeacher />
          </div>
          <h3>Teacher</h3>
          <p>Create courses and manage student attendance</p>
        </div>
      </div>
      {errors.role && <div className="error-message">{errors.role}</div>}
      
      <div className="step-actions">
        <button type="button" onClick={nextStep} className="next-btn" disabled={!role}>
          Next
        </button>
      </div>
    </div>
  );
  
  // Render step 2 - Personal Information
  const renderStepTwo = () => (
    <div className="step-container">
      <h2>Personal Information</h2>
      <div className="form-group">
        <label htmlFor="firstName">
          <FaUser /> First Name
        </label>
        <input
          type="text"
          id="firstName"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          placeholder="Enter your first name"
        />
        {errors.firstName && <div className="error-message">{errors.firstName}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="lastName">
          <FaUser /> Last Name
        </label>
        <input
          type="text"
          id="lastName"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          placeholder="Enter your last name"
        />
        {errors.lastName && <div className="error-message">{errors.lastName}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="email">
          <FaEnvelope /> Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email"
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>
      
      <div className="step-actions">
        <button type="button" onClick={prevStep} className="prev-btn">
          Back
        </button>
        <button type="button" onClick={nextStep} className="next-btn">
          Next
        </button>
      </div>
    </div>
  );
  
  // Render step 3 - Security
  const renderStepThree = () => (
    <div className="step-container">
      <h2>Security</h2>
      <div className="form-group">
        <label htmlFor="password">
          <FaLock /> Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Create a password"
        />
        {errors.password && <div className="error-message">{errors.password}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="confirmPassword">
          <FaLock /> Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          placeholder="Confirm your password"
        />
        {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
      </div>
      
      <div className="form-group">
        <label htmlFor="profileImage">
          <FaCamera /> Profile Image (Optional)
        </label>
        <input
          type="file"
          id="profileImage"
          name="profileImage"
          onChange={handleImageChange}
          accept="image/*"
        />
      </div>
      
      <div className="step-actions">
        <button type="button" onClick={prevStep} className="prev-btn">
          Back
        </button>
        <button type="button" onClick={nextStep} className="next-btn">
          Next
        </button>
      </div>
    </div>
  );
  
  // Render step 4 - Role Specific Information
  const renderStepFour = () => (
    <div className="step-container">
      <h2>{role === 'student' ? 'Student Information' : 'Teacher Information'}</h2>
      
      {role === 'student' ? (
        <>
          <div className="form-group">
            <label htmlFor="studentId">
              <FaUser /> Student ID
            </label>
            <input
              type="text"
              id="studentId"
              name="studentId"
              value={formData.studentId}
              onChange={handleChange}
              placeholder="Enter your student ID"
            />
            {errors.studentId && <div className="error-message">{errors.studentId}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="batch">
              <FaGraduationCap /> Batch
            </label>
            <input
              type="text"
              id="batch"
              name="batch"
              value={formData.batch}
              onChange={handleChange}
              placeholder="Enter your batch (e.g., 2023-2027)"
            />
            {errors.batch && <div className="error-message">{errors.batch}</div>}
          </div>
        </>
      ) : (
        <>
          <div className="form-group">
            <label htmlFor="teacherId">
              <FaUser /> Teacher ID
            </label>
            <input
              type="text"
              id="teacherId"
              name="teacherId"
              value={formData.teacherId}
              onChange={handleChange}
              placeholder="Enter your teacher ID"
            />
            {errors.teacherId && <div className="error-message">{errors.teacherId}</div>}
          </div>
          
          <div className="form-group">
            <label htmlFor="designation">
              <FaChalkboardTeacher /> Designation
            </label>
            <input
              type="text"
              id="designation"
              name="designation"
              value={formData.designation}
              onChange={handleChange}
              placeholder="Enter your designation (e.g., Professor)"
            />
            {errors.designation && <div className="error-message">{errors.designation}</div>}
          </div>
        </>
      )}
      
      <div className="form-group">
        <label htmlFor="department">
          <FaBuilding /> Department
        </label>
        <select
          id="department"
          name="department"
          value={formData.department}
          onChange={handleChange}
        >
          <option value="">Select Department</option>
          <option value="computer_science">Computer Science</option>
          <option value="electrical_engineering">Electrical Engineering</option>
          <option value="mechanical_engineering">Mechanical Engineering</option>
          <option value="physics">Physics</option>
          <option value="mathematics">Mathematics</option>
          <option value="biology">Biology</option>
        </select>
        {errors.department && <div className="error-message">{errors.department}</div>}
      </div>
      
      <div className="step-actions">
        <button type="button" onClick={prevStep} className="prev-btn">
          Back
        </button>
        <button type="submit" onClick={handleSubmit} className="submit-btn">
          Create Account
        </button>
      </div>
    </div>
  );
  
  // Progress bar
  const renderProgressBar = () => {
    const progress = (step / 4) * 100;
    
    return (
      <div className="progress-container">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="steps-indicator">
          {[1, 2, 3, 4].map(stepNumber => (
            <div 
              key={stepNumber}
              className={`step-dot ${stepNumber <= step ? 'active' : ''} ${stepNumber < step ? 'completed' : ''}`}
            >
              {stepNumber}
            </div>
          ))}
        </div>
        <div className="step-labels">
          <span className={step >= 1 ? 'active' : ''}>Role</span>
          <span className={step >= 2 ? 'active' : ''}>Personal</span>
          <span className={step >= 3 ? 'active' : ''}>Security</span>
          <span className={step >= 4 ? 'active' : ''}>Details</span>
        </div>
      </div>
    );
  };
  
  return (
    <div className="signup-container">
      <div className="signup-card">
        <h1 className="signup-title">Create Your Account</h1>
        <p className="signup-subtitle">Join our attendance management system</p>
        
        {renderProgressBar()}
        
        <form className="signup-form">
          {step === 1 && renderStepOne()}
          {step === 2 && renderStepTwo()}
          {step === 3 && renderStepThree()}
          {step === 4 && renderStepFour()}
        </form>
      </div>
    </div>
  );
};

export default SignUp;