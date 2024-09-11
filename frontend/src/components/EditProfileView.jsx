import React, { useState } from 'react';
import { Network, X, Home, Bell, Mail, User, Search, MoreHorizontal, ArrowLeft, Camera } from 'lucide-react';

const ConnectXLogo = () => (
  <div className="relative w-12 h-12">
    <Network className="w-12 h-12 text-primary absolute" />
    <X className="w-10 h-10 text-primary absolute top-1 left-1" />
  </div>
);

const NavItem = ({ Icon, text }) => (
  <a href="#" className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-full">
    <Icon className="h-7 w-7" />
    <span className="text-xl hidden xl:inline">{text}</span>
  </a>
);

export default function EditProfileView() {
  const [profile, setProfile] = useState({
    name: "Jane Doe",
    handle: "janedoe",
    bio: "Software engineer | Open source enthusiast | Coffee lover",
    location: "San Francisco, CA",
    website: "https://janedoe.com",
    birthDate: "1990-01-01",
    coverImage: "/placeholder.svg?height=200&width=600",
    avatar: "/placeholder.svg?height=150&width=150",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({
      ...prevProfile,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated profile:', profile);
    // Here you would typically send the updated profile to your backend
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
            <img src={profile.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="hidden xl:block">
              <h3 className="font-bold">{profile.name}</h3>
              <p className="text-gray-500">@{profile.handle}</p>
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
              <img src={profile.coverImage} alt="Cover" className="w-full h-48 object-cover" />
              <label htmlFor="coverImage" className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 cursor-pointer">
                <Camera className="h-5 w-5" />
                <input type="file" id="coverImage" className="hidden" />
              </label>
            </div>
            <div className="relative mb-6">
              <img src={profile.avatar} alt={profile.name} className="w-32 h-32 rounded-full border-4 border-black absolute -top-16 left-4" />
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
                  value={profile.name}
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
                  value={profile.handle}
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
                  value={profile.bio}
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
                  value={profile.location}
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
                  value={profile.website}
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
                  value={profile.birthDate}
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

