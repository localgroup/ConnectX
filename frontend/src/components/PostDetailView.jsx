import React, { useState, useEffect } from 'react';
import { ArrowLeft, MessageCircle, Trash2, Heart, Share } from 'lucide-react';
import useProfile from '../hooks/useProfile';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/useAuth';
import usePost from '../hooks/usePost';
import api from '../api';
import useLikes from '../hooks/useLikes';
import useComment from '../hooks/useComment';
import Comment from '../components/Comment';
import LeftSidebar from './LeftSidebar';


export default function PostDetailView() {

    const { user } = useAuth();
    const { profile } = useProfile(user?.username);
    const [newComment, setNewComment] = useState('');
    const { postId } = useParams();
    const { post, getPost } = usePost(postId);
    const { comment, makeComment, getComment } = useComment(postId);

    const { profile: postAuthorProfile } = useProfile(post?.author);
    const authorName = postAuthorProfile?.first_name + " " + postAuthorProfile?.last_name;
    const authorUsername = postAuthorProfile?.username;

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

    function getAuthorProfile() {
        navigate(`/${authorUsername}/`);
    }

    function handleShare() {
        navigator.clipboard.writeText(window.location.origin + `/posts/${postId}/`);
        alert("Link copied.");
      };

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
            <LeftSidebar />

            {/* Main Content */}
            <main className="flex-1 border-x border-gray-800">
                <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800">
                <button onClick={arrowLeft} className="rounded-full p-2 hover:bg-gray-800">
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <h1 className="text-xl font-bold">Post</h1>
            </header>
            
            <article className="border-b border-gray-800 p-4">
                <div className="flex space-x-3">
                    <img onClick={getAuthorProfile} src={post?.author_avatar} alt={post?.author} className="w-12 h-12 rounded-full cursor-pointer" />
                    <div className="flex-1 cursor-pointer">
                        <div onClick={getAuthorProfile} className="flex items-center space-x-2">
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
                        <button 
                            onClick={handleShare} 
                            className="flex items-center space-x-2 hover:text-red-500"
                            disabled={loading}
                        >
                            <Share />
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
                        className="bg-primary cursor-pointer text-white rounded-full px-4 py-2 font-bold hover:bg-primary/90 transition duration-200"
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
                                key={comm?.id}
                                commentId={comm?.id}
                                author={comm?.author}
                                content={comm?.content}
                                created_at={comm?.created_at}
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
