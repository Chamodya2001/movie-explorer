import { createContext, useContext, useState, useEffect } from 'react';
import { fetchTrendingMovies, searchMovies, getMovieDetails } from '../services/tmdb';

const MovieContext = createContext();

export function MovieProvider({ children }) {
  const [movies, setMovies] = useState([]);
  const [trending, setTrending] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const search = async (query, page = 1) => {
    setLoading(true);
    setSearchQuery(query);
    try {
      const data = await searchMovies(query, page);
      setCurrentPage(page);
      setTotalPages(data.total_pages);
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
      return data;
    } catch (err) {
      setError(err.message);
      return { results: [], total_pages: 0 };
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (currentPage < totalPages) {
      await search(searchQuery, currentPage + 1);
    }
  };

  // ... rest of your context code (fetchTrendingMovies, toggleFavorite, etc.)

  return (
    <MovieContext.Provider
      value={{
        movies,
        trending,
        favorites,
        loading,
        error,
        search,
        loadMore,
        hasMore: currentPage < totalPages,
        // ... other values
      }}
    >
      {children}
    </MovieContext.Provider>
  );
}