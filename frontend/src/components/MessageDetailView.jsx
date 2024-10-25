import React, { useState } from 'react';
import { Network, X, Home, Bell, Mail, User, Search, MoreHorizontal, ArrowLeft, Send, MoreVertical, Image, Smile, Calendar } from 'lucide-react';

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

const MessageBubble = ({ content, timestamp, isSent }) => (
  <div className={`flex ${isSent ? 'justify-end' : 'justify-start'} mb-4`}>
    <div className={`max-w-xs ${isSent ? 'bg-primary text-white' : 'bg-gray-800 text-white'} rounded-lg p-3`}>
      <p>{content}</p>
      <p className="text-xs text-gray-400 mt-1">{timestamp}</p>
    </div>
  </div>
);


export default function MessageDetailView() {
  const [newMessage, setNewMessage] = useState('');

  const conversation = {
    id: 1,
    name: "John Doe",
    handle: "johndoe",
    avatar: "/placeholder.svg?height=48&width=48",
    lastSeen: "Active 2h ago"
  };

  const messages = [
    { id: 1, content: "Hey, how's it going?", timestamp: "2:30 PM", isSent: false },
    { id: 2, content: "Not bad, just working on a new project. You?", timestamp: "2:32 PM", isSent: true },
    { id: 3, content: "That sounds interesting! What kind of project?", timestamp: "2:33 PM", isSent: false },
    { id: 4, content: "It's a new web app for task management. I'm using React and Node.js.", timestamp: "2:35 PM", isSent: true },
    { id: 5, content: "Wow, that's cool! Let me know if you need any help testing it.", timestamp: "2:36 PM", isSent: false },
    { id: 6, content: "Thanks, I appreciate that! I'll definitely let you know when it's ready for testing.", timestamp: "2:38 PM", isSent: true },
    { id: 7, content: "Sounds good. How long have you been working on it?", timestamp: "2:40 PM", isSent: false },
    { id: 8, content: "I started about two weeks ago. It's coming along nicely, but there's still a lot to do.", timestamp: "2:42 PM", isSent: true },
    { id: 9, content: "That's great progress! What features are you planning to include?", timestamp: "2:45 PM", isSent: false },
    { id: 10, content: "I'm planning to include task creation, assignment, due dates, progress tracking, and team collaboration features.", timestamp: "2:48 PM", isSent: true },
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
        <main className="flex-1 border-x border-gray-800 flex flex-col">
          <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button className="rounded-full p-2 hover:bg-gray-800">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-3">
                <img src={conversation.avatar} alt={conversation.name} className="w-10 h-10 rounded-full" />
                <div>
                  <h2 className="font-bold">{conversation.name}</h2>
                  <p className="text-sm text-gray-500">@{conversation.handle}</p>
                </div>
              </div>
            </div>
            <button>
              <MoreVertical className="h-5 w-5" />
            </button>
          </header>

          <div className="flex-1 overflow-y-auto p-4">
            <div className="text-center text-sm text-gray-500 mb-4">
              {conversation.lastSeen}
            </div>
            {messages.map((message) => (
              <MessageBubble key={message.id} {...message} />
            ))}
          </div>

          <form onSubmit={handleSendMessage} className="border-t border-gray-800 p-4">
            <div className="flex items-center space-x-2 mb-2">
              <button type="button" className="text-primary hover:text-primary/80">
                <Image className="h-6 w-6" />
              </button>
              <button type="button" className="text-primary hover:text-primary/80">
                <Smile className="h-6 w-6" />
              </button>
              <button type="button" className="text-primary hover:text-primary/80">
                <Calendar className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center space-x-2">
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
            </div>
          </form>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">Conversation Info</h2>
            <div className="flex items-center space-x-3 mb-4">
              <img src={conversation.avatar} alt={conversation.name} className="w-16 h-16 rounded-full" />
              <div>
                <h3 className="font-bold">{conversation.name}</h3>
                <p className="text-gray-500">@{conversation.handle}</p>
              </div>
            </div>
            <button className="w-full bg-gray-800 text-white rounded-full py-2 px-4 font-bold hover:bg-gray-700 transition duration-200">
              View Profile
            </button>
            <div className="mt-4">
              <h4 className="font-bold mb-2">Shared Media</h4>
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-gray-800 aspect-square rounded-lg"></div>
                <div className="bg-gray-800 aspect-square rounded-lg"></div>
                <div className="bg-gray-800 aspect-square rounded-lg"></div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
