import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
// import { format } from 'date-fns';
import LeftSidebar from './LeftSidebar';
import NotificationItem from './NotificationItem';
import useNotification from '../hooks/useNotification';




export default function NotificationView() {
  const [activeTab, setActiveTab] = useState('all');

//   const { notifications, getFeed, loading, error } = useNotification();
    const { notifications: notificationData } = useNotification();
    const notifications = notificationData.notifications || []; // Access the notifications array


  return (
    <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <LeftSidebar />

        {/* Main Content */}
        <main className="flex-1 border-x border-gray-800 max-w-2xl">
          <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 border-b border-gray-800">
            <div className="flex justify-between items-center p-4">
              <h1 className="text-xl font-bold">Notifications</h1>
              <button>
                <Settings className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex">
              <button 
                onClick={() => setActiveTab('all')} 
                className={`flex-1 text-center py-4 ${activeTab === 'all' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
              >
                All
              </button>
              <button 
                onClick={() => setActiveTab('mentions')} 
                className={`flex-1 text-center py-4 ${activeTab === 'mentions' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
              >
                Mentions
              </button>
            </nav>
          </header>
          <div>
            {Array.isArray(notifications) && notifications.length > 0 ? (
                notifications.map((notification) => (
                <NotificationItem 
                    key={notification?.id}
                    id={notification?.id}
                    is_read={notification?.is_read}
                    message={notification?.message}
                    sender_avatar={notification?.sender?.profile?.avatar}
                    username={notification?.sender?.profile?.username}
                    user={notification?.sender?.profile?.first_name + " " + notification?.sender?.profile?.last_name}
                    postId={notification?.post_details?.id}
                    body={notification?.post_details?.body}
                    timestamp={notification?.created_at}
                    notification_type={notification?.notification_type}
                
                />
                ))
            ) : (
                <p>No notifications available.</p> // Optional: message when there are no notifications
            )}
            </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
          <div className="bg-gray-900 rounded-2xl p-4">
            <h2 className="text-xl font-bold mb-4">What's happening</h2>
            {/* Add trending topics or news here */}
          </div>
          <div className="bg-gray-900 rounded-2xl p-4 mt-4">
            <h2 className="text-xl font-bold mb-4">Who to follow</h2>
            {/* Add suggested users to follow here */}
          </div>
        </aside>
      </div>
    </div>
  );
}