import { useState } from 'react';
import api from '../api';

export default function useMsg(messageId) {
    const [msgs, setMsgs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const deleteMessage = async () => {
        try {
            setLoading(true);
            const response = await api.delete(`/api/messages/${messageId}/`);
            setMsgs(response.data);
            console.log(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return { msgs, deleteMessage, loading, error };
}