import React, { useState, useEffect } from 'react';
import { X, Home, Bell, Mail, User, Search, LogOutIcon, ArrowLeft } from 'lucide-react';
import useProfile from '../hooks/useProfile';
import useFollow from '../hooks/useFollow';
import { useParams, useNavigate } from 'react-router-dom';


export default function FollowerItem({ handle, bio, isFollowing }) { 
  const { username } = useParams();
  const { profile } = useProfile(handle);

  const userProfile = {
    name: profile?.first_name + " " + profile?.last_name,
    avatar: profile?.avatar || '/placeholder.svg?height=150&width=150',
    };

  const { follow, followData, getFollow, makeFollow, makeUnfollow } = useFollow(username);
  const [following, setFollowing] = useState(isFollowing);
  
  function handleFollow() {
    if (following) {
      makeUnfollow();
      setFollowing(false);
    } else {
      makeFollow();
      setFollowing(true);
    }
  }
  
  return (
    <div className="flex items-center justify-between py-4 border-b border-gray-800">
      <div className="flex items-center space-x-3">
        <img src={ userProfile?.avatar || "/placeholder.svg?height=48&width=48"} alt={name} className="w-12 h-12 rounded-full" />
        <div>
          <h3 className="font-bold">{userProfile?.name}</h3>
          <p className="text-gray-500">@{handle}</p>
          <p className="text-sm mt-1">{bio}</p>
        </div>
      </div>
      <button 
        onClick={handleFollow}
        className={`px-4 py-2 rounded-full font-bold ${
          isFollowing 
            ? 'bg-transparent text-white border border-gray-600 hover:border-red-500 hover:text-red-500' 
            : 'bg-white text-black hover:bg-gray-200'
        }`}
      >
        {following ? 'Following' : 'Follow'}
      </button>
    </div>
  );
}