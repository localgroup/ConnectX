import React from 'react';
import { Trash2, Share, Heart, MessageCircle } from 'lucide-react';
import useProfile from '../hooks/useProfile';
import { useAuth } from '../contexts/useAuth';
import useUpdateComment from '../hooks/useUpdateComment';


export default function Comment({ commentId, author, content, created_at }) {

    const { deleteComment } = useUpdateComment(commentId);

    const { profile } = useProfile(author);
    const { user } = useAuth();

    const date = new Date(created_at);
    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    function handleDelete() {
      try {
        deleteComment();
        window.location.reload();
      } catch(err) {
        console.log(err)
      }
    };

    const { profile: commentAuthorProfile } = useProfile(author);
    const authorName = commentAuthorProfile?.first_name + " " + commentAuthorProfile?.last_name;

    return (
        <div key={commentId} className="border-b border-gray-800 p-4 hover:bg-gray-900 transition duration-200">
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
                      { author === user?.username && 
                        <button onClick={handleDelete} className="ml-auto flex items-center space-x-2 hover:text-primary">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      }
                    </div>
                </div>
            </div>
        </div>
    );
}