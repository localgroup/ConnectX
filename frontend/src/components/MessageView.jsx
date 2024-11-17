import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import LeftSidebar from './LeftSidebar';
import useExpand from '../hooks/useExpand';
import useMessage from '../hooks/useMessage';
import useSearch from '../hooks/useSearch';
import MessagePeopleSearch from './MessagePeopleSearch';
import MessageForm from './MessageForm';
import ConversationList from './ConversationList';
import ChatContainer from './ChatContainer';
import { useAuth } from '../contexts/useAuth';
import useConversation from '../hooks/useConversation';



export default function MessageView() {
    const [activeConversation, setActiveConversation] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({ posts: [], profiles: [] });
    const [selectedUser, setSelectedUser] = useState(null);

    const { user } = useAuth();

    const { expanded, expandButton } = useExpand();
    const { message, getMessage, sendMessage } = useMessage(selectedUser?.username);
    const  { conversations, getConversation } = useConversation();
    const { search, postSearch } = useSearch();

    useEffect(() => {
      if (selectedUser?.username) {
          getMessage();
      }
    }, [selectedUser, getMessage]);

    useEffect(() => {
      getConversation();
    }, []);

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;
    
      try {
        const response = await postSearch({
          query: searchQuery.trim()
        });
        
        if (response?.results) {
          setSearchResults(response.results);
        }
      } catch (err) {
        console.error('Search error:', err);
      }
    };

    const handleUserSelect = (user) => {
      setSelectedUser(user);
      console.log(user);
      setActiveConversation(user);
    };

    const handleSendMessage = async (messageBody, messageMedia) => {
      if (!selectedUser || !messageBody.trim()) return;

      try {
        const formData = new FormData();
        formData.append('receiver', selectedUser?.id);
        formData.append('message_body', messageBody.trim());

        if (messageMedia) {
          formData.append('message_media', messageMedia);
        }

        // Debug: Log form data
        console.log('Form data:');
        for (let [key, value] of formData.entries()) {
          console.log(key, value);
        }

        await sendMessage(formData);
        getMessage();
      } catch (err) {
        console.error('Send message error:', err.response?.data || err);
      }
  };

    return (
      <div className="min-h-screen bg-black text-white">
    <div className="max-w-screen-xl mx-auto flex">
      {/* Left Sidebar */}
      <LeftSidebar expanded={expanded} expandButton={expandButton}/>

      {/* Main Content */}
      <main className="w-[calc(100%-48rem)] border-x border-gray-800">
        {/* Conversation List */}
        <div className="border-r border-gray-800">
          <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800">
            <h1 className="text-xl font-bold">Messages</h1>
          </header>
          <div className="overflow-y-auto h-[calc(100vh-80px)]">
            <ConversationList
              key={conversations?.id}
              conversations={conversations} 
              activeConversation={activeConversation} 
              setActiveConversation={setActiveConversation}
              onClick={handleUserSelect}
              loggedInUserId={user?.id}
            />
          </div>
        </div>
      </main>

      {/* Right Sidebar */}
      <aside className="w-[32rem] h-screen sticky top-0 hidden lg:block border-l border-gray-800"> 
        {selectedUser ? (
          <div className="h-full flex flex-col scrollbar-hide">
            {/* Header */}
            <header className="p-4 border-b border-gray-800">
              <h2 className="text-xl font-bold">Messages</h2>
            </header>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
              <div className="space-y-4">
                { message && <ChatContainer message={message} username={selectedUser?.username} /> }
              </div>
            </div>

            {/* Message Form at the bottom */}
            <div className="p-4 border-t border-gray-800">
              <MessageForm
                recipient={selectedUser}
                onSendMessage={handleSendMessage}
              />
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col p-4">
            <h2 className="text-2xl font-bold mb-4 text-center">Start a new message</h2>
            <form onSubmit={handleSearch} className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search people"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
              </div>
            </form>
            {searchResults && (
              <div className="flex-grow overflow-y-auto">
                <MessagePeopleSearch 
                  results={searchResults} 
                  onUserSelect={handleUserSelect}
                />
              </div>
            )} 
          </div>
        )}
      </aside>
    </div>
  </div>
  );
}