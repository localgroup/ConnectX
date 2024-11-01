// MessageForm.js
import React, { useState } from 'react';
import { Send, Image } from 'lucide-react';

export default function MessageForm({ recipient, onSendMessage }) {
    const [messageBody, setMessageBody] = useState('');
    const [messageMedia, setMessageMedia] = useState(null);

    const handleSubmit = (e) => {
      e.preventDefault();
      if (messageBody.trim() || messageMedia) {
        onSendMessage(messageBody, messageMedia);
        setMessageBody('');
        setMessageMedia(null);
      }
    };

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        setMessageMedia(file);
      }
    };

    return (
      <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={messageBody}
            onChange={(e) => setMessageBody(e.target.value)}
            placeholder={`Message ${recipient?.username}`}
            className="flex-grow bg-gray-900 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <label className="cursor-pointer">
            <Image className="h-6 w-6 text-gray-500 hover:text-primary" />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <button type="submit" className="bg-primary rounded-full p-2">
            <Send className="h-5 w-5" />
          </button>
        </div>
        {messageMedia && (
          <div className="mt-2">
            <img
              src={URL.createObjectURL(messageMedia)}
              alt="Selected media"
              className="max-h-20 rounded-lg"
            />
            <button
              onClick={() => setMessageMedia(null)}
              className="text-xs text-red-500 mt-1"
            >
              Remove
            </button>
          </div>
        )}
      </form>
    );
  }