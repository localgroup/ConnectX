import React from 'react';
import { X, Home, Bell, Mail, User, Search, MoreHorizontal } from 'lucide-react';
import ConnectXLogo from './ConnectXLogo';
import NavItem from './NavItem';
import Post from './Post';
import useProfile from '../hooks/useProfile';


const TrendingTopic = ({ topic, posts }) => (
  <div className="p-3 hover:bg-gray-800 transition duration-200">
    <h4 className="font-bold">{topic}</h4>
    <p className="text-gray-500 text-sm">{posts} posts</p>
  </div>
);

export default function HomeView() {

    const username = localStorage.getItem('username');
    const { profile, loading, error } = useProfile(username);

    if (loading) return <div>Loading...</div>;

    const posts = [
      { username: "John Doe", handle: "johndoe", content: "Just had an amazing breakthrough with my latest project! #coding #success", likes: 45, comments: 12, reposts: 8 },
    ];

    const trendingTopics = [
      { topic: "#coding", posts: "12.5K" },
    ];

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-6 pl-12">
            <div>
              <ConnectXLogo />
              <nav className="mt-8 space-y-4">
                <NavItem Icon={Home} text="Home" />
                <NavItem Icon={Search} text="Explore" />
                <NavItem Icon={Bell} text="Notifications" />
                <NavItem Icon={Mail} text="Messages" />
                <NavItem Icon={User} text="Profile" to={`/${profile.username}`} />
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
            <img src={profile.avatar || '/placeholder.svg?height=150&width=150'} alt="Profile" className="w-10 h-10 rounded-full" />
              <div className="hidden xl:block">
                {profile ? (
                  <>
                    <h3 className="font-bold">{profile.first_name + " " + profile.last_name}</h3>
                    <p className="text-gray-500">@{profile.username}</p>
                  </>
                ) : (
                  <p>Loading user...</p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 border-x border-gray-800">
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
