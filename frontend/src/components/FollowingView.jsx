import React from 'react';
import { Network, X, Home, Bell, Mail, User, Search, MoreHorizontal, ArrowLeft } from 'lucide-react';

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

const FollowerItem = ({ name, handle, bio, isFollowing }) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-800">
    <div className="flex items-center space-x-3">
      <img src="/placeholder.svg?height=48&width=48" alt={name} className="w-12 h-12 rounded-full" />
      <div>
        <h3 className="font-bold">{name}</h3>
        <p className="text-gray-500">@{handle}</p>
        <p className="text-sm mt-1">{bio}</p>
      </div>
    </div>
    <button 
      className={`px-4 py-2 rounded-full font-bold ${
        isFollowing 
          ? 'bg-transparent text-white border border-gray-600 hover:border-red-500 hover:text-red-500' 
          : 'bg-white text-black hover:bg-gray-200'
      }`}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </button>
  </div>
);

function App() {
  const user = {
    name: "Jane Doe",
    handle: "janedoe",
    followersCount: 1234
  };

  const followers = [
    { name: "John Smith", handle: "johnsmith", bio: "Software Developer | AI Enthusiast", isFollowing: true },
    { name: "Alice Johnson", handle: "alicej", bio: "UX Designer | Coffee Lover", isFollowing: false },
    { name: "Bob Wilson", handle: "bobw", bio: "Entrepreneur | Tech Blogger", isFollowing: true },
    { name: "Emma Brown", handle: "emmab", bio: "Data Scientist | Machine Learning Expert", isFollowing: false },
    { name: "David Lee", handle: "davidl", bio: "Full Stack Developer | Open Source Contributor", isFollowing: true },
  ];

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
            <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="hidden xl:block">
              <h3 className="font-bold">Your Name</h3>
              <p className="text-gray-500">@yourhandle</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 border-x border-gray-800 max-w-2xl">
          <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800">
            <div className="flex items-center space-x-4">
              <button className="rounded-full p-2 hover:bg-gray-800">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">{user.name}</h1>
                <p className="text-sm text-gray-500">@{user.handle}</p>
              </div>
            </div>
          </header>
          <nav className="flex border-b border-gray-800">
            <a href="#" className="flex-1 text-center py-4 hover:bg-gray-900">Followers</a>
            <a href="#" className="flex-1 text-center py-4 hover:bg-gray-900 text-gray-500">Following</a>
          </nav>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{user.followersCount} Followers</h2>
            <div className="space-y-4">
              {followers.map((follower, index) => (
                <FollowerItem key={index} {...follower} />
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">You might like</h2>
            {/* Add suggested users to follow here */}
          </div>
        </aside>
      </div>
    </div>
  );
}

export default App;