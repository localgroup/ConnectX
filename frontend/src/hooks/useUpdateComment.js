
import { useState } from 'react';
import api from '../api';


export default function useUpdateComment(commentId) {

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deleteComment = async () => {
        try {
            const response = await api.delete(`/api/comments/${commentId}/`);
            console.log(response.data);
            alert("Comment deleted succesfully.")
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return { deleteComment, loading, error };
}