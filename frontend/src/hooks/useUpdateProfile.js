import { useState } from 'react';
import api from '../api';

export default function useUpdateProfile() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null); // Add this line

  const updateProfile = async (username, updatedData) => {
    try {
      setLoading(true);
      const response = await api.patch(`/api/${username}/update-profile/`, updatedData, {
        headers: {
          'Content-Type': 'multipart/form-data',  // Important for file uploads
        },
      });
      setData(response.data); // Update the data state
      return response.data;
    } catch (err) {
      setError(err); // Set the error state
      throw err; // You can remove this line if you don't want to re-throw the error
    } finally {
      setLoading(false); // Set loading to false in any case
    }
  };

  return {
    updateProfile,
    loading,
    error,
    data, // Add this line
  };
}