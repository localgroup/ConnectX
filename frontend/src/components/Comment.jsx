import React from 'react';
import { Share, Heart, MessageCircle } from 'lucide-react';
import useProfile from '../hooks/useProfile';



export default function Comment({ key, author, content, created_at }) {

    const { profile } = useProfile(author);

    const date = new Date(created_at);
    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    const { profile: commentAuthorProfile } = useProfile(author);
    const authorName = commentAuthorProfile?.first_name + " " + commentAuthorProfile?.last_name;

    return (
        <div className="border-b border-gray-800 p-4 hover:bg-gray-900 transition duration-200">
            <div className="flex space-x-3">
                <img src={profile?.avatar || '/placeholder.svg?height=150&width=150'} alt={author} className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className="font-bold">{authorName}</h3>
                    <span className="text-gray-500">@{author}</span>
                  </div>
                  <p className="mt-2 mb-3">{content}</p>
                  <p className="text-gray-500 text-sm">{formattedDate}</p>
                    <div className="flex justify-between text-gray-500">
                      <button className="flex items-center space-x-2 hover:text-primary">
                        <MessageCircle className="h-5 w-5" />
                        <span></span>
                      </button>
                      <button 
                        
                        className="flex items-center space-x-2 hover:text-red-500"
                      >
                        <Heart className='h-5 w-5' />
                        <span>{}</span>
                      </button>
                      <button className="flex items-center space-x-2 hover:text-primary">
                        <Share className="h-5 w-5" />
                      </button>
                    </div>
                </div>
            </div>
        </div>
    );
}