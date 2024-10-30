import React, { useState, useEffect } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import LeftSidebar from './LeftSidebar';
import useExpand from '../hooks/useExpand';
import ConversationItem from './ConversationItem';
import MessageBubble from './MessageBubble';
import useMessage from '../hooks/useMessage';
import useSearch from '../hooks/useSearch';
import MessagePeopleSearch from './MessagePeopleSearch';
import MessageForm from './MessageForm';



export default function MessageView() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState({ posts: [], profiles: [] });
  const [selectedUser, setSelectedUser] = useState(null);

  const { expanded, expandButton } = useExpand();
  const { message, getMessage, sendMessage, loading, error } = useMessage();
  const { search, postSearch } = useSearch();

  useEffect(() => {
    getMessage();
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
  };

  const handleSendMessage = async (messageBody) => {
    if (!selectedUser || !messageBody.trim()) return;

    try {
      const formData = new FormData();
      formData.append('receiver', selectedUser?.id);
      formData.append('message_body', messageBody.trim());

      // Debug: Log form data
      console.log('Form data:');
      for (let [key, value] of formData.entries()) {
        console.log(key, value);
      }

      const response = await sendMessage(formData);
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
        <main className="w-[calc(100%-32rem)] border-x border-gray-800">
          {/* Conversation List */}
          <div className="border-r border-gray-800">
            <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold">Messages</h1>
            </header>
            <div className="overflow-y-auto h-[calc(100vh-80px)]">
              {message?.map((conv) => (
                <ConversationItem 
                  key={conv?.id}
                  sender={conv?.sender}
                  sender_avatar={conv?.sender_avatar}
                  sent_at={conv?.sent_at}
                  isActive={activeConversation === conv?.id}
                  onClick={() => setActiveConversation(conv?.id)}
                />
              ))}
            </div>
            {selectedUser && (
              <MessageForm
                recipient={selectedUser}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>

          {/* Message Area */}
          <div className="flex-1 border-x border-gray-800">
                <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src={message?.sender || '/placeholder.svg?height=150&width=150'} alt="Profile" className="w-10 h-10 rounded-full" />
                    <div>
                      <h2 className="font-bold">{message?.find(c => c?.id === activeConversation)?.name}</h2>
                      <p className="text-sm text-gray-500">@{message?.find(c => c?.id === activeConversation)?.handle}</p>
                    </div>
                  </div>
                  <button>
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </header>
                <div className="flex-1 overflow-y-auto p-4">
                  {message?.map((msg) => (
                    <MessageBubble 
                    key={msg?.id}
                    message_body={msg?.message_body}
                    sent_at={msg?.sent_at}
                    is_read={msg?.is_read}
                    />
                  ))}
                </div>

          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-96 h-screen sticky top-0 hidden lg:block">
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
            {selectedUser && (
              <MessageForm
                recipient={selectedUser}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}