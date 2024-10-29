import React from 'react';


export default function MessageBubble ({ message_body, message_media, sent_at, is_read }) {

    return (
        <div className={`flex ${sent_at ? 'justify-end' : 'justify-start'} mb-4`}>
        <div className={`max-w-xs ${sent_at ? 'bg-primary text-white' : 'bg-gray-800 text-white'} rounded-lg p-3`}>
            <p>{message_body}</p>
            <p className="text-xs text-gray-400 mt-1">{sent_at}</p>
            <p className="text-xs text-gray-400 mt-1">{is_read}</p>
        </div>
        </div>
    );
}