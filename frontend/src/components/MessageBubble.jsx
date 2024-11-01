import React from 'react';


export default function MessageBubble ({ message_body, message_media, sent_at, is_read }) {

    const formatDate = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
      };

    return (
        <div>
            <div className={`flex ${sent_at ? 'justify-end' : 'justify-start'} mb-4`}>
                <div className={`max-w-xs ${sent_at ? 'bg-primary text-white' : 'bg-gray-800 text-white'} rounded-lg p-3`}>
                    <p>{message_body}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(sent_at)}</p>
                    {/* <p className="text-xs text-gray-400 mt-1">{is_read}</p> */}
                </div>
            </div>
            <div className='flex justify-end mb-4'>
                {message_media && <img src={message_media} className="w-2/3 h-2/3 full" />}
            </div>
        </div>
    );
}