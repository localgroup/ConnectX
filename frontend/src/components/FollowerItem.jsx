import React, { useState, useEffect } from 'react';
import { X, Home, Bell, Mail, User, Search, LogOutIcon, ArrowLeft } from 'lucide-react';
import ConnectXLogo from './ConnectXLogo';
import NavItem from './NavItem';
import useProfile from '../hooks/useProfile';
import useFollow from '../hooks/useFollow';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import useFollower from '../hooks/useFollower';


export default function FollowerItem({ name, handle, bio, isFollowing }) { 
  const { username } = useParams();

  const { follower, followerData, getFollower } = useFollower(username);
  const { follow, followData, getFollow, makeFollow, makeUnfollow } = useFollow(username);
    
  
  return (
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
}