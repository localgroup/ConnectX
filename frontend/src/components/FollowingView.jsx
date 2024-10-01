import React, { useState, useEffect } from 'react';
import { X, Home, Bell, Mail, User, Search, LogOutIcon, ArrowLeft } from 'lucide-react';
import ConnectXLogo from './ConnectXLogo';
import NavItem from './NavItem';
import useProfile from '../hooks/useProfile';
import useFollow from '../hooks/useFollow';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import useFollower from '../hooks/useFollower';
import FollowerItem from '../components/FollowerItem';


export default function FollowingView() {
    const { username } = useParams();
    const { user } = useAuth();

    const navigate = useNavigate(); 
    function arrowLeft() {
      // Redirect to the profile page
      navigate(`/${username}/`);
    } 

    const { profile, loading } = useProfile(user?.username);
    const { profile: targetProfile } = useProfile(username);

    const { follower, followerData, getFollower } = useFollower(username);
    const { follow, followData, getFollow, makeFollow, makeUnfollow } = useFollow(username);

    useEffect(() => {
      getFollower();
    }, [username]);

    useEffect(() => {
      getFollow();
    }, []);
    

    if (loading) return <div>Loading...</div>;

    const userProfile = {
      name: profile?.first_name + " " + targetProfile?.last_name,
      handle: profile?.username,
      avatar: profile?.avatar || '/placeholder.svg?height=150&width=150',
      };

      const userTargetProfile = {
        name: targetProfile?.first_name + " " + targetProfile?.last_name,
        handle: targetProfile?.username,
        avatar: targetProfile?.avatar || '/placeholder.svg?height=150&width=150',
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
              <img src={userProfile?.avatar} alt="Profile" className="w-10 h-10 rounded-full" />
              <div className="hidden xl:block">
                <h3 className="font-bold">{userProfile?.name}</h3>
                <p className="text-gray-500">@{userProfile?.handle}</p>
              </div>
            </div>
          </aside>

        {/* Main Content */}
        <main className="flex-1 border-x border-gray-800">
            <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center space-x-4">
              <div className="flex items-center space-x-4">
              <button onClick={arrowLeft} className="rounded-full p-2 hover:bg-gray-800">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">{userTargetProfile?.name}</h1>
                <p className="text-sm text-gray-500">@{userTargetProfile?.handle}</p>
              </div>
            </div>
          </header>
          <nav className="flex border-b border-gray-800">
            <a href="" className="flex-1 text-center py-4 hover:bg-gray-900">Following</a>
            </nav>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{followerData?.following_count} Following</h2>
            <div className="space-y-4">
              {followerData?.following?.map((followings) => (
                <FollowerItem
                  key={followings?.id}
                  handle={followings?.username}
                  bio={followings?.bio}
                  isFollowing={followings?.is_following}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
            <div className="bg-gray-900 rounded-2xl p-4 mb-4">
              <h2 className="text-xl font-bold mb-4">You might like</h2>
            {/* Add suggested users to follow here */}
          </div>
        </aside>
      </div>
    </div>
  );
}

