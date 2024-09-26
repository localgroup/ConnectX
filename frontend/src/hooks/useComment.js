
import { useState } from 'react';
import api from '../api';


export default function useComment(postId) {
    const [comment, setComment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const makeComment = async (content) => {
        try {
            const response = await api.post(`/api/posts/${postId}/comments/`, { content });
            console.log(response.data);
            alert("Comment made.")
            setComment(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const getComment = async () => {
        try {
            const response = await api.get(`/api/posts/${postId}/comments/`);
            console.log(response.data);
            setComment(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return { comment, makeComment, getComment, loading, error };
}