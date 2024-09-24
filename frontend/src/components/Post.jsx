import React, { useState, useEffect } from 'react';
import { MessageCircle, Heart, Share } from 'lucide-react';
import api from '../api';
import useLikes from '../hooks/useLikes';


export default function Post({ avatar, username, handle, content, media, created_at, commentsCount, postId }) {
    const { isLiked, likesCount, loading, error, toggleLike } = useLikes(postId);
    
    const [name, setName] = useState(null);
    
    const date = new Date(created_at);
    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    // Get the full name of the user.
    useEffect(() => {
      const getName = async () => {
        try {
          const response = await api.get(`/api/${username}/`);
          let fullName = response.data.first_name + " " + response.data.last_name;
          setName(fullName);
        } catch (err) {
          console.error('Error fetching user details:', err.response?.data || err.message);
        }
      };
      getName();
    }, [username]);

    const handleLikeClick = async () => {
      await toggleLike();
    };

    return (
      <div className="border-b border-gray-800 p-4 hover:bg-gray-900 transition duration-200">
        <div className="flex space-x-3">
          <img src={avatar} alt={username} className="w-12 h-12 rounded-full" />
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <h3 className="font-bold">{name}</h3>
              <span className="text-gray-500">@{handle}</span>
            </div>
            <p className="mt-2 mb-3">{content}</p>
            {media && (
              <img src={media} alt="Post media" className="w-full mb-3" />
            )}
            <p className="text-gray-500 text-sm">{formattedDate}</p>
            <div className="flex justify-between text-gray-500">
              <button className="flex items-center space-x-2 hover:text-primary">
                <MessageCircle className="h-5 w-5" />
                <span>{commentsCount}</span>
              </button>
              <button 
                onClick={handleLikeClick} 
                className="flex items-center space-x-2 hover:text-red-500"
                disabled={loading}
              >
                <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500' : ''}`} />
                <span>{likesCount}</span>
              </button>
              <button className="flex items-center space-x-2 hover:text-primary">
                <Share className="h-5 w-5" />
              </button>
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    );
  }