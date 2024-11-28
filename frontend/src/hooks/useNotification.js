import { useEffect, useState } from 'react';
import api from '../api';

export default function useNotification() {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getFeed = async () => {
        setLoading(true); // Set loading to true before fetching
        try {
            const response = await api.get(`/api/notifications/`);
            setNotifications(response.data);
            console.log(response.data);
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false); // Ensure loading is set to false in both success and error cases
        }
    };

    useEffect(() => {
        getFeed(); // Fetch notifications on component mount
    }, []);

    return { notifications, getFeed, loading, error };
}