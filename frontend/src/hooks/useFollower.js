
import { useState } from 'react';
import api from '../api';


export default function useFollower(username) {
    const [follower, setFollower] = useState(false);
    const [followerData, setFollowerData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getFollower = async () => {
        try {
        const response = await api.get(`/api/${username}/follower/`);
        console.log(response.data);
        setFollowerData(response.data.followers);
        setFollower(response.data.is_following);
        setLoading(false);
        } catch (err) {
        setError(err);
        setLoading(false);
        }
    };

    return { follower, followerData, getFollower, loading, error };
}