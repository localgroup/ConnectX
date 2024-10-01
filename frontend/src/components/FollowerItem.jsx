import React from 'react';
import useProfile from '../hooks/useProfile';
import { User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function FollowerItem({ handle, bio, isFollowing }) { 
  const { profile } = useProfile(handle);
  const navigate = useNavigate(); 

  const userProfile = {
    name: profile?.first_name + " " + profile?.last_name,
    avatar: profile?.avatar || '/placeholder.svg?height=150&width=150',
    };
  
  function handleFollow() {
    navigate(`/${handle}/`);
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
        className='px-4 py-2 rounded-full font-bold bg-transparent text-white border border-green-600 hover:border-blue-500 hover:text-yellow-500'
      >
        <User />
      </button>
    </div>
  );
}