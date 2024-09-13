import React, { useState, useEffect } from 'react';
import { X, Home, Bell, Mail, User, Search, MoreHorizontal, ArrowLeft, Camera } from 'lucide-react';
import ConnectXLogo from './ConnectXLogo';
import NavItem from './NavItem';
import useProfile from '../hooks/useProfile';
import useUpdateProfile from '../hooks/useUpdateProfile'; // Custom hook to fetch profile

export default function EditProfileView() {
  const { profile } = useProfile();
  const { updateProfile } = useUpdateProfile();
  const [formData, setFormData] = useState({
    name: "",
    handle: "",
    bio: "",
    location: "",
    website: "",
    birthDate: "",
    coverImage: "",
    avatar: ""
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.first_name + " " + profile.last_name,
        handle: profile.username,
        bio: profile.bio || "",
        location: profile.location || "",
        website: profile.website || "",
        birthDate: profile.birth_date || "",
        coverImage: profile.cover_image || "",
        avatar: profile.avatar || ""
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedProfile = await updateProfile(profile.username, formData);
      console.log("Profile updated successfully:", updatedProfile);
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto flex">
        {/* Left Sidebar */}
        <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-4">
          <div>
            <ConnectXLogo />
            <nav className="mt-8 space-y-4">
              <NavItem Icon={Home} text="Home" />
              <NavItem Icon={Search} text="Explore" />
              <NavItem Icon={Bell} text="Notifications" />
              <NavItem Icon={Mail} text="Messages" />
              <NavItem Icon={User} text="Profile" />
              <NavItem Icon={MoreHorizontal} text="More" />
            </nav>
            <button className="mt-8 bg-primary text-white rounded-full py-3 px-8 font-bold w-full hidden xl:block hover:bg-primary/90 transition duration-200">
              Post
            </button>
            <button className="mt-8 bg-primary text-white rounded-full p-3 font-bold xl:hidden hover:bg-primary/90 transition duration-200">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mb-4 flex items-center space-x-3">
            <img src={formData.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="hidden xl:block">
              <h3 className="font-bold">{formData.name}</h3>
              <p className="text-gray-500">@{formData.handle}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 border-x border-gray-800 max-w-2xl">
          <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="rounded-full p-2 hover:bg-gray-800">
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
              <img src={formData.coverImage} alt="Cover" className="w-full h-48 object-cover" />
              <label htmlFor="coverImage" className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 cursor-pointer">
                <Camera className="h-5 w-5" />
                <input type="file" id="coverImage" className="hidden" />
              </label>
            </div>
            <div className="relative mb-6">
              <img src={formData.avatar} alt={formData.name} className="w-32 h-32 rounded-full border-4 border-black absolute -top-16 left-4" />
              <label htmlFor="avatar" className="absolute top-0 left-24 bg-black bg-opacity-60 rounded-full p-2 cursor-pointer">
                <Camera className="h-5 w-5" />
                <input type="file" id="avatar" className="hidden" />
              </label>
            </div>
            <div className="space-y-4 mt-20">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-400">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="handle" className="block text-sm font-medium text-gray-400">Handle</label>
                <input
                  type="text"
                  id="handle"
                  name="handle"
                  value={formData.handle}
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
                  value={formData.bio}
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
                  value={formData.location}
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
                  value={formData.website}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </div>
              <div>
                <label htmlFor="birthDate" className="block text-sm font-medium text-gray-400">Birth date</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md bg-gray-800 border-gray-700 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                />
              </div>
            </div>
          </form>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
          <div className="bg-gray-900 rounded-2xl p-4">
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
