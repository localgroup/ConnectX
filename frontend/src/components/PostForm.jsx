import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import useProfile from '../hooks/useProfile';
import api from '../api';
import { useAuth } from '../contexts/useAuth';


export default function PostForm({ expanded, expandButton }) {

    const { user } = useAuth(); 
    const { profile } = useProfile(user?.username);
    const [postData, setPostData] = useState({
    body: "",
    media: null,
    });

    const [posts, setPosts] = useState([]);


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

    return (
        <>
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
        </>
    );
}
