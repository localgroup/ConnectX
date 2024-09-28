
import { useState } from 'react';
import api from '../api';


export default function useFollow(username) {
    const [follow, setFollow] = useState(false);
    const [followData, setFollowData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const getFollow = async () => {
        try {
        const response = await api.get(`/api/follow/${username}/`);
        console.log(response.data);
        setFollowData(response.data);
        setFollow(response.data.is_following);
        setLoading(false);
        } catch (err) {
        setError(err);
        setLoading(false);
        }
    };

    const makeFollow = async () => {
        try {
            const response = await api.post(`/api/follow/${username}/`);
            console.log(response.data);
            alert("Followed succesfully.")
            setFollow(true);
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    const makeUnfollow = async () => {
        try {
            const response = await api.delete(`/api/follow/${username}/`);
            console.log(response.data);
            setFollow(false);
            alert("Un-followed succesfully.")
            setLoading(false);
        } catch (err) {
            setError(err);
            setLoading(false);
        }
    };

    return { follow, followData, getFollow, makeFollow, makeUnfollow, loading, error };
}