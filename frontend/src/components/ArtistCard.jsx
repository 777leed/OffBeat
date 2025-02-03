import searchIcon from "../assets/icons8-search-30.png";
import PropTypes from "prop-types";
import { useState, useRef, useCallback, useEffect } from "react";

function ArtistCard({ artist, setArtist, artistPic }) {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const controllerRef = useRef(null);
  const debouncedFetchRef = useRef(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); // Ref to detect clicks outside

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func(...args), delay);
    };
  };

  // Fetch artist suggestions
  const fetchSuggestions = useCallback(async (artist) => {
    if (controllerRef.current) {
      controllerRef.current.abort(); // Cancel previous request
    }
    controllerRef.current = new AbortController();

    setIsLoading(true);

    try {
      if (artist === "") {
        setSuggestions([]);
        return;
      }
      const response = await fetch("http://localhost:5000/match-artist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ artist }),
        signal: controllerRef.current.signal,
      });

      if (!response.ok) throw new Error("Network response was not ok");

      const data = await response.json();
      const { artists, imageUrl } = data;
      setSuggestions(artists);
      console.log(imageUrl);
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching data:", error);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize debounced function once
  useEffect(() => {
    debouncedFetchRef.current = debounce(fetchSuggestions, 500);
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [fetchSuggestions]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setArtist(value);
    setShowDropdown(true); // Show dropdown when typing

    if (debouncedFetchRef.current) {
      debouncedFetchRef.current(value);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    setArtist(suggestion);
    setShowDropdown(false); // Hide dropdown after selection
  };

  return (
    <div className="bg-white/30 w-52 h-52 p-4 rounded-2xl flex flex-col gap-2">
      <div className="rounded-2xl overflow-hidden">
        <img
          src={artistPic}
          className="w-full h-36 object-cover"
          alt={artist}
        />
      </div>
      <div className="">
        <div className="flex gap-2">
          <div className="w-3/2 relative " ref={dropdownRef}>
            <input
              type="text"
              placeholder="Search"
              className="bg-white/80 rounded-full text-black/60 w-full px-2 py-1.5 placeholder:text-black/60 text-sm outline-0"
              value={artist}
              onChange={handleInputChange}
              onFocus={() => setShowDropdown(true)} // Show dropdown when focusing on input
            />
            {showDropdown && (
              <div className="absolute w-full">
                {isLoading && <p>Loading...</p>}
                {suggestions.length > 0 && (
                  <ul className="mt-2 w-full bg-black rounded-lg shadow-lg overflow-clip">
                    {suggestions.map((suggestion, index) => (
                      <li
                        key={index}
                        className="px-4 w-full py-2 hover:bg-white/30 cursor-pointer"
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          <div>
            <img
              src={searchIcon}
              alt=""
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

ArtistCard.propTypes = {
  artist: PropTypes.string.isRequired,
  setArtist: PropTypes.func.isRequired,
  artistPic: PropTypes.string.isRequired,
};

export default ArtistCard;
