import React, { useMemo, useState } from 'react';
import ConversationItem from './ConversationItem';


export default function ConversationList({ conversations, activeConversation, setActiveConversation, onClick }) {


    const uniqueConversations = useMemo(() => {
        // Check if conversations is an array and not empty
        if (!Array.isArray(conversations) || conversations?.length === 0) {
          return [];
        }
    
        // First sort by sent_at to ensure we keep the most recent conversations
        const sortedConversations = [...conversations].sort((a, b) => 
          new Date(b.sent_at) - new Date(a.sent_at)
        );
    
        // Use reduce to create an object with unique receivers
        const uniqueConvs = sortedConversations.reduce((acc, current) => {
          if (!acc[current.receiver]) {
            acc[current.receiver] = current;
          }
          return acc;
        }, {});
    
        // Convert the object back to an array
        return Object.values(uniqueConvs);
      }, [conversations]);
    
      // If there are no conversations, you might want to render a message
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
              onClick={ onClick}
            />
          ))}
        </div>
      );
    }

