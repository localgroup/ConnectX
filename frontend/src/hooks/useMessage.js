
import { useState } from 'react';
import api from '../api';


export default function useMessage() {
    const [message, setMessage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getMessage = async () => {
        try {
            const response = await api.get(`/api/messages/`);
            console.log(response.data);
            setMessage(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return { message, getMessage, loading, error };
}