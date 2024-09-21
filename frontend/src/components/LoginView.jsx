import React, { useState } from 'react';
import { Brackets, X, Eye, EyeOff } from 'lucide-react';
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import { useAuth } from '../contexts/useAuth';


const currentYear = new Date().getFullYear();

const ConnectXLogo = () => (
    <div className="relative w-1/2 h-screen bg-black">
      <Brackets className="w-full h-full text-primary absolute" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 px-8">
        <X className="w-full h-full text-primary" />
      </div>
    </div>
  );

export default function LoginView() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const validateForm = () => {
    let errors = {};
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.password) errors.password = "Password is required";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      try {
        const success = await login(formData.username, formData.password);
        if (success) {
          navigate("/home");
        } else {
          alert("Login failed. Please try again.");
        }
      } catch (error) {
        alert(error);
      }
    } else {
      setErrors(formErrors);
    }
  };


  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <div className="flex flex-col lg:flex-row flex-grow">
        {/* Left section (Logo) */}
        <div className="lg:w-1/2 flex justify-center items-center p-4">
            <ConnectXLogo />
        </div>

        {/* Right section (Form) */}
        <div className="lg:w-1/2 flex flex-col justify-center p-8 md:p-16">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold mt-12 mb-8">Log in to ConnectX</h1>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                <label htmlFor="username" className="block text-sm font-medium mb-2">Username</label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your username"
                />
                {errors.username && <p className="mt-1 text-xs text-red-500">{errors.username}</p>}
                </div>
                <div>
                <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
                <div className="relative">
                    <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your password"
                    />
                    <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    >
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
                </div>
                <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-700 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                    Remember me
                    </label>
                </div>
                <div className="text-sm">
                    <a href="#" className="font-medium text-primary hover:underline">
                    Forgot password?
                    </a>
                </div>
                </div>
                <button
                type="submit"
                className="w-full bg-primary text-white rounded-full py-2 px-4 font-bold hover:bg-primary/90 transition duration-200"
                >
                Log in
                </button>
            </form>
            <p className="mt-6 text-sm">
                Don't have an account? <a href="/register" className="text-primary hover:underline">Sign up</a>
            </p>
            </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-auto p-4 text-center text-xs text-gray-500">
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-2">
          <a href="#" className="hover:underline">About</a>
          <a href="#" className="hover:underline">Download the ConnectX app</a>
          <a href="#" className="hover:underline">Help Center</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Cookie Policy</a>
          <a href="#" className="hover:underline">Accessibility</a>
          <a href="#" className="hover:underline">Ads info</a>
          <a href="#" className="hover:underline">Blog</a>
          <a href="#" className="hover:underline">Careers</a>
          <a href="#" className="hover:underline">Brand Resources</a>
          <a href="#" className="hover:underline">Advertising</a>
          <a href="#" className="hover:underline">Marketing</a>
          <a href="#" className="hover:underline">ConnectX for Business</a>
          <a href="#" className="hover:underline">Developers</a>
          <a href="#" className="hover:underline">Directory</a>
          <a href="#" className="hover:underline">Settings</a>
        </nav>
        <p>© {currentYear} ConnectX Corp.</p>
      </footer>
    </div>
  );
}