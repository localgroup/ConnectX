import React, { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import useProfile from '../hooks/useProfile';
import useFollow from '../hooks/useFollow';
import { useParams, useNavigate } from 'react-router-dom';
import useFollower from '../hooks/useFollower';
import FollowerItem from '../components/FollowerItem';
import LeftSidebar from './LeftSidebar';


export default function FollowersView() {
    const { username } = useParams();

    const navigate = useNavigate(); 
    function arrowLeft() {
      // Redirect to the profile page
      navigate(`/${username}/`);
    } 

    const { profile: targetProfile, loading } = useProfile(username);

    const { follower, followerData, getFollower } = useFollower(username);
    const { follow, followData, getFollow, makeFollow, makeUnfollow } = useFollow(username);

    useEffect(() => {
      getFollower();
    }, [username]);

    useEffect(() => {
      getFollow();
    }, []);
    

    if (loading) return <div>Loading...</div>;

      const userTargetProfile = {
        name: targetProfile?.first_name + " " + targetProfile?.last_name,
        handle: targetProfile?.username,
        avatar: targetProfile?.avatar || '/placeholder.svg?height=150&width=150',
        };


    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <LeftSidebar />

        {/* Main Content */}
        <main className="flex-1 border-x border-gray-800">
            <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800 flex items-center space-x-4">
              <div className="flex items-center space-x-4">
              <button onClick={arrowLeft} className="rounded-full p-2 hover:bg-gray-800">
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold">{userTargetProfile?.name}</h1>
                <p className="text-sm text-gray-500">@{userTargetProfile?.handle}</p>
              </div>
            </div>
          </header>
          <nav className="flex border-b border-gray-800">
            <a href="" className="flex-1 text-center py-4 hover:bg-gray-900">Followers</a>
            </nav>
          <div className="p-4">
            <h2 className="text-xl font-bold mb-4">{followerData?.followers_count} Followers</h2>
            <div className="space-y-4">
              {followerData?.followers?.map((follower) => (
                <FollowerItem
                  key={follower?.id}
                  handle={follower?.username}
                  bio={follower?.bio}
                  isFollowing={followerData?.is_following}
                />
              ))}
            </div>
          </div>
        </main>

        {/* Right Sidebar */}
        <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
            <div className="bg-gray-900 rounded-2xl p-4 mb-4">
              <h2 className="text-xl font-bold mb-4">You might like</h2>
            {/* Add suggested users to follow here */}
          </div>
        </aside>
      </div>
    </div>
  );
}

