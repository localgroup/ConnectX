
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

    const sendMessage = async (data) => {
        try {
            const response = await api.post(`/api/messages/`, {data});
            console.log(response.data);
            setMessage(response.data);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return { message, getMessage, sendMessage, loading, error };
}