import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Search } from 'lucide-react';

const SearchBar = () => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();
  const ServerUrl = import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!search) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await axios.get(`${ServerUrl}/api/products/search-suggestions?q=${search}`);
        console.log("Suggestions API Response:", res.data.suggestions); // ✅ Check this
        setSuggestions(res.data.suggestions); // Safety check
      } catch (err) {
        console.error(err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // debounce
    return () => clearTimeout(timeoutId);
  }, [search]);

  const handleSearch = () => {
    if (search.trim()) {
      navigate(`/product/trade/search?searchKeywords=${encodeURIComponent(search)}`);
    }
  };

  const handleSuggestionClick = (keyword) => {
    navigate(`/product/trade/search?searchKeywords=${encodeURIComponent(keyword)}`);
  };

  return (
    <div className="relative mt-6 w-full">
      <div className="flex items-center bg-white rounded-lg overflow-hidden shadow-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for products, services..."
          className="w-full p-3 text-black focus:outline-none"
        />
        <button
          onClick={handleSearch}
          className="bg-[var(--color-primary)] hover:bg-[var(--color-secondary)] text-[var(--color-heading)] px-6 py-3 flex items-center gap-2 rounded-xl m-1"
        >
          <Search className="w-5 h-5 mr-4" />
          Search
        </button>
      </div>

        {suggestions.length > 0 && (
        <ul className="absolute z-10 bg-white text-black w-full mt-1 border rounded shadow-lg">
             {suggestions.map((item, idx) => (
            <li
                key={idx}
                onClick={() => handleSuggestionClick(item.title)}
                className="flex items-center p-2 hover:bg-gray-100 cursor-pointer"
            >
                <img
                src={item.images?.[0] || "/fallback-image.jpg"}
                alt={item.title}
                className="w-10 h-10 object-cover rounded mr-3"
                />
                <span>{item.title}</span>
            </li>
            ))}
        </ul>
        )}

      <p className="mt-4 text-gray-200">Frequently searched:</p>
      <div className="mt-2 flex flex-wrap gap-2">
        {["Iphone", "Split Ac", "buds", "Machinery", "Keyboard"].map((item, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(item)}
            className="border border-white text-white px-4 py-2 rounded-lg bg-transparent hover:bg-white hover:text-black transition"
          >
            {item}
          </button>
        ))}
      </div>
    </div>
  );
};

export default SearchBar;
