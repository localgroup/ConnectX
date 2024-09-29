import React, { useState, useEffect } from 'react';
import { ArrowLeft, Camera } from 'lucide-react';
import useProfile from '../hooks/useProfile.js';
import useUpdateProfile from '../hooks/useUpdateProfile.js'; 
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth.js';


export default function EditProfileView() {
    const { username } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const { profile } = useProfile(username);
    const { updateProfile } = useUpdateProfile();
    
    useEffect(() => {
      if (user && user.username !== username) {
        navigate(`/${username}`);
      }
    }, [user, username, navigate]);

    const [formData, setFormData] = useState({
      first_name: "",
      last_name: "",
      username: "",
      bio: "",
      location: "",
      website: "",
      birth_date: "",
      cover_image: null,
      avatar: null
    });

    useEffect(() => {
      if (profile) {
        setFormData({
          first_name: profile?.first_name || "",
          last_name: profile?.last_name || "",
          username: profile?.username || "",
          bio: profile?.bio || "",
          location: profile?.location || "",
          website: profile?.website || "",
          birth_date: profile?.birth_date || "",
          cover_image: profile?.cover_image || "",
          avatar: profile?.avatar || ""
        });
      }
    }, [profile]);

    const handleFileChange = (e) => {
      const { name, files } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: files[0]
      }));
    };

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prevData => ({
        ...prevData,
        [name]: value
      }));
    };

    function arrowLeft() {
      // Redirect to the profile page
      navigate(`/${username}/`);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();
      const form = new FormData();
      
      Object.keys(formData).forEach(key => {
        if (formData[key] !== profile[key]) {
          if (formData[key] instanceof File) {
            form.append(key, formData[key]);
          } else if (formData[key] !== null && formData[key] !== "") {
            form.append(key, formData[key]);
          }
        }
      });

      try {
        const updatedProfile = await updateProfile(profile?.username, form);
        console.log("Profile updated successfully:", updatedProfile);
        alert("Profile updated successfully!");
        // Redirect to the profile page
        navigate(`/${username}/`);
      } catch (error) {
        console.error("Error updating profile:", error.response?.data || error.message);
        alert(`Failed to update profile: ${error.response?.data?.detail || error.message}`);
      }
    };

    return (
      <div className="min-h-screen bg-black text-white">
          <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-6 pl-12">
              
          </aside>

          {/* Main Content */}
          <main className="flex-1 border-x border-gray-800">
              <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center space-x-4">
              <div className="flex items-center space-x-4">
                <button onClick={arrowLeft} className="rounded-full p-2 hover:bg-gray-800">
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-bold">Edit profile</h1>
              </div>
              <button 
                onClick={handleSubmit}
                className="bg-white text-black rounded-full px-4 py-1 font-bold hover:bg-gray-200 transition duration-200"
              >
                Save
              </button>
            </header>
            <form onSubmit={handleSubmit} className="p-4">
              <div className="relative mb-6">
                <img src={formData?.cover_image} alt="Cover" className="w-full h-48 object-cover" />
                <label htmlFor="cover_image" className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 cursor-pointer">
                  <Camera className="h-5 w-5" />
                  <input type="file" id="cover_image" name="cover_image" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <div className="relative mb-6">
                <img src={formData?.avatar} alt={formData?.first_name} className="w-32 h-32 rounded-full border-4 border-black absolute -top-16 left-4" />
                <label htmlFor="avatar" className="absolute top-0 left-24 bg-black bg-opacity-60 rounded-full p-2 cursor-pointer">
                  <Camera className="h-5 w-5" />
                  <input type="file" id="avatar" name="avatar" onChange={handleFileChange} className="hidden" />
                </label>
              </div>
              <div className="space-y-4 mt-20">
                <div>
                  <label htmlFor="first_name" className="block text-sm font-medium text-gray-400">First Name</label>
                  <input
                    type="text"
                    id="first_name"
                    name="first_name"
                    value={formData?.first_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="last_name" className="block text-sm font-medium text-gray-400">Last Name</label>
                  <input
                    type="text"
                    id="last_name"
                    name="last_name"
                    value={formData?.last_name}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-400">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData?.username}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-400">Bio</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows="3"
                    value={formData?.bio}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  ></textarea>
                </div>
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-400">Location</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData?.location}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-400">Website</label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData?.website}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
                <div>
                  <label htmlFor="birth_date" className="block text-sm font-medium text-gray-400">Birth Date</label>
                  <input
                    type="date"
                    id="birth_date"
                    name="birth_date"
                    value={formData?.birth_date}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                  />
                </div>
              </div>
            </form>
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
              <div className="bg-gray-900 rounded-2xl p-4 mb-4">
              <h2 className="text-xl font-bold mb-4">Profile tips</h2>
              <ul className="list-disc list-inside text-gray-400 space-y-2">
                <li>Add a profile picture to help people recognize you</li>
                <li>Write a bio to tell others about yourself</li>
                <li>Include your location to connect with local users</li>
                <li>Add your website to share more about your work or interests</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    );
  }
