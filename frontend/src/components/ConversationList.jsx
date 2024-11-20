import React, { useMemo } from 'react';
import ConversationItem from './ConversationItem';

export default function ConversationList({ conversations, activeConversation, setActiveConversation, onClick }) {
    const uniqueConversations = useMemo(() => {
        // Check if conversations is an array and not empty
        if (!Array.isArray(conversations) || conversations?.length === 0) {
          return [];
        }
    
        // Sort conversations by sent_at in descending order
        const sortedConversations = [...conversations].sort((a, b) => 
          new Date(b.sent_at) - new Date(a.sent_at)
        );
    
        // Use a Set to track unique receivers
        const seenReceivers = new Set();
        const uniqueConvs = [];
    
        // Iterate through sorted conversations
        for (const conv of sortedConversations) {
          // Determine the other party in the conversation
          const otherParty = conv.sender === 'current_user' ? conv.receiver : conv.sender;
          
          // If this is the first time seeing this receiver, add the conversation
          if (!seenReceivers.has(otherParty)) {
            uniqueConvs.push(conv);
            seenReceivers.add(otherParty);
          }
        }
    
        return uniqueConvs;
      }, [conversations]);
    
      if (uniqueConversations?.length === 0) {
        return <div>No conversations to display.</div>;
      }
    
      return (
        <div>
          {uniqueConversations.map(conv => (
            <ConversationItem
              key={conv?.id}
              id={conv?.id}
              sender={conv?.sender}
              receiver={conv?.receiver}
              receiver_avatar={conv?.receiver_avatar}
              sender_avatar={conv?.sender_avatar}
              sent_at={conv?.sent_at}
              isActive={activeConversation === conv?.id}
              onClick={onClick}
            />
          ))}
        </div>
      );
}