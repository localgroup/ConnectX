import { useState } from 'react';
import api from '../api'; // Adjust the path to your API instance

export default function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (username, updatedData) => {
    setLoading(true);
    setError(null);

    try {
      const response = await api.patch(`/api/${username}/update-profile/`, updatedData);
      return response.data;
    } catch (err) {
      setError(err);
      throw err; 
    } finally {
      setLoading(false);
    }
  };

  return {
    updateProfile,
    loading,
    error
  };
}
