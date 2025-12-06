/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useState, useEffect, useRef } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { DEBOUNCE_DELAY, RECENT_SEARCHES_KEY } from "@/constant/general";
import { Select, SelectItem, Input } from "@nextui-org/react";
import { IoClose, IoSearch, IoTimeOutline } from "react-icons/io5";
import { SEARCH_TYPE as searchTypeConstant } from "@/constant/search";
import { SearchTypeEnum } from "@/types/search";
import { SearchQuery } from "@/types/api";

interface SearchBarProps {
  value?: string;
  onSearch: (query: SearchQuery) => void;
  placeholder?: string;
}

export default function SearchComponent({
  value,
  onSearch,
  placeholder = "Search movies...",
}: SearchBarProps) {
  const [query, setQuery] = useState(value || "");
  const [searchType, setSearchType] = useState(SearchTypeEnum.MOVIE);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const searchBarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem(RECENT_SEARCHES_KEY);
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    const query = debouncedQuery.trim();
    if (query) {
      onSearch({ search: query, type: searchType });
      setRecentSearches((prev) => {
        const updated = [query, ...prev.filter((s) => s !== query)].slice(0, 5);
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
        return updated;
      });
    }
  }, [debouncedQuery, onSearch, searchType]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchBarRef.current &&
        !searchBarRef.current.contains(event.target as Node)
      ) {
        setShowAutocomplete(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setShowAutocomplete(value.length > 0 || recentSearches.length > 0);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setQuery(suggestion);
    onSearch({ search: suggestion, type: searchType });
    setShowAutocomplete(false);
  };

  const handleClear = () => {
    setQuery("");
    setShowAutocomplete(false);
  };

  const handleFocus = () => {
    if (recentSearches.length > 0) {
      setShowAutocomplete(true);
    }
  };

  return (
    <div ref={searchBarRef} className="relative w-full max-w-3xl mx-auto">
      <div className="flex w-full gap-4">
        <Input
          type="text"
          value={query}
          onValueChange={handleInputChange}
          onFocus={handleFocus}
          placeholder={placeholder}
          classNames={{
            base: "flex-grow",
            mainWrapper: "h-full",
            inputWrapper:
              "bg-white/10 backdrop-blur-md border border-white/20  ",
          }}
          size="lg"
          startContent={
            <IoSearch className="text-white/50 text-2xl pointer-events-none flex-shrink-0" />
          }
          endContent={
            query && (
              <button
                onClick={handleClear}
                className="text-white/50 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <IoClose className="text-2xl" />
              </button>
            )
          }
        />
        <Select
          placeholder="Select type"
          defaultSelectedKeys={[searchType]}
          className="w-32"
          classNames={{
            trigger: "bg-white/10 backdrop-blur-md border border-white/20 ",
            popoverContent:
              "bg-white/10 backdrop-blur-md border border-white/20",
          }}
          size="lg"
          onSelectionChange={(keys) => {
            const value = Array.from(keys)[0] as SearchTypeEnum;
            setSearchType(value);
          }}
        >
          {searchTypeConstant.map((type) => (
            <SelectItem key={type.value}>{type.label}</SelectItem>
          ))}
        </Select>
      </div>

      {showAutocomplete && recentSearches.length > 0 && (
        <div className="absolute z-10 w-full mt-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 overflow-hidden">
          <div className="px-4 py-2 text-xs font-semibold text-white/60 tracking-wider">
            RECENT SEARCHES
          </div>
          {recentSearches.map((search, index) => (
            <button
              key={index}
              onClick={() => handleSuggestionClick(search)}
              className="w-full px-4 py-3 text-left text-white hover:bg-white/10 transition-colors flex items-center gap-3"
            >
              <IoTimeOutline className="text-white/50 text-lg" />
              {search}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
