import { useState } from 'react';
import api from '../api';

export default function useSearch() {
    const [search, setSearch] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);


    const postSearch = async (data) => {
        setLoading(true);
        try {
            const response = await api.post(`/api/search/`, data);
            console.log(response.data);
            setSearch(response.data);
            setLoading(false);
            return response.data;
        } catch (err) {
            setError(err);
            setLoading(false);
            throw err;
        }
    };

    return { search, postSearch, loading, error };
}