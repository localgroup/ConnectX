import React, { useState, useEffect } from 'react';
import { X, Home, Bell, Mail, User, Search, LogOutIcon, MapPin, Calendar, Link } from 'lucide-react';
import ConnectXLogo from './ConnectXLogo';
import NavItem from './NavItem';
import Post from './Post';
import api from '../api';
import useProfile from '../hooks/useProfile';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { useAuth } from '../contexts/useAuth';


const TrendingTopic = ({ topic, posts }) => (
  <div className="p-3 hover:bg-gray-800 transition duration-200">
    <h4 className="font-bold">{topic}</h4>
    <p className="text-gray-500 text-sm">{posts} posts</p>
  </div>
);

export default function ProfileView() {
    const { username } = useParams();
    const { user } = useAuth();

    const navigate = useNavigate();  
    const { profile, loading } = useProfile(username);

    const [posts, setPosts] = useState([]);

    useEffect(() => {
      const fetchProfileData = async () => {
        try {
          const response = await api.get(`/api/${username}/`);  // Fetch the profile along with posts
          console.log(response.data.posts);
          setPosts(response.data.posts);  // The posts come from the backend response
        } catch (err) {
          console.error('Error fetching profile and posts:', err.response?.data || err.message);
        }
      };
      fetchProfileData();
    }, [username]);
    

    if (loading) return <div>Loading...</div>;

    const userProfile = {
      name: profile.first_name + " " + profile.last_name,
      handle: profile.username,
      bio: profile.bio || "",
      location: profile.location || "",
      website: profile.website || "",
      birth_date: profile.birth_date || "",
      coverImage: profile.cover_image || "/placeholder.svg?height=200&width=600",
      avatar: profile.avatar || '/placeholder.svg?height=150&width=150',
      joinDate: profile.date_joined ? format(new Date(profile.date_joined), 'MMMM yyyy') : "",
      following: 456,
      followers: 1234,
    };

    const trendingTopics = [
      { topic: "#coding", posts: "12.5K" },
    ];

    const handleEditProfile = () => {
      navigate(`/${user?.username}/update-profile/`);
    };

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-6 pl-12">
            <div>
              <ConnectXLogo />
              <nav className="mt-8 space-y-4">
                <NavItem Icon={Home} text="Home" to="/home/" />
                <NavItem Icon={Search} text="Explore" />
                <NavItem Icon={Bell} text="Notifications" />
                <NavItem Icon={Mail} text="Messages" />
                <NavItem Icon={User} text="Profile" to={`/${user?.username}`} />
                <NavItem Icon={LogOutIcon} text="LogOut" to="/logout/" />
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
          <main className="flex-1 border-x border-gray-800">
            <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center space-x-4">
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
                  {user && user.username === username && (
                    <button onClick={handleEditProfile} className="border border-gray-600 text-white rounded-full px-4 py-2 font-bold hover:bg-gray-900">
                      Edit profile
                    </button>
                  )}
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
                <div className="flex mt-4">
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-bold">{userProfile.following}</h3>
                    <p className="text-gray-500">Following</p>
                  </div>
                  <div className="flex-1 text-center">
                    <h3 className="text-lg font-bold">{userProfile.followers}</h3>
                    <p className="text-gray-500">Followers</p>
                  </div>
                </div>
              </div>
              <div className="mt-8">
              {posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((post) => (
                      <Post
                      key={post.id}
                      avatar={post.author_avatar}
                      username={post.author}
                      handle={post.author}
                      content={post.body}
                      media={post.media}
                      created_at={post.created_at}
                      likes={post.number_of_likes}
                      comments={post.number_of_comments}
                  />
                ))}
              </div>
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
