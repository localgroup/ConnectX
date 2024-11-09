import React from 'react';
import { useAuth } from '../contexts/useAuth';


export default function MessageBubble ({ message_body, message_media, sender, receiver, sent_at, is_read }) {
    
    const { user } = useAuth();
    
    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };
        
    return (
        <div className={`flex ${user?.username === sender ? 'justify-end' : 'justify-start'} mb-4`}>
            <div className={`max-w-xs ${user?.username === sender ? 'bg-primary text-white' : 'bg-gray-800 text-white'} rounded-lg p-3`}>
                <p>{message_body}</p>
                {message_media && (
                    <img 
                        src={message_media} 
                        alt="Message media" 
                        className="w-full h-auto mt-2 rounded-lg" 
                    />
                )}
                <p className="text-xs text-gray-400 mt-1">{formatDate(sent_at)}</p>
            </div>
        </div>
    );
}