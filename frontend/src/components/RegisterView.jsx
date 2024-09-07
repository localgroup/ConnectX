import React, { useState } from 'react';
import { Brackets, X, Eye, EyeOff } from 'lucide-react';
import api from "../api";


const currentYear = new Date().getFullYear();

const ConnectXLogo = () => (
    <div className="relative w-1/2 h-screen bg-black">
      <Brackets className="w-full h-full text-primary absolute" />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-5/6 px-8">
        <X className="w-full h-full text-primary" />
      </div>
    </div>
  );

export default function RegisterView() {
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
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
    if (!formData.firstName.trim()) errors.firstName = "First Name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last Name is required";
    if (!formData.username.trim()) errors.username = "Username is required";
    if (!formData.email.trim()) errors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errors.email = "Email is invalid";
    if (!formData.password) errors.password = "Password is required";
    else if (formData.password.length < 8) errors.password = "Password must be at least 8 characters";
    return errors;
  };
  

  const handleSubmit = (e) => {
    e.preventDefault();
    const formErrors = validateForm();
    if (Object.keys(formErrors).length === 0) {
      console.log('Form submitted', formData);
      api
        .post("/api/user/register/", formData)
        .then(response => {
          console.log('Registration successful:', response.data);
          // Handle successful registration (e.g., redirect or display a success message)
        })
        .catch(error => {
          console.error('Registration error:', error.response ? error.response.data : error.message);
          // Handle registration error
        });
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
          <h1 className="text-3xl font-bold mb-8">Create your account</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
          <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Enter your email"
              />
              {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
            </div>
            <div>
                <label htmlFor="firstName" className="block text-sm font-medium mb-2">First Name</label>
                <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your first name"
                />
                {errors.firstName && <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>}
                </div>

                <div>
                <label htmlFor="lastName" className="block text-sm font-medium mb-2">Last Name</label>
                <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-black border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter your last name"
                />
                {errors.lastName && <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>}
                </div>

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
            <button
              type="submit"
              className="w-full bg-primary text-white rounded-full py-2 px-4 font-bold hover:bg-primary/90 transition duration-200"
            >
              Sign up
            </button>
          </form>
          <p className="mt-4 text-xs text-gray-500">
            By signing up, you agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>, including <a href="#" className="text-primary hover:underline">Cookie Use</a>.
          </p>
          <p className="mt-6 text-sm">
            Already have an account? <a href="/login" className="text-primary hover:underline">Log in</a>
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

