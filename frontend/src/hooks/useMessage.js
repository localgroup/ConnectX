import { useState, useCallback } from 'react';
import api from '../api';


export default function useMessage(username) {
    const [message, setMessage] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getMessage = useCallback(async () => {
        try {
            const response = await api.get(`/api/messages/${username}/`);
            setMessage(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    }, [username]);

    const sendMessage = async (content) => {
        try {
            const response = await api.post(`/api/messages/${username}/`,  content , {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage(prevMessages => [...prevMessages, response.data]);
            return response.data;
        } catch (error) {
            console.error('Send message error:', error.response?.data);
            throw error;
        }
    };
    

    return { message, getMessage, sendMessage, loading, error };
}