import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

export default function ChatContainer({ message }) {
    const bottomRef = useRef(null);
    const sortedMessages = [...message].sort((a, b) => new Date(b.sent_at) - new Date(a.sent_at));

    useEffect(() => {
        // Scroll to bottom when messages change or component mounts
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [message]);

    return (
        <div className="flex flex-col-reverse"> 
            <div ref={bottomRef} />
            
            {sortedMessages.map((message) => (
                <MessageBubble
                    key={message?.id}
                    message_body={message?.message_body}
                    message_media={message?.message_media}
                    sender={message?.sender}
                    receiver={message?.receiver}
                    sent_at={message?.sent_at}
                    is_read={message?.is_read}
                />
            ))}
        </div>
    );
}