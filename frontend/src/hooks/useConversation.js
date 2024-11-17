import { useState, useEffect } from 'react';
import api from '../api';

export default function useConversation() {
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getConversation = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/api/messages/`);
            setConversations(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return { conversations, getConversation, loading, error };
}