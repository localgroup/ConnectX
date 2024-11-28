import React from 'react';
import {  Heart, Repeat2, MessageCircle, UserPlus } from 'lucide-react';



export default function NotificationItem ({ type, is_read, message, content, user, timestamp }) {
    const icons = {
      like: <Heart className="h-5 w-5 text-red-500" />,
      repost: <Repeat2 className="h-5 w-5 text-green-500" />,
      reply: <MessageCircle className="h-5 w-5 text-primary" />,
      follow: <UserPlus className="h-5 w-5 text-primary" />,
    };
  
    return (
      <div className="flex items-start space-x-4 p-4 hover:bg-gray-900 transition duration-200 border-b border-gray-800">
        <div className="bg-gray-800 rounded-full p-2">
          {icons[type]}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <img src="/placeholder.svg?height=40&width=40" alt={user} className="w-10 h-10 rounded-full" />
            <span className="font-bold">{user}</span>
          </div>
          <p className="mt-1">{message}</p>
          <p className="text-sm text-gray-500 mt-1">{timestamp}</p>
        </div>
      </div>
    );
  };