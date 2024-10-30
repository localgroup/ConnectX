
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

    // const sendMessage = async (formData) => {
    //     try {
    //       const response = await api.post('/api/messages/', formData, {
    //         headers: {
    //           'Content-Type': 'multipart/form-data',
    //         },
    //       });
    //       console.log('Response:', response.data);
    //       return response.data;
    //     } catch (error) {
    //       console.error('Error sending message:', error);
    //       throw error;
    //     }
    //   };

    const sendMessage = async (formData) => {
      try {
          console.log('Sending form data:');
          for (let [key, value] of formData.entries()) {
              console.log(key, value);
          }
  
          const response = await api.post('/api/messages/', formData, {
              headers: {
                  'Content-Type': 'multipart/form-data',
              },
          });
          
          console.log('Message sent successfully:', response.data);
          return response.data;
      } catch (error) {
          console.error('Send message error:', error.response?.data);
          throw error;
      }
  };

    return { message, getMessage, sendMessage, loading, error };
}