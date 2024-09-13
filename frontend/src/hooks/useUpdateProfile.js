import { useState } from 'react';
import api from '../api';

export default function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const updateProfile = async (username, updatedData) => {
    try {
      setLoading(true);
      const response = await api.patch(`/api/${username}/update-profile/`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setData(response.data); // Update the data state
      return response.data;
    } catch (err) {
      setError(err); // Set the error state
      throw err; 
    } finally {
      setLoading(false); // Set loading to false
    }
  };

  return {
    updateProfile,
    loading,
    error,
    data,
  };
}