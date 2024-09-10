import React from 'react';
import { Brackets, X, Home, Bell, Mail, User, Search, MoreHorizontal, MessageCircle, Repeat2, Heart, Share, ArrowLeft, MapPin, Calendar, Link } from 'lucide-react';
import { useState, useEffect } from 'react';
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


export default function ProfileView() {

    const [user, setUser] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getProfile();
    }, []);

    function getProfile() {
        api
          .get('/api/user/profile/')
          .then((res) => {
            setUser(res.data);
            setLoading(false);
          })
          .catch((error) => {
            console.error(error);
            setLoading(false);
          });
      }
    
      if (loading) {
        return <div>Loading...</div>;
      }

  const userProfile = {
    name: user.username,
    handle: user.username,
    bio: "Software engineer | Open source enthusiast | Coffee lover",
    location: "San Francisco, CA",
    website: "https://janedoe.com",
    joinDate: "September 2020",
    following: 456,
    followers: 1234,
    coverImage: "/placeholder.svg?height=200&width=600",
    avatar: "/placeholder.svg?height=150&width=150",
  };

  const posts = [
    { username: userProfile.name, handle: userProfile.handle, content: "Just launched a new open-source project! Check it out and let me know what you think. #OpenSource #Coding", likes: 89, comments: 23, reposts: 12 },
    { username: userProfile.name, handle: userProfile.handle, content: "Excited to speak at the upcoming tech conference next month! Who else is attending? #TechConference #PublicSpeaking", likes: 134, comments: 45, reposts: 28 },
    { username: userProfile.name, handle: userProfile.handle, content: "Coffee break ☕ - the perfect time to brainstorm new ideas. What's your go-to drink for productivity?", likes: 56, comments: 17, reposts: 3 },
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
            <img src={userProfile.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="hidden xl:block">
              <h3 className="font-bold">{userProfile.name}</h3>
              <p className="text-gray-500">@{userProfile.handle}</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 border-x border-gray-800 max-w-2xl">
          <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center space-x-4">
            <button className="rounded-full p-2 hover:bg-gray-800">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-xl font-bold">{userProfile.name}</h1>
              <p className="text-sm text-gray-500">{posts.length} posts</p>
            </div>
          </header>
          <div>
            <div className="h-48 bg-gray-800 relative">
              <img src={userProfile.coverImage} alt="Cover" className="w-full h-full object-cover" />
              <img src={userProfile.avatar} alt={userProfile.name} className="absolute -bottom-16 left-4 w-32 h-32 rounded-full border-4 border-black" />
            </div>
            <div className="mt-20 px-4">
              <div className="flex justify-end mb-4">
                <button className="border border-gray-600 text-white rounded-full px-4 py-2 font-bold hover:bg-gray-900">
                  Edit profile
                </button>
              </div>
              <h2 className="text-2xl font-bold">{userProfile.name}</h2>
              <p className="text-gray-500">@{userProfile.handle}</p>
              <p className="mt-3">{userProfile.bio}</p>
              <div className="flex flex-wrap mt-3 text-gray-500">
                <span className="flex items-center mr-4">
                  <MapPin className="h-5 w-5 mr-1" />
                  {userProfile.location}
                </span>
                <span className="flex items-center mr-4">
                  <Link className="h-5 w-5 mr-1" />
                  <a href={userProfile.website} className="text-primary hover:underline">{userProfile.website}</a>
                </span>
                <span className="flex items-center">
                  <Calendar className="h-5 w-5 mr-1" />
                  Joined {userProfile.joinDate}
                </span>
              </div>
              <div className="flex mt-3 space-x-4">
                <span><strong>{userProfile.following}</strong> <span className="text-gray-500">Following</span></span>
                <span><strong>{userProfile.followers}</strong> <span className="text-gray-500">Followers</span></span>
              </div>
            </div>
            <nav className="flex border-b border-gray-800 mt-4">
              <a href="#" className="flex-1 text-center py-4 hover:bg-gray-900 border-b-2 border-primary font-bold">Posts</a>
              <a href="#" className="flex-1 text-center py-4 hover:bg-gray-900 text-gray-500">Replies</a>
              <a href="#" className="flex-1 text-center py-4 hover:bg-gray-900 text-gray-500">Media</a>
              <a href="#" className="flex-1 text-center py-4 hover:bg-gray-900 text-gray-500">Likes</a>
            </nav>
            <div>
              {posts.map((post, index) => (
                <Post key={index} {...post} />
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
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
