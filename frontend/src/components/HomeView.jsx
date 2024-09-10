import React, { useState, useEffect } from 'react';
import { Brackets, X, Home, Bell, Mail, User, Search, MoreHorizontal, MessageCircle, Repeat2, Heart, Share } from 'lucide-react';
import api from "../api";

const ConnectXLogo = () => (
  <div className="relative w-12 h-12">
    <Brackets className="w-12 h-12 text-primary absolute" />
    <X className="w-10 h-10 text-primary absolute top-1 left-1" />
  </div>
);

const NavItem = ({ Icon, text }) => (
  <a href="#" className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-full">
    <Icon className="h-7 w-7" />
    <span className="text-xl hidden xl:inline">{text}</span>
  </a>
);

const Post = ({ username, handle, content, likes, comments, reposts }) => (
  <div className="border-b border-gray-800 p-4 hover:bg-gray-900 transition duration-200">
    <div className="flex space-x-3">
      <img src="/placeholder.svg?height=48&width=48" alt={username} className="w-12 h-12 rounded-full" />
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <h3 className="font-bold">{username}</h3>
          <span className="text-gray-500">@{handle}</span>
        </div>
        <p className="mt-2 mb-3">{content}</p>
        <div className="flex justify-between text-gray-500">
          <button className="flex items-center space-x-2 hover:text-primary">
            <MessageCircle className="h-5 w-5" />
            <span>{comments}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-green-500">
            <Repeat2 className="h-5 w-5" />
            <span>{reposts}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-red-500">
            <Heart className="h-5 w-5" />
            <span>{likes}</span>
          </button>
          <button className="flex items-center space-x-2 hover:text-primary">
            <Share className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const TrendingTopic = ({ topic, posts }) => (
  <div className="p-3 hover:bg-gray-800 transition duration-200">
    <h4 className="font-bold">{topic}</h4>
    <p className="text-gray-500 text-sm">{posts} posts</p>
  </div>
);

export default function HomeView() {

  const [user, setUser] = useState(null);  // Set initial state as null to handle loading

  useEffect(() => {
      getProfile();
  }, []);

  function getProfile() {
      api
        .get('/api/user/profile/')
        .then((res) => {
          console.log(res.data); 
          setUser(res.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }

  const posts = [
    { username: "John Doe", handle: "johndoe", content: "Just had an amazing breakthrough with my latest project! #coding #success", likes: 45, comments: 12, reposts: 8 },
  ];

  const trendingTopics = [
    { topic: "#coding", posts: "12.5K" },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto flex">
        {/* Left Sidebar */}
        <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-6">
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
              {user ? (
                <>
                  <h3 className="font-bold">{user.username}</h3>
                  <p className="text-gray-500">@{user.username}</p>
                </>
              ) : (
                <p>Loading user...</p>
              )}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 border-x border-gray-800 max-w-2xl">
          <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold">Home</h1>
          </header>
          <div className="p-4 border-b border-gray-800">
            <div className="flex space-x-4">
              <img src="/placeholder.svg?height=48&width=48" alt="Your Avatar" className="w-12 h-12 rounded-full" />
              <div className="flex-1">
                <textarea 
                  className="w-full bg-transparent text-xl placeholder-gray-500 focus:outline-none resize-none" 
                  placeholder="What's happening?"
                  rows="3"
                ></textarea>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-2 text-primary">
                    {/* Add post attachment options here */}
                  </div>
                  <button className="bg-primary text-white rounded-full px-4 py-2 font-bold hover:bg-primary/90 transition duration-200">
                    Post
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div>
            {posts.map((post, index) => (
              <Post key={index} {...post} />
            ))}
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
          <div className="bg-gray-900 rounded-2xl p-4 mb-4">
            <h2 className="text-xl font-bold mb-4">What's happening</h2>
            {trendingTopics.map((topic, index) => (
              <TrendingTopic key={index} {...topic} />
            ))}
            <a href="#" className="text-primary hover:underline block mt-4">Show more</a>
          </div>
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">Who to follow</h2>
            {/* Add suggested follows here */}
            <a href="#" className="text-primary hover:underline block mt-4">Show more</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
