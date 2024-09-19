import React, { useState, useEffect } from 'react';
import { MessageCircle, Repeat2, Heart, Share } from 'lucide-react';


export default function Post ({ avatar, username, handle, content, media, created_at, likes, comments }) {

    const date = new Date(created_at);
    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });  

    return (
        <div className="border-b border-gray-800 p-4 hover:bg-gray-900 transition duration-200">
      <div className="flex space-x-3">
        <img src={avatar} alt={username} className="w-12 h-12 rounded-full" />
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-bold">{username}</h3>
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
              <span>{comments}</span>
            </button>
            {/* <button className="flex items-center space-x-2 hover:text-green-500">
              <Repeat2 className="h-5 w-5" />
              <span>{reposts}</span>
            </button> */}
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
    )
}
