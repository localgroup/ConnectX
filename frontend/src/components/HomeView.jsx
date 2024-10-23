import React, { useState, useEffect } from 'react';
import Post from './Post';
import api from '../api';
import LeftSidebar from './LeftSidebar';
import useExpand from '../hooks/useExpand';
import PostForm from './PostForm';



const TrendingTopic = ({ topic, posts }) => (
  <div className="p-3 hover:bg-gray-800 transition duration-200">
    <h4 className="font-bold">{topic}</h4>
    <p className="text-gray-500 text-sm">{posts} posts</p>
  </div>
);

export default function HomeView() {

    const [posts, setPosts, loading] = useState([]);
    const { expanded, expandButton } = useExpand();
    

    useEffect(() => {
      const fetchPosts = async () => {
        try {
          const response = await api.get('/api/posts/');
          console.log(response.data);
          setPosts(response.data);
        } catch (err) {
          console.error('Error fetching posts:', err.response?.data || err.message);
        }
      };
      fetchPosts();
    }, []);

    if (loading) return <div>Loading...</div>;


    const trendingTopics = [
      { topic: "#coding", posts: "12.5K" },
    ];

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <LeftSidebar expandButton={expandButton}/>

          {/* Main Content */}
          <main className="flex-1 border-x border-gray-800">
            <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold">Your Feed</h1>
            </header>

          {/* Post creation form */}
          <div className="p-4 border-b border-gray-800">
            <PostForm expanded={ expanded } expandButton={ expandButton} />
          </div>
            
            <div>
              {posts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((post) => (
                      <Post
                      key={post?.id}
                      postId={post?.id}
                      avatar={post?.author_avatar}
                      username={post?.author}
                      handle={post?.author}
                      content={post?.body}
                      media={post?.media}
                      created_at={post?.created_at}
                      commentsCount={post?.number_of_comments}
                  />
                ))}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
            <div className="bg-gray-900 rounded-2xl p-4 mb-4">
              <h2 className="text-xl font-bold mb-4">What&apos;s happening</h2>
              {trendingTopics.map((topic, index) => (
                <TrendingTopic key={index} {...topic} />
              ))}
              <a href="#" className="text-primary hover:underline block mt-4">Show more</a>
            </div>
            <div className="bg-gray-900 rounded-2xl p-4">
              <h2 className="text-xl font-bold mb-4">Who to follow</h2>
              {/* Add suggested follows here */}
              <a href="#" className="text-primary hover:underline block mt-4">Show more</a>
            </div>
          </aside>
        </div>
      </div>
    );
  }
