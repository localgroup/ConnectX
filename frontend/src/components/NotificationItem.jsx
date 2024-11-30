import React from 'react';
import {  Heart, Repeat2, MessageCircle, UserPlus } from 'lucide-react';
import { useParams, useNavigate } from 'react-router-dom';



export default function NotificationItem ({ type, is_read, sender_avatar, message, postId, content, body, user, timestamp }) {
    const icons = {
      like: <Heart className="h-5 w-5 text-red-500" />,
      repost: <Repeat2 className="h-5 w-5 text-green-500" />,
      reply: <MessageCircle className="h-5 w-5 text-primary" />,
      follow: <UserPlus className="h-5 w-5 text-primary" />,
    };

    const navigate = useNavigate(); 

    const postRedirect = () => {
      navigate(`/posts/${postId}/`);
    };

    const date = new Date(timestamp);
    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });
  
    return (
      <div className="flex items-start space-x-4 p-4 hover:bg-gray-900 transition duration-200 border-b border-gray-800">
        <div className="bg-gray-800 rounded-full p-2">
          {icons[type]}
        </div>
        <div onClick={postRedirect} className="flex-1">
          <div className="flex items-center space-x-2">
            <img src={sender_avatar || "/placeholder.svg?height=40&width=40"} alt={user} className="w-10 h-10 rounded-full" />
            <span className="font-bold">{body}</span>
          </div>
          
          <p className="mt-1">{message}</p>
          <p className="text-sm text-gray-500 mt-1">{formattedDate}</p>
        </div>
      </div>
    );
  };