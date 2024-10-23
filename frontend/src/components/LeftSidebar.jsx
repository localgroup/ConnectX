import React, { useState } from 'react';
import { X, Home, Bell, Mail, User, Search, LogOutIcon } from 'lucide-react';
import ConnectXLogo from './ConnectXLogo';
import NavItem from './NavItem';
import useProfile from '../hooks/useProfile';
import { useAuth } from '../contexts/useAuth';


export default function LeftSidebar({ expandButton }) {

    const { user } = useAuth(); 
    const { profile, loading } = useProfile(user?.username);

    if (loading) return <div>Loading...</div>;

    return (
          <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-6 pl-12">
            <div>
              <ConnectXLogo />
              <nav className="mt-8 space-y-4">
                <NavItem Icon={Home} text="Home" to="/home/" />
                <NavItem Icon={Search} text="Explore" to="/search/" />
                <NavItem Icon={Bell} text="Notifications" />
                <NavItem Icon={Mail} text="Messages" />
                <NavItem Icon={User} text="Profile" to={`/${user?.username}`} />
                <NavItem Icon={LogOutIcon} text="LogOut" to="/logout/" />
              </nav>
              <button onClick={expandButton} className="mt-8 bg-primary text-white rounded-full py-3 px-8 font-bold w-full hidden xl:block hover:bg-primary/90 transition duration-200">
                Post
              </button>
              <button className="mt-8 bg-primary text-white rounded-full p-3 font-bold xl:hidden hover:bg-primary/90 transition duration-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4 flex items-center space-x-3">
              <img src={profile?.avatar || '/placeholder.svg?height=150&width=150'} alt="Profile" className="w-10 h-10 rounded-full" />
              <div className="hidden xl:block">
                {profile ? (
                  <>
                    <h3 className="font-bold">{profile?.first_name + " " + profile?.last_name}</h3>
                    <p className="text-gray-500">@{profile?.username}</p>
                  </>
                ) : (
                  <p>Loading user...</p>
                )}
              </div>
            </div>
          </aside>
    );
  }
