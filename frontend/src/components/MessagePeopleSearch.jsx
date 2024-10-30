// MessagePeopleSearch.jsx
import React from 'react';

export default function MessagePeopleSearch({ results, onUserSelect }) {
    const { profiles, posts } = results;

    return (
        <div className="mt-4">
            {/* Display Profile Results */}
            {profiles && (
                <div className="mb-4">
                    {profiles?.map((profile) => (
                        <div 
                            key={profile?.id} 
                            className="flex items-center p-3 hover:bg-gray-800 rounded-lg cursor-pointer transition-colors"
                            onClick={() => onUserSelect(profile)}
                        >
                            <img 
                                src={profile?.avatar} 
                                alt={profile?.author} 
                                className="w-12 h-12 rounded-full mr-3"
                            />
                            <div>
                                <p className="font-semibold">
                                    {profile?.first_name + " " + profile?.last_name}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {!profiles && (
                <div className="text-center text-gray-400 py-4">
                    No results found
                </div>
            )}
        </div>
    );
}