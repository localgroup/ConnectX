import React from 'react';


export default function ConversationItem ({ id, sender, sender_avatar, sent_at, isActive, onClick }) {

    return (
        <div 
            className={`flex items-center space-x-3 p-3 hover:bg-gray-800 cursor-pointer ${isActive ? 'bg-gray-800' : ''}`}
            onClick={onClick}
        >
            <img src={sender_avatar} alt={sender} className="w-12 h-12 rounded-full" />
            <div className="flex-1">
            <div className="flex justify-between">
                <h3 className="font-bold">{sender}</h3>
                <span className="text-sm text-gray-500">{sent_at}</span>
            </div>
            <p className="text-gray-500">@{sender}</p>
            <p className="text-sm truncate">{sent_at}</p>
            </div>
        </div>
    );
}

