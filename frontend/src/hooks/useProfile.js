import { useState, useEffect } from 'react';
import api from '../api';


export default function useProfile (username) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!username) {
      setError('Username is required');
      setLoading(false);
      return;
    }

    const getProfile = async () => {
      try {
        const response = await api.get(`/api/${username}/`);
        setProfile(response.data);
        setLoading(false);
      } catch (err) {
        setError(err);
        setLoading(false);
      }
    };

    getProfile();
  }, [username]);

  return { profile, loading, error };
};

