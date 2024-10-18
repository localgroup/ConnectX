import React, { useState } from 'react';
import { X, Home, Bell, Mail, User, Search, Settings, LogOutIcon } from 'lucide-react';
import ConnectXLogo from './ConnectXLogo';
import NavItem from './NavItem';
import useProfile from '../hooks/useProfile';
import { useAuth } from '../contexts/useAuth';
import SearchResult from './SearchResult';
import useSearch from '../hooks/useSearch';


export default function SearchView() {
    const { user } = useAuth();
    const { profile, loading: profileLoading } = useProfile(user?.username);
    const { search, loading: searchLoading, error, postSearch } = useSearch();

    const [searchQuery, setSearchQuery] = useState('');
    const [activeTab, setActiveTab] = useState('top');
    const [searchResults, setSearchResults] = useState({ posts: [], profiles: [] });
    const [isSearched, setIsSearched] = useState(false);

    const handleSearch = async (e) => {
      e.preventDefault();
      if (!searchQuery.trim()) return;

      try {
          const response = await postSearch({
              query: searchQuery.trim()
          });
          
          if (response?.results) {
              setSearchResults(response.results);
              setIsSearched(true);
          }
      } catch (err) {
          console.error('Search error:', err);
      }
  };

    // Filter results based on active tab
    const getFilteredResults = () => {
      switch (activeTab) {
        case 'people':
          return searchResults.profiles?.map(profile => ({
            type: 'user',
            author: `${profile?.first_name} ${profile?.last_name}`.trim(),
            avatar: profile?.avatar || "/placeholder.svg?height=40&width=40",
            handle: profile?.username,
            bio: profile?.bio
          })) || [];
        case 'media':
          return searchResults.posts?.filter(post => post.media) || [];
        case 'top':
        case 'latest':
        default:
          return searchResults.posts?.map(post => ({
            type: 'post',
            content: post.body,
            author: post.author,
            handle: post.author,
            avatar: post.author_avatar || "/placeholder.svg?height=40&width=40",
            media: post?.media,
            timestamp: new Date(post.created_at).toLocaleDateString(),
            likes: post.number_of_likes,
            comments: post.number_of_comments
          })) || [];
      }
    };

    const filteredResults = getFilteredResults();

    return (
      <div className="min-h-screen bg-black text-white">
        <div className="max-w-screen-xl mx-auto flex">
          {/* Left Sidebar */}
          <aside className="w-20 xl:w-64 h-screen sticky top-0 flex flex-col justify-between p-6 pl-12">
            <div>
              <ConnectXLogo />
              <nav className="mt-8 space-y-4">
                <NavItem Icon={Home} text="Home" to="/home/" />
                <NavItem Icon={Search} text="Explore" to="/search/" />
                <NavItem Icon={Bell} text="Notifications" />
                <NavItem Icon={Mail} text="Messages" />
                <NavItem Icon={User} text="Profile" to={`/${user?.username}`} />
                <NavItem Icon={LogOutIcon} text="LogOut" to="/logout/" />
              </nav>
              <button className="mt-8 bg-primary text-white rounded-full py-3 px-8 font-bold w-full hidden xl:block hover:bg-primary/90 transition duration-200">
                Post
              </button>
              <button className="mt-8 bg-primary text-white rounded-full p-3 font-bold xl:hidden hover:bg-primary/90 transition duration-200">
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4 flex items-center space-x-3">
              <img 
                src={profile?.avatar || '/placeholder.svg?height=150&width=150'} 
                alt="Profile" 
                className="w-10 h-10 rounded-full" 
              />
              <div className="hidden xl:block">
                {!profileLoading && profile ? (
                  <>
                    <h3 className="font-bold">{profile?.first_name + " " + profile?.last_name}</h3>
                    <p className="text-gray-500">@{profile?.username}</p>
                  </>
                ) : (
                  <p>Loading user...</p>
                )}
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 border-x border-gray-800">
            <header className="sticky top-0 bg-black bg-opacity-80 backdrop-blur-sm z-10 p-4 border-b border-gray-800">
              <form onSubmit={handleSearch} className="p-4">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search ConnectX"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-gray-900 rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-500" />
                </div>
              </form>
              {isSearched && (
                <nav className="flex border-b border-gray-800">
                  <button 
                    onClick={() => setActiveTab('top')} 
                    className={`flex-1 text-center py-4 ${activeTab === 'top' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                  >
                    Top
                  </button>
                  <button 
                    onClick={() => setActiveTab('latest')} 
                    className={`flex-1 text-center py-4 ${activeTab === 'latest' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                  >
                    Latest
                  </button>
                  <button 
                    onClick={() => setActiveTab('people')} 
                    className={`flex-1 text-center py-4 ${activeTab === 'people' ? 'border-b-2 border-primary font-bold' : 'text-gray-500'}`}
                  >
                    People
                  </button>
                </nav>
              )}
            </header>
            
            <div className="p-4">
              {searchLoading ? (
                <div className="text-center text-gray-500 mt-10">
                  <p>Loading results...</p>
                </div>
              ) : error ? (
                <div className="text-center text-gray-500 mt-10">
                  <h2 className="text-2xl font-bold mb-2">Error occurred</h2>
                  <p>Please try again later.</p>
                </div>
              ) : !isSearched ? (
                <div className="text-center text-gray-500 mt-10">
                  <Search className="h-16 w-16 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Search ConnectX</h2>
                  <p>Enter a search term above to find posts, people, and more.</p>
                </div>
              ) : filteredResults.length === 0 ? (
                <div className="text-center text-gray-500 mt-10">
                  <h2 className="text-2xl font-bold mb-2">No results found</h2>
                  <p>Try different keywords or check your spelling.</p>
                </div>
              ) : (
                filteredResults.map((result, index) => (
                  <SearchResult key={index} {...result} />
                ))
              )}
            </div>
          </main>

          {/* Right Sidebar */}
          <aside className="w-80 h-screen sticky top-0 p-4 hidden lg:block">
            <div className="bg-gray-900 rounded-2xl p-4 mb-4">
              <h2 className="text-xl font-bold mb-4">Search filters</h2>
              <button className="flex items-center justify-between w-full text-left p-3 hover:bg-gray-800 rounded-lg">
                <span>Advanced search</span>
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </aside>
        </div>
      </div>
    );
  }