import React, { useState, useEffect } from 'react';
import { X, Home, Bell, Mail, User, Search, LogOutIcon, Camera } from 'lucide-react';
import ConnectXLogo from './ConnectXLogo';
import NavItem from './NavItem';
import Post from './Post';
import useProfile from '../hooks/useProfile';
import api from '../api';
import { useAuth } from '../contexts/useAuth';



const TrendingTopic = ({ topic, posts }) => (
  <div className="p-3 hover:bg-gray-800 transition duration-200">
    <h4 className="font-bold">{topic}</h4>
    <p className="text-gray-500 text-sm">{posts} posts</p>
  </div>
);

export default function HomeView() {

    const { user } = useAuth(); 
    const { profile, loading } = useProfile(user?.username);
    const [postData, setPostData] = useState({
      body: "",
      media: null,
    });

    const [posts, setPosts] = useState([]);
    const [expanded, setExpanded] = useState(false);

    function expandButton() {
        setExpanded(true);
    }

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

    // Handle file change (e.g., media upload)
    const handleFileChange = (e) => {
      const { name, files } = e.target;
      setPostData((prevData) => ({
        ...prevData,
        [name]: files[0], // Update the file in postData
      }));
    };

    // Handle text input changes
    const handleChange = (e) => {
      const { name, value } = e.target;
      setPostData((prevData) => ({
        ...prevData,
        [name]: value, // Update the body in postData
      }));
    };

    // Handle form submission
    const makePost = async (e) => {
      e.preventDefault();
    
      const formData = new FormData();
    
      Object.keys(postData).forEach((key) => {
        if (postData[key] !== "" && postData[key] !== null) {
          formData.append(key, postData[key]);
        }
      });
    
      try {
        const response = await api.post("/api/posts/", formData, {
          headers: {
            "Content-Type": "multipart/form-data", 
          },
        });
    
        if (response.status === 201) {
          setPostData({ body: "", media: null });
          alert("Successfully created post");
            try {
              const response = await api.get('/api/posts/');
              console.log(response.data);
              setPosts(response.data);
            } catch (err) {
              console.error('Error fetching posts:', err.response?.data || err.message);
            }
        } else {
          alert("Failed to create post");
        }
      } catch (err) {
        console.error("Error creating post:", err.response?.data || err.message);
        alert(`Error: ${err.response?.data?.detail || err.message}`);
      }
    };
    

    if (loading) return <div>Loading...</div>;


    const trendingTopics = [
      { topic: "#coding", posts: "12.5K" },
    ];

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-6 pl-12">
            <div>
              <ConnectXLogo />
              <nav className="mt-8 space-y-4">
                <NavItem Icon={Home} text="Home" to="/home/" />
                <NavItem Icon={Search} text="Explore" to="/search/" />
                <NavItem Icon={Bell} text="Notifications" />
                <NavItem Icon={Mail} text="Messages" />
                <NavItem Icon={User} text="Profile" to={`/${user?.username}`} />
                <NavItem Icon={LogOutIcon} text="LogOut" to="/logout/" />
              </nav>
              <button onClick={expandButton} className="mt-8 bg-primary text-white rounded-full py-3 px-8 font-bold w-full hidden xl:block hover:bg-primary/90 transition duration-200">
                Post
              </button>
              <button className="mt-8 bg-primary text-white rounded-full p-3 font-bold xl:hidden hover:bg-primary/90 transition duration-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4 flex items-center space-x-3">
              <img src={profile?.avatar || '/placeholder.svg?height=150&width=150'} alt="Profile" className="w-10 h-10 rounded-full" />
              <div className="hidden xl:block">
                {profile ? (
                  <>
                    <h3 className="font-bold">{profile?.first_name + " " + profile?.last_name}</h3>
                    <p className="text-gray-500">@{profile?.username}</p>
                  </>
                ) : (
                  <p>Loading user...</p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 border-x border-gray-800">
            <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800">
              <h1 className="text-xl font-bold">Your Feed</h1>
            </header>
            <div className="p-4 border-b border-gray-800">

              {/* Post creation form */}
              <form onSubmit={makePost} encType="multipart/form-data">
                <div onClick={!expanded ? expandButton : undefined} className="flex space-x-4 cursor-pointer">
                  <img src={profile?.avatar} alt={profile?.username} className="w-12 h-12 rounded-full" />
                  
                  {!expanded && (
                      <>
                        <div className="flex-1 bg-gray-800 p-3 rounded-lg text-gray-500">
                          What&apos;s happening?
                        </div>
                        <div className="flex justify-between items-center mt-4">
                          <button
                            type="submit"
                            className="bg-gray-500 text-white rounded-full px-4 py-2 font-bold bg-primary cursor-not-allowed"
                            disabled
                          >
                            Post
                          </button>
                        </div>
                      </>
                    )}

                  {expanded && (
                    <div className="flex-1">
                      <textarea
                        className="w-full bg-transparent text-xl placeholder-gray-500 focus:outline-none resize-none"
                        placeholder="What's happening?"
                        rows={7}
                        name="body"
                        value={postData?.body || ""}
                        onChange={handleChange}
                        required
                        maxLength={240}
                        autoFocus={expanded}
                      />
                      <p>{240 - postData?.body.length} characters remaining</p>
                      
                      {/* Media upload section */}
                      <div className="relative mb-6">
                        {postData?.media && (
                          <img src={URL.createObjectURL(postData?.media)} alt="Media" className="image-upload" />
                        )}
                        <label htmlFor="media" className="absolute top-2 right-2 bg-black bg-opacity-60 rounded-full p-2 cursor-pointer">
                          <Camera className="h-5 w-5" />
                          <input type="file" id="media" name="media" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>

                      {/* Submit button */}
                      <div className="flex justify-between items-center mt-4">
                        <button
                          type="submit"
                          className="bg-primary text-white rounded-full px-4 py-2 font-bold hover:bg-primary/90 transition duration-200"
                        >
                          Post
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </form>
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
