'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Phone, Mail, Lock } from 'lucide-react';
import { api } from '@/services/api';
import { setAuthData } from '@/utils/auth';
import Toast from '@/components/Toast';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('returnUrl') || '/';

  const [loginMethod, setLoginMethod] = useState<'otp' | 'email'>('otp');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [toast, setToast] = useState({ visible: false, message: '' });

  async function handleSendOTP() {
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    
    if (!cleanPhone || cleanPhone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.sendOTP(cleanPhone, 'User');
      console.log('Send OTP Response:', response);
      
      if (response?.success) {
        setOtpSent(true);
        setToast({ visible: true, message: response.message || 'OTP sent successfully!' });
      } else {
        setError(response?.message || response?.error || 'Failed to send OTP');
      }
    } catch (error) {
      console.error('Send OTP error:', error);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP() {
    const cleanPhone = phone.replace(/\D/g, ''); // Remove non-digits
    const cleanOtp = otp.replace(/\D/g, ''); // Remove non-digits
    
    if (!cleanOtp || cleanOtp.length < 4 || cleanOtp.length > 6) {
      setError('Please enter a valid OTP (4-6 digits)');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await api.verifyOTP(cleanPhone, cleanOtp, 'User');
      console.log('Verify OTP Response:', response);
      
      if (response?.success) {
        // Extract token - handle different response structures
        const accessToken = response?.data?.tokens?.accessToken 
                         || response?.data?.accessToken
                         || response?.accessToken
                         || response?.token
                         || 'temp-token';
        
        // Extract user data - ensure mobile number is stored in all possible fields
        const userData = {
          ...response.data?.user,
          mobile: cleanPhone, // Store as string
          phone: cleanPhone,
          mobileNumber: cleanPhone,
          Mobile: cleanPhone, // Also store as Mobile (capital M) for API compatibility
          Number: cleanPhone, // Also store as Number for API compatibility
          UserId: response?.data?.user?.UserId || 0,
        };
        
        console.log('Storing auth data:', { accessToken: accessToken ? 'present' : 'missing', userData });
        setAuthData(accessToken, userData);
        
        // Verify it was stored correctly
        const storedData = JSON.parse(localStorage.getItem('userData') || '{}');
        console.log('Stored user data:', storedData);
        console.log('Mobile number in storage:', storedData.mobile || storedData.phone || storedData.mobileNumber);
        
        setToast({ visible: true, message: response.message || 'Login successful!' });
        setTimeout(() => {
          router.push(returnUrl);
        }, 1000);
      } else {
        setError(response?.message || response?.error || 'Invalid OTP');
      }
    } catch (error) {
      console.error('Verify OTP error:', error);
      setError('Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin() {
    if (!email || !password) {
      setError('Please enter email and password');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/website-users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (data?.success && data?.data?.tokens) {
        // Store user data (mobile will be added if available from user object)
        const userData = {
          ...data.data.user,
        };
        setAuthData(data.data.tokens.accessToken, userData);
        setToast({ visible: true, message: 'Login successful!' });
        setTimeout(() => {
          router.push(returnUrl);
        }, 1000);
      } else {
        setError(data?.message || 'Invalid email or password');
      }
    } catch (error) {
      setError('Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100">
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-3 px-4 py-3">
          <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100">
            <ArrowLeft className="w-5 h-5 text-gray-700" />
          </Link>
          <h1 className="text-lg font-bold text-gray-900">Login</h1>
        </div>
      </header>

      <div className="px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🌾</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome Back</h2>
            <p className="text-gray-600">Sign in to continue shopping</p>
          </div>

          {/* Login Method Toggle */}
          <div className="bg-white rounded-xl p-1 mb-6 flex gap-1 shadow-sm">
            <button
              onClick={() => {
                setLoginMethod('otp');
                setOtpSent(false);
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                loginMethod === 'otp'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Phone className="w-4 h-4 inline mr-2" />
              OTP Login
            </button>
            <button
              onClick={() => {
                setLoginMethod('email');
                setError('');
              }}
              className={`flex-1 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                loginMethod === 'email'
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Email Login
            </button>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-2xl p-6 shadow-lg">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                {error}
              </div>
            )}

            {loginMethod === 'otp' ? (
              <>
                {!otpSent ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                        placeholder="9876543210"
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                        maxLength={10}
                      />
                      <button
                        onClick={handleSendOTP}
                        disabled={loading || !phone || phone.length !== 10}
                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Sending...' : 'Send OTP'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter OTP sent to +91 {phone}
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                        placeholder="123456"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-center text-2xl tracking-widest"
                        maxLength={6}
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          setOtpSent(false);
                          setOtp('');
                        }}
                        className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors"
                      >
                        Change Number
                      </button>
                      <button
                        onClick={handleVerifyOTP}
                        disabled={loading || !otp || otp.length !== 6}
                        className="flex-1 px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        {loading ? 'Verifying...' : 'Verify OTP'}
                      </button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  />
                </div>
                <button
                  onClick={handleEmailLogin}
                  disabled={loading || !email || !password}
                  className="w-full px-4 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-center text-sm text-gray-600 mt-6">
            Don't have an account?{' '}
            <Link href="/account" className="text-emerald-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast({ visible: false, message: '' })}
      />
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-emerald-100 flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-emerald-600 border-t-transparent rounded-full"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
