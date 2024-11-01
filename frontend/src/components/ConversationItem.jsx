import React from 'react';
import useProfile from '../hooks/useProfile';


export default function ConversationItem ({ id, sender, receiver, receiver_avatar, sender_avatar, sent_at, isActive, onClick }) {

    const { profile } = useProfile(receiver);

    const name = profile?.first_name + " " + profile?.last_name

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
      };

    function userClick() {
        onClick(profile);
        console.log(profile)
    }

    return (
        <div 
            id={profile?.id}
            key={profile?.id}
            className={`flex items-center space-x-3 p-3 hover:bg-gray-800 cursor-pointer ${isActive ? 'bg-gray-800' : ''}`}
            onClick={userClick}
        >
            <img src={receiver_avatar} alt={sender} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
            <div className="flex justify-between">
                <h3 className="font-bold">{name}</h3>
                <span className="text-sm text-gray-500">{formatDate(sent_at)}</span>
            </div>
            <p className="text-gray-500">@{receiver}</p>
            </div>
        </div>
    );
}

