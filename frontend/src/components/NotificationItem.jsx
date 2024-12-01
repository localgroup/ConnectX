import React from 'react';
import {  Heart, Mail, MessageCircle, UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';



export default function NotificationItem ({ is_read, sender_avatar, message, postId, username, content, notification_type, body, user, timestamp }) {
  const icons = {
    LIKE: <Heart className="h-5 w-5 text-red-500" />,
    MESSAGE: <Mail className="h-5 w-5 text-green-500" />,
    COMMENT: <MessageCircle className="h-5 w-5 text-primary" />,
    FOLLOW: <UserPlus className="h-5 w-5 text-primary" />,
    
};

    const navigate = useNavigate(); 

    const postRedirect = () => {
      switch (notification_type) {
          case "MESSAGE":
              navigate(`/messages/`);
              break;
          case "FOLLOW":
              navigate(`/${username}/`);
              break;
          default:
              navigate(`/posts/${postId}/`);
              break;
      }
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
      <div className="flex items-start space-x-4 p-4 hover:bg-gray-900 transition duration-200 border-b border-gray-800 cursor-pointer">
        <div className="bg-gray-800 rounded-full p-2">
          {icons[notification_type]}
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