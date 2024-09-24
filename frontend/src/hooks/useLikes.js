import { useState, useEffect } from 'react';
import api from '../api';


export default function useLikes(postId) {
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getLike = async () => {
            try {
                const response = await api.get(`/api/posts/${postId}/likes/`);
                setIsLiked(response.data.is_liked);
                setLikesCount(response.data.likes_count);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        getLike();
    }, [postId]);

    const toggleLike = async () => {
        setLoading(true);
        setError(null);
        try {
            if (isLiked) {
                await api.delete(`/api/posts/${postId}/likes/`);
                setIsLiked(false);
                setLikesCount(prev => prev - 1);
            } else {
                await api.post(`/api/posts/${postId}/likes/`);
                setIsLiked(true);
                setLikesCount(prev => prev + 1);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return { isLiked, likesCount, loading, error, toggleLike };
}