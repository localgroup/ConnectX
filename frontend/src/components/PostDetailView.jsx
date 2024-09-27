import React, { useState, useEffect } from 'react';
import { X, Home, Bell, Mail, User, Search, LogOutIcon, ArrowLeft, MessageCircle, Trash2, Heart, MoreVertical } from 'lucide-react';
import ConnectXLogo from './ConnectXLogo';
import NavItem from './NavItem';
import useProfile from '../hooks/useProfile';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import usePost from '../hooks/usePost';
import api from '../api';
import useLikes from '../hooks/useLikes';
import useComment from '../hooks/useComment';
import Comment from '../components/Comment';


export default function PostDetailView() {

    const { user } = useAuth();
    const { profile } = useProfile(user?.username);
    const [newComment, setNewComment] = useState('');
    const { postId } = useParams();
    const { post, getPost } = usePost(postId);
    const { comment, makeComment, getComment } = useComment(postId);

    const { profile: postAuthorProfile } = useProfile(post?.author);
    const authorName = postAuthorProfile?.first_name + " " + postAuthorProfile?.last_name;

    const date = new Date(post?.created_at);
    const formattedDate = date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
    });

    const navigate = useNavigate(); 

    const { isLiked, likesCount, loading, toggleLike } = useLikes(postId);

    const handleLikeClick = async () => {
        await toggleLike();
      };


    useEffect(() => {
        getPost();
        getComment();
    }, [postId]);

    const deletePost = async () => {
        try {
            const response = await api.delete(`/api/posts/${postId}/`);
            console.log(response.data)
            navigate(`/home/`);
        } catch (err) {
            console.log(err)
        }
        }

    function arrowLeft() {
        // Redirect to the profile page
        navigate(`/home/`);
        }

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        try {
            await makeComment(newComment);
            setNewComment('');
            getComment();
        } catch(err) {
            console.log(err)
        }
    };

    return (
        <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">

            {/* Left Sidebar */}
            <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-6 pl-12">
            <div>
                <ConnectXLogo />
                <nav className="mt-8 space-y-4">
                    <NavItem Icon={Home} text="Home" to="/home/" />
                    <NavItem Icon={Search} text="Explore" />
                    <NavItem Icon={Bell} text="Notifications" />
                    <NavItem Icon={Mail} text="Messages" />
                    <NavItem Icon={User} text="Profile" to={`/${user?.username}`} />
                    <NavItem Icon={LogOutIcon} text="LogOut" to="/logout/" />
                </nav>
                <button className="mt-8 bg-primary text-white rounded-full py-3 px-8 font-bold w-full hidden xl:block hover:bg-primary/90 transition duration-200">
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
                        <h3 className="font-bold">{profile.first_name + " " + profile.last_name}</h3>
                        <p className="text-gray-500">@{profile.username}</p>
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
                <button className="rounded-full p-2 hover:bg-gray-800">
                <ArrowLeft onClick={arrowLeft} className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-bold">Post</h1>
            </header>
            
            <article className="border-b border-gray-800 p-4">
                <div className="flex space-x-3">
                    <img src={post?.author_avatar} alt={post?.author} className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                        <div className="flex items-center space-x-2">
                            <div>
                                <h2 className="font-bold">{authorName}</h2>
                                <p className="text-gray-500">@{post?.author}</p>
                            </div>
                        </div>
                        <p className="mt-2 text-xl">{post?.body}</p>
                        {post?.media && <p className="mt-2 mb-3"><img src={post?.media} alt="Post media" className="w-full mb-3" /></p>}
                        <p className="text-gray-500 text-sm">{formattedDate}</p>
                        <div className="flex justify-between text-gray-500">
                        <button className="flex items-center space-x-2 hover:text-primary">
                            <MessageCircle className="h-5 w-5" />
                            <span>{post?.number_of_comments}</span>
                        </button>
                        <button 
                            onClick={handleLikeClick} 
                            className="flex items-center space-x-2 hover:text-red-500"
                            disabled={loading}
                        >
                            <Heart className={`h-5 w-5 ${isLiked ? 'text-red-500' : ''}`} />
                            <span>{likesCount}</span>
                        </button>
                        { post?.author === user?.username && 
                            <button onClick={deletePost} className="flex items-center space-x-2 hover:text-primary">
                            <Trash2 className="h-5 w-5" />
                            </button>
                        }
                            </div>
                    </div>
                </div>
            </article>

            <div className="p-4 border-b border-gray-800">
                <form onSubmit={handleCommentSubmit} className="flex space-x-4">
                <img src={profile?.avatar || '/placeholder.svg?height=150&width=150'} alt="Your Avatar" className="w-12 h-12 rounded-full" />
                <div className="flex-1">
                    <textarea 
                    className="w-full bg-transparent text-xl placeholder-gray-500 focus:outline-none resize-none"
                    placeholder="Post your reply"
                    rows="3"
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    ></textarea>
                    <div className="flex justify-between items-center mt-4">
                    <div className="flex space-x-2 text-primary">
                        {/* Add comment attachment options here */}
                    </div>
                    <button 
                        type="submit"
                        className="bg-primary text-white rounded-full px-4 py-2 font-bold hover:bg-primary/90 transition duration-200"
                        disabled={!newComment.trim()}
                    >
                        Reply
                    </button>
                    </div>
                </div>
                </form>
            </div>
            <div>
                {comment && (
                    <div>
                        {Array.isArray(comment) && comment.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).map((comm) => (
                            <Comment 
                                key={comm.id}
                                commentId={comm.id}
                                author={comm.author}
                                content={comm.content}
                                created_at={comm.created_at}
                            />
                        ))}
                    </div>
                )}
            </div>
            </main>

            {/* Right Sidebar */}
            <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
                <div className="bg-gray-900 rounded-2xl p-4 mb-4">
                    <h2 className="text-xl font-bold mb-4">What's happening</h2>
                {/* Add trending topics or related content here */}
            </div>
            </aside>
        </div>
        </div>
    );
}