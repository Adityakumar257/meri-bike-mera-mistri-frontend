import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaLock, FaEnvelope, FaSpinner, FaPhone, FaCheckCircle, FaExclamationTriangle, FaEye, FaEyeSlash, FaClock } from 'react-icons/fa';
import axios from 'axios';
import { API_BASE_URL as API_URL } from '../services/api';

const getApiErrorMessage = (error, fallback) => (
  error.response?.data?.message
    || (error.request ? 'Unable to connect to the server. Please try again later.' : error.message)
    || fallback
);

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(!location.state?.showSignup);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  });
  const [errors, setErrors] = useState(() => (
    location.state?.message ? { general: location.state.message } : {}
  ));
  const [isLoading, setIsLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationOTP, setVerificationOTP] = useState('');
  const [verificationMessage, setVerificationMessage] = useState({ type: '', text: '' });
  const [isVerified, setIsVerified] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailSentStatus, setEmailSentStatus] = useState(false);
  const [otpFromResponse, setOtpFromResponse] = useState('');
  const [unverifiedEmail, setUnverifiedEmail] = useState('');
  const [otpTimer, setOtpTimer] = useState(0);

  // OTP Timer effect
  React.useEffect(() => {
    let timer;
    if (otpTimer > 0) {
      timer = setTimeout(() => setOtpTimer(otpTimer - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [otpTimer]);

  const startOTPTimer = () => {
    setOtpTimer(300); // 5 minutes
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
    
    if (errors.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (isLogin) {
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      }
    } else {
      if (!formData.firstName.trim()) {
        newErrors.firstName = 'First name is required';
      } else if (formData.firstName.length < 2) {
        newErrors.firstName = 'First name must be at least 2 characters';
      }
      
      if (!formData.lastName.trim()) {
        newErrors.lastName = 'Last name is required';
      }
      
      if (!formData.email) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
      
      if (formData.mobile && !/^[0-9]{10}$/.test(formData.mobile)) {
        newErrors.mobile = 'Mobile number must be 10 digits';
      }
      
      if (!formData.password) {
        newErrors.password = 'Password is required';
      } else if (formData.password.length < 6) {
        newErrors.password = 'Password must be at least 6 characters';
      } else if (formData.password.length > 20) {
        newErrors.password = 'Password cannot exceed 20 characters';
      }
      
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
      
      if (!formData.acceptTerms) {
        newErrors.acceptTerms = 'You must accept the terms and conditions';
      }
    }
    
    return newErrors;
  };

  const handleLogin = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setVerificationMessage({ type: '', text: '' });
    
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email: formData.email,
        password: formData.password
      });
      
      if (response.data.success) {

        // ✅ SECURITY CHECK ADDED HERE: Prevent Admins from logging in here
        if (['admin', 'superadmin'].includes(response.data.user.role)) {
           setErrors({ 
             general: 'Admins are not allowed here. Please use the Admin Portal.' 
           });
           setIsLoading(false);
           return; 
        }

        // Use AuthContext login function
        login(response.data.user, response.data.token);
        
        setVerificationMessage({
          type: 'success',
          text: 'Login successful! Redirecting...'
        });
        
      } else if (response.data.needsVerification) {
        setUnverifiedEmail(response.data.email || formData.email);
        setEmailSentStatus(Boolean(response.data.emailSent));
        setVerificationOTP('');
        setVerificationStep(true);
        startOTPTimer();
        setVerificationMessage({
          type: 'warning',
          text: response.data.emailSent
            ? 'Please verify your email with the 6-digit code we sent.'
            : 'Your email is not verified. Request a new verification code to continue.'
        });
      } else {
        setErrors({ general: response.data.message || 'Login failed. Please try again.' });
      }
    } catch (error) {
      let errorMessage = getApiErrorMessage(error, 'Login failed. Please try again.');
      let errorType = 'error';
      
      if (error.response) {
        if (error.response.status === 403) {
          errorMessage = error.response.data?.message || 'Your account cannot sign in right now.';
        } else if (error.response.status === 401) {
          errorMessage = error.response.data?.message || 'Invalid email or password';
        }
      }
      
      if (errorType === 'error') {
        setErrors({ general: errorMessage });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    const validationErrors = validateForm();
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    setVerificationMessage({ type: '', text: '' });
    
    try {
      const registrationData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        mobile: formData.mobile || '',
        password: formData.password
      };
      
      const response = await axios.post(`${API_URL}/auth/register`, registrationData);
      
      if (response.data.success) {
        setRegistrationSuccess(true);
        setVerificationStep(true);
        setEmailSentStatus(response.data.emailSent || false);
        
        if (response.data.otp) {
          setOtpFromResponse(response.data.otp);
          setVerificationOTP(response.data.otp);
        }
        
        startOTPTimer();
        
        setVerificationMessage({
          type: 'success',
          text: (
            <div className="space-y-2">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                <p className="font-medium text-gray-800">Registration successful!</p>
              </div>
              <p className="text-sm text-gray-600">
                A 6-digit OTP has been sent to your email.
              </p>
              {response.data.emailSent ? (
                <p className="text-xs text-green-600">
                  ✅ Email sent successfully to {formData.email}
                </p>
              ) : (
                <p className="text-xs text-yellow-600">
                  ⚠️ Email sending failed. Use the manual options below.
                </p>
              )}
            </div>
          )
        });
      }
    } catch (error) {
      let errorMessage = getApiErrorMessage(error, 'Registration failed. Please try again.');
      
      if (error.response) {
        if (error.response.status === 400 && errorMessage.includes('already exists')) {
          errorMessage = (
            <div className="space-y-2">
              <p className="text-red-600">{errorMessage}</p>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setFormData(prev => ({ ...prev, email: formData.email }));
                }}
                className="text-orange-600 hover:text-orange-700 underline font-medium text-sm"
              >
                Try logging in instead?
              </button>
            </div>
          );
        }
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyEmail = async () => {
    if (!verificationOTP) {
      setErrors({ verification: 'Please enter 6-digit OTP' });
      return;
    }

    if (!/^\d{6}$/.test(verificationOTP)) {
      setErrors({ verification: 'Please enter a valid 6-digit OTP' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await axios.post(`${API_URL}/auth/verify-email`, {
        email: formData.email || unverifiedEmail,
        otp: verificationOTP
      });
      
      if (response.data.success) {
        handleVerificationSuccess();
      }
    } catch (error) {
      let errorMessage = getApiErrorMessage(error, 'Invalid or expired OTP');
      
      if (error.response) {
        if (errorMessage.includes('expired') || errorMessage.includes('invalid')) {
          setVerificationMessage({
            type: 'error',
            text: (
              <div className="space-y-2">
                <div className="flex items-center">
                  <FaExclamationTriangle className="text-red-500 mr-2" />
                  <p className="font-medium text-gray-800">OTP Invalid or Expired</p>
                </div>
                <p className="text-sm text-gray-600">
                  The OTP you entered is invalid or has expired.
                </p>
                <div className="flex space-x-2 pt-1">
                  <button
                    type="button"
                    onClick={() => handleResendVerification(formData.email || unverifiedEmail)}
                    className="text-orange-600 hover:text-orange-700 underline text-sm font-medium"
                  >
                    Send new OTP
                  </button>
                </div>
              </div>
            )
          });
        }
      }
      
      setErrors({ verification: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerificationSuccess = () => {
    setIsVerified(true);
    setVerificationMessage({
      type: 'success',
      text: (
        <div className="space-y-2">
          <div className="flex items-center">
            <FaCheckCircle className="text-green-500 mr-2" />
            <p className="font-medium text-gray-800">Email verified successfully!</p>
          </div>
          <p className="text-sm text-gray-600">
            You can now login with your account.
          </p>
        </div>
      )
    });
    
    setTimeout(() => {
      if (registrationSuccess) {
        setIsLogin(true);
        setVerificationStep(false);
        setVerificationOTP('');
        setIsVerified(false);
        setRegistrationSuccess(false);
        setVerificationMessage({ type: '', text: '' });
        setOtpTimer(0);
      }
    }, 3000);
  };

  const handleResendVerification = async (email) => {
    const emailToUse = email || formData.email;
    
    if (!emailToUse) {
      setErrors({ verification: 'Email is required' });
      return;
    }
    
    setIsLoading(true);
    setErrors({});
    
    try {
      const response = await axios.post(`${API_URL}/auth/resend-otp`, {
        email: emailToUse
      });
      
      if (response.data.success) {
        setEmailSentStatus(response.data.emailSent || false);
        
        if (response.data.otp) {
          setOtpFromResponse(response.data.otp);
          setVerificationOTP(response.data.otp);
        }
        
        startOTPTimer();
        
        setVerificationMessage({
          type: 'success',
          text: (
            <div className="space-y-2">
              <div className="flex items-center">
                <FaCheckCircle className="text-green-500 mr-2" />
                <p className="font-medium text-gray-800">
                  OTP sent!
                </p>
              </div>
              <p className="text-sm text-gray-600">
                Check your email for the 6-digit code.
              </p>
              {response.data.emailSent ? (
                <p className="text-xs text-green-600">
                  ✅ Email sent successfully to {emailToUse}
                </p>
              ) : (
                <p className="text-xs text-yellow-600">
                  ⚠️ Email sending failed. Use the manual options below.
                </p>
              )}
            </div>
          )
        });
        
        if (!registrationSuccess && !verificationStep) {
          setVerificationStep(true);
        }
      }
    } catch (error) {
      let errorMessage = getApiErrorMessage(
        error,
        'Failed to resend the OTP. Please try again.'
      );
      
      setErrors({ verification: errorMessage });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (verificationStep) {
      await handleVerifyEmail();
      return;
    }
    
    if (isLogin) {
      await handleLogin();
    } else {
      await handleRegister();
    }
  };

  // If user is already logged in, redirect to home
  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  // Render verification form
  if (verificationStep) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
            <h1 className="text-2xl font-bold text-white mb-1">
              {isVerified ? 'Email Verified!' : 'Verify Your Email'}
            </h1>
            <p className="text-orange-100 text-sm">
              {isVerified ? 'Successfully verified!' : 'Complete your registration'}
            </p>
          </div>

          <div className="p-6">
            {/* Email Display */}
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
                {isVerified ? (
                  <FaCheckCircle className="h-8 w-8 text-green-600" />
                ) : (
                  <FaEnvelope className="h-8 w-8 text-orange-600" />
                )}
              </div>
              
              <p className="text-sm text-gray-600 mb-1">Verification email sent to:</p>
              <p className="font-semibold text-lg text-gray-800 mb-4">
                {formData.email || unverifiedEmail}
              </p>
              
              {/* Timer Display */}
              {otpTimer > 0 && !isVerified && (
                <div className="inline-flex items-center px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-medium mb-4">
                  <FaClock className="mr-2" />
                  OTP expires in: {formatTime(otpTimer)}
                </div>
              )}
            </div>

            {/* Messages */}
            {verificationMessage.text && (
              <div className={`rounded-lg p-4 mb-4 ${
                verificationMessage.type === 'success' ? 'bg-green-50 border border-green-200' :
                verificationMessage.type === 'error' ? 'bg-red-50 border border-red-200' :
                'bg-blue-50 border border-blue-200'
              }`}>
                {verificationMessage.text}
              </div>
            )}

            {/* OTP Form */}
            {!isVerified && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    6-Digit Verification Code
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={verificationOTP}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                        setVerificationOTP(value);
                        if (errors.verification) setErrors({ ...errors, verification: '' });
                      }}
                      className={`w-full px-4 py-3 pr-12 border ${
                        errors.verification ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent text-center text-xl tracking-widest font-mono`}
                      placeholder="000000"
                      maxLength="6"
                      autoFocus
                    />
                    {verificationOTP.length === 6 && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <FaCheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-xs text-gray-500">
                      Enter the 6-digit code from your email
                    </p>
                    <span className="text-xs font-mono bg-gray-100 px-2 py-1 rounded">
                      {verificationOTP.length}/6
                    </span>
                  </div>
                  {errors.verification && (
                    <p className="mt-1 text-sm text-red-600">{errors.verification}</p>
                  )}
                </div>

                {/* Manual OTP Display */}
                {(!emailSentStatus) && otpFromResponse && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm font-medium text-yellow-800 mb-2">Manual Verification (Email Failed):</p>
                    <div className="bg-white border border-yellow-300 rounded p-3 text-center">
                      <p className="text-xs text-gray-600 mb-1">Use this OTP:</p>
                      <p className="text-2xl font-bold font-mono tracking-widest text-gray-800">
                        {otpFromResponse}
                      </p>
                    </div>
                    <p className="text-xs text-yellow-600 mt-2">
                      Copy and paste this OTP above to verify manually
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-3">
                  <button
                    type="submit"
                    disabled={isLoading || isVerified || verificationOTP.length !== 6}
                    className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center shadow-md transition-all"
                  >
                    {isLoading ? (
                      <>
                        <FaSpinner className="animate-spin mr-2" />
                        Verifying...
                      </>
                    ) : (
                      'Verify with OTP'
                    )}
                  </button>
                  
                  <div>
                    <button
                      type="button"
                      onClick={() => handleResendVerification(formData.email || unverifiedEmail)}
                      disabled={isLoading || otpTimer > 0}
                      className={`py-3 rounded-lg font-medium text-sm transition-colors ${
                        otpTimer > 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {otpTimer > 0 ? `Resend in ${formatTime(otpTimer)}` : 'Resend OTP'}
                    </button>
                  </div>
                </div>
              </form>
            )}

            {/* Success State */}
            {isVerified && (
              <div className="text-center space-y-4">
                <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
                  <div className="flex flex-col items-center">
                    <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <FaCheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <p className="text-lg font-semibold text-green-800 mb-1">
                      Email Verified Successfully!
                    </p>
                    <p className="text-sm text-green-600">
                      Your account is now ready to use
                    </p>
                    <div className="mt-4 text-xs text-green-500">
                      Redirecting to login page...
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setVerificationStep(false);
                    setVerificationOTP('');
                    setIsVerified(false);
                    setRegistrationSuccess(false);
                    setVerificationMessage({ type: '', text: '' });
                    setOtpTimer(0);
                  }}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all shadow-md"
                >
                  Go to Login
                </button>
              </div>
            )}

            {/* Back Button */}
            <div className="mt-6 pt-4 border-t border-gray-200 text-center">
              <button
                onClick={() => {
                  if (registrationSuccess) {
                    setVerificationStep(false);
                    setErrors({});
                    setVerificationOTP('');
                    setVerificationMessage({ type: '', text: '' });
                    setOtpTimer(0);
                  } else {
                    setVerificationStep(false);
                    setErrors({});
                    setVerificationOTP('');
                    setVerificationMessage({ type: '', text: '' });
                    setUnverifiedEmail('');
                  }
                }}
                className="text-orange-600 font-medium hover:text-orange-700 hover:underline transition-colors text-sm"
              >
                ← {registrationSuccess ? 'Back to Registration' : 'Back to Login'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal login/signup form
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-md">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-6 text-center">
          <h1 className="text-2xl font-bold text-white mb-1">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-orange-100 text-sm">
            {isLogin ? 'Sign in to continue' : 'Join us today'}
          </p>
        </div>

        {/* Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border ${
                          errors.firstName ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                        placeholder="First Name"
                      />
                    </div>
                    {errors.firstName && (
                      <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaUser className="text-gray-400 text-sm" />
                      </div>
                      <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className={`w-full pl-9 pr-3 py-2.5 text-sm border ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                        placeholder="Last Name"
                      />
                    </div>
                    {errors.lastName && (
                      <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mobile Number (Optional)
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaPhone className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type="tel"
                      name="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-3 py-2.5 text-sm border ${
                        errors.mobile ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                      placeholder="10-digit mobile number"
                      maxLength="10"
                    />
                  </div>
                  {errors.mobile && (
                    <p className="mt-1 text-xs text-red-600">{errors.mobile}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">Optional for notifications</p>
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="text-gray-400 text-sm" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-3 py-2.5 text-sm border ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="text-gray-400 text-sm" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full pl-9 pr-10 py-2.5 text-sm border ${
                    errors.password ? 'border-red-500' : 'border-gray-300'
                  } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-600">{errors.password}</p>
              )}
              {!isLogin && (
                <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
              )}
            </div>

            {!isLogin && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password *
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-gray-400 text-sm" />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-9 pr-10 py-2.5 text-sm border ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      } rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-colors`}
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash size={14} /> : <FaEye size={14} />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-red-600">{errors.confirmPassword}</p>
                  )}
                </div>

                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="acceptTerms"
                    name="acceptTerms"
                    checked={formData.acceptTerms}
                    onChange={handleChange}
                    className="h-4 w-4 mt-0.5 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <label htmlFor="acceptTerms" className="ml-2 block text-sm text-gray-700">
                    I agree to the{' '}
                    <Link to="/terms" className="text-orange-600 hover:text-orange-700 font-medium">
                      Terms & Conditions
                    </Link>
                    *
                  </label>
                </div>
                {errors.acceptTerms && (
                  <p className="mt-1 text-xs text-red-600">{errors.acceptTerms}</p>
                )}
              </>
            )}

            {errors.general && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                <div className="flex items-start">
                  <FaExclamationTriangle className="text-red-500 mr-2 mt-0.5" size={14} />
                  <div className="text-sm text-red-600">
                    {typeof errors.general === 'string' ? errors.general : <div>{errors.general}</div>}
                  </div>
                </div>
              </div>
            )}

            {verificationMessage.text && !verificationStep && (
              <div className={`rounded-lg p-3 border ${
                verificationMessage.type === 'success' ? 'bg-green-50 border-green-200' :
                verificationMessage.type === 'warning' ? 'bg-yellow-50 border-yellow-200' :
                'bg-blue-50 border-blue-200'
              }`}>
                {verificationMessage.text}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-orange-600 hover:to-orange-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <FaSpinner className="animate-spin mr-2" />
                  {isLogin ? 'Signing In...' : 'Creating Account...'}
                </>
              ) : (
                isLogin ? 'Sign In' : 'Create Account'
              )}
            </button>
          </form>

          {/* Toggle between Login/Signup */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setErrors({});
                  setVerificationMessage({ type: '', text: '' });
                  setFormData({
                    firstName: '',
                    lastName: '',
                    email: '',
                    mobile: '',
                    password: '',
                    confirmPassword: '',
                    acceptTerms: false
                  });
                }}
                className="text-orange-600 font-semibold hover:text-orange-700 hover:underline"
                disabled={isLoading}
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>

          {/* Forgot Password Link */}
          {isLogin && (
            <div className="mt-4 text-center">
              <Link 
                to="/forgot-password" 
                className="text-orange-600 hover:text-orange-700 font-medium text-sm"
              >
                Forgot your password?
              </Link>
            </div>
          )}

          {/* Help Section */}
          <div className="mt-6 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-xs font-medium text-gray-700 mb-2">Need help with verification?</p>
            <ul className="text-xs text-gray-600 space-y-1">
              <li className="flex items-start">
                <span className="text-green-500 mr-1">✓</span>
                <span>Check your spam/junk folder</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 mr-1">✓</span>
                <span>OTP is valid for 5 minutes</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;