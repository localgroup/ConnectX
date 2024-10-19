import React from 'react';
import { MessageCircle, Heart, Share, User } from 'lucide-react';
import useProfile from '../hooks/useProfile';
import { useNavigate } from 'react-router-dom';


export default function SearchResult ({ type, id, content, bio, author, authorUser, avatar, handle, media, timestamp, likes, comments }) {
    
    const { profile: searchPostProfile } = useProfile(author);
    const { profile: searchPeopleProfile } = useProfile(authorUser);
    const navigate = useNavigate(); 
    const postId = id;

    function handleDetailPost() {
        navigate(`/posts/${postId}/`);
    }

    function getAuthorProfile() {
        navigate(`/${handle}/`);
    }

    return (
        <div className="cursor-pointer border-b border-gray-800 p-4 hover:bg-gray-900 transition duration-200">
        {type === 'post' ? (
            <div onClick={handleDetailPost} >
                <div className="flex items-center space-x-2 mb-2">
                    <img src={avatar} alt={author} className="w-10 h-10 rounded-full" />
                    <div>
                    <span className="font-bold">{searchPostProfile?.first_name + " " + searchPostProfile?.last_name}</span>
                    <span className="text-gray-500 ml-2">@{handle}</span>
                    <span className="text-gray-500 ml-2">· {timestamp}</span>
                    </div>
                </div>
            <div>
                <p className="mb-2">{content}</p>
                {media && <img src={media} alt={author} className="w-full mb-3" /> }
            </div>
            <div className="flex justify-between text-gray-500">
                <button className="flex items-center space-x-2 hover:text-primary">
                <MessageCircle className="h-5 w-5" />
                <span>{comments}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-red-500">
                <Heart className="h-5 w-5" />
                <span>{likes}</span>
                </button>
                <button className="flex items-center space-x-2 hover:text-primary">
                <Share className="h-5 w-5" />
                </button>
            </div>
            </div>
        ) : (
            <div onClick={getAuthorProfile} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                    <img src={avatar} alt={author} className="w-12 h-12 rounded-full" />
                    <div>
                    <h3 className="font-bold">{searchPeopleProfile?.first_name + " " + searchPeopleProfile?.last_name}</h3>
                    <p className="text-white-500">{bio}</p>
                    <p className="text-gray-500">@{handle}</p>
                    </div>
                </div>
                <button className="px-4 py-2 bg-white text-black rounded-full font-bold hover:bg-gray-200">
                    <User />
                </button>
            </div>
        )}
        </div>
    );
}