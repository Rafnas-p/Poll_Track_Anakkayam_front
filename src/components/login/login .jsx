import React from 'react';
import { AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { authAPI } from '../api/axiose';
import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {
  const [email, setEmail] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: ({ email, password }) => authAPI.login(email, password),
    onSuccess: (data) => {
      localStorage.setItem('token', data.data.accessToken);
      localStorage.setItem('user', JSON.stringify(data.data.admin));
      console.log('Login successful!');
      navigate('/dashboard', { replace: true });
    },
    onError: (error) => {
      const message = error.response?.data?.message || 'Login failed. Please try again.';
      setErrorMessage(message);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMessage('Please fill in all fields');
      return;
    }
    loginMutation.mutate({ email, password });
  };

  return (
    <div         className="absolute bottom-0 left-0 top-0 h-full w-full overflow-hidden bg-red-900 bg-gradient-to-b from-gray-900 via-white-900 to-rede-800 leading-5"
>
      <div   className="relative flex min-h-screen items-center justify-center bg-transparent">
        <div className="max-w-md mx-auto bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl border border-white/20 ring-1 ring-black/5">
          {/* Header */}
          <div className="p-8 pb-6 text-center border-b border-gray-100">
            <div className="mx-auto w-24 h-24 bg-gradient-to-r from-rose-500/20 to-red-600/20 rounded-full flex items-center justify-center mb-6">
              <div className="w-28 h-28 bg-gradient-to-r from-rose-500 to-red-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-3xl font-bold text-white">CPIM</span>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Admin Login</h1>
            <p className="text-sm text-gray-600 leading-relaxed max-w-xs mx-auto">
              Sign in to your CPIM admin account to manage and access the control panel
            </p>
          </div>

          {/* Form */}
          <div className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    id="email"
                    required
                    className="w-full px-4 py-3 pr-12 text-sm rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 disabled:bg-gray-50/50 disabled:cursor-not-allowed disabled:text-gray-500"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={loginMutation.isPending}
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                    </svg>
                  </div>
                </div>
              </div>
{/* Password Field */}
<div>
  <label
    htmlFor="password"
    className="block text-sm font-semibold text-gray-700 mb-2"
  >
    Password
  </label>
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      id="password"
      required
      className="w-full px-4 py-3 pr-10 text-sm rounded-xl border-2 border-gray-200 bg-white/50 backdrop-blur-sm text-gray-900 placeholder-gray-500 transition-all duration-200 focus:outline-none focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 disabled:bg-gray-50/50 disabled:cursor-not-allowed disabled:text-gray-500"
      placeholder="Enter your password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      disabled={loginMutation.isPending}
    />

    <button
      type="button"
      className="absolute inset-y-0 right-2 flex items-center justify-center z-10"
      onClick={(e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
      }}
      disabled={loginMutation.isPending}
      tabIndex={-1}
    >
      {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
    </button>
  </div>
</div>

              {/* Error Message */}
              {errorMessage && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-rose-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-rose-700 leading-relaxed">{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loginMutation.isPending || !email || !password}
                className="group w-full h-12 rounded-xl bg-gradient-to-r from-rose-600 to-red-600 text-white font-semibold text-sm shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:from-rose-400 disabled:to-red-400 focus:outline-none focus:ring-4 focus:ring-rose-500/20"
              >
                <span className="flex items-center justify-center">
                  {loginMutation.isPending ? (
                    <>
                      <svg className="mr-2 h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        />
                      </svg>
                      Signing in...
                    </>
                  ) : (
                    'Sign In to Admin Panel'
                  )}
                </span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;