import React, { useState } from 'react';
import { Network, X, Home, Bell, Mail, User, Search, MoreHorizontal, Settings, Send, ChevronDown } from 'lucide-react';

const ConnectXLogo = () => (
  <div className="relative w-12 h-12">
    <Network className="w-12 h-12 text-primary absolute" />
    <X className="w-10 h-10 text-primary absolute top-1 left-1" />
  </div>
);

const NavItem = ({ Icon, text }) => (
  <a href="#" className="flex items-center space-x-4 p-3 hover:bg-gray-800 rounded-full">
    <Icon className="h-7 w-7" />
    <span className="text-xl hidden xl:inline">{text}</span>
  </a>
);

const ConversationItem = ({ name, handle, lastMessage, timestamp, isActive, onClick }) => (
  <div 
    className={`flex items-center space-x-3 p-3 hover:bg-gray-800 cursor-pointer ${isActive ? 'bg-gray-800' : ''}`}
    onClick={onClick}
  >
    <img src="/placeholder.svg?height=48&width=48" alt={name} className="w-12 h-12 rounded-full" />
    <div className="flex-1">
      <div className="flex justify-between">
        <h3 className="font-bold">{name}</h3>
        <span className="text-sm text-gray-500">{timestamp}</span>
      </div>
      <p className="text-gray-500">@{handle}</p>
      <p className="text-sm truncate">{lastMessage}</p>
    </div>
  </div>
);

const MessageBubble = ({ content, timestamp, isSent }) => (
  <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs ${isSent ? 'bg-primary text-white' : 'bg-gray-800 text-white'} rounded-lg p-3`}>
      <p>{content}</p>
      <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
    </div>
  </div>
);

export default function MessageView() {
  const [activeConversation, setActiveConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');

  const conversations = [
    { id: 1, name: "John Doe", handle: "johndoe", lastMessage: "Hey, how's it going?", timestamp: "2h" },
    { id: 2, name: "Jane Smith", handle: "janesmith", lastMessage: "Did you see the latest update?", timestamp: "1d" },
    { id: 3, name: "Alice Johnson", handle: "alicej", lastMessage: "Thanks for your help!", timestamp: "3d" },
  ];

  const messages = [
    { id: 1, content: "Hey, how's it going?", timestamp: "2:30 PM", isSent: false },
    { id: 2, content: "Not bad, just working on a new project. You?", timestamp: "2:32 PM", isSent: true },
    { id: 3, content: "That sounds interesting! What kind of project?", timestamp: "2:33 PM", isSent: false },
    { id: 4, content: "It's a new web app for task management. I'm using React and Node.js.", timestamp: "2:35 PM", isSent: true },
    { id: 5, content: "Wow, that's cool! Let me know if you need any help testing it.", timestamp: "2:36 PM", isSent: false },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      // Here you would typically send the message to your backend
      setNewMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto flex">
        {/* Left Sidebar */}
        <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-4">
          <div>
            <ConnectXLogo />
            <nav className="mt-8 space-y-4">
              <NavItem Icon={Home} text="Home" />
              <NavItem Icon={Search} text="Explore" />
              <NavItem Icon={Bell} text="Notifications" />
              <NavItem Icon={Mail} text="Messages" />
              <NavItem Icon={User} text="Profile" />
              <NavItem Icon={MoreHorizontal} text="More" />
            </nav>
            <button className="mt-8 bg-primary text-white rounded-full py-3 px-8 font-bold w-full hidden xl:block hover:bg-primary/90 transition duration-200">
              Post
            </button>
            <button className="mt-8 bg-primary text-white rounded-full p-3 font-bold xl:hidden hover:bg-primary/90 transition duration-200">
              <X className="h-6 w-6" />
            </button>
          </div>
          <div className="mb-4 flex items-center space-x-3">
            <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="w-10 h-10 rounded-full" />
            <div className="hidden xl:block">
              <h3 className="font-bold">Your Name</h3>
              <p className="text-gray-500">@yourhandle</p>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 border-x border-gray-800 flex">
          {/* Conversation List */}
          <div className="w-1/3 border-r border-gray-800">
            <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold">Messages</h1>
              <button className="mt-2 flex items-center text-primary">
                <Settings className="h-5 w-5 mr-2" />
                <span>Message requests</span>
              </button>
            </header>
            <div className="overflow-y-auto h-[calc(100vh-80px)]">
              {conversations.map((conv) => (
                <ConversationItem 
                  key={conv.id}
                  {...conv}
                  isActive={activeConversation === conv.id}
                  onClick={() => setActiveConversation(conv.id)}
                />
              ))}
            </div>
          </div>

          {/* Message Area */}
          <div className="w-2/3 flex flex-col">
            {activeConversation ? (
              <>
                <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <img src="/placeholder.svg?height=40&width=40" alt="Profile" className="w-10 h-10 rounded-full" />
                    <div>
                      <h2 className="font-bold">{conversations.find(c => c.id === activeConversation)?.name}</h2>
                      <p className="text-sm text-gray-500">@{conversations.find(c => c.id === activeConversation)?.handle}</p>
                    </div>
                  </div>
                  <button>
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </header>
                <div className="flex-1 overflow-y-auto p-4">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} {...message} />
                  ))}
                </div>
                <form onSubmit={handleSendMessage} className="border-t border-gray-800 p-4 flex items-center space-x-2">
                  <input
                    type="text"
                    placeholder="Start a new message"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 bg-gray-800 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button 
                    type="submit"
                    className="bg-primary text-white rounded-full p-2 hover:bg-primary/90 transition duration-200"
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-5 w-5" />
                  </button>
                </form>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <p>Select a conversation to start messaging</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}