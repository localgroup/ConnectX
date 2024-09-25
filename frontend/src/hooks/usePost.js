import { useState } from 'react';
import api from '../api';


export default function usePost (postId) {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getPost = async () => {
    try {
        const response = await api.get(`/api/posts/${postId}/`);
        console.log(response.data)
        setPost(response.data);
        setLoading(false);
    } catch (err) {
        setError(err);
        setLoading(false);
    }
    };


    return { post, getPost, loading, error };
  }
