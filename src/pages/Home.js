import { useState, useEffect } from 'react';
import { Box, Typography, MenuItem, Select, FormControl, InputLabel, CircularProgress, Alert } from '@mui/material';
import SearchBar from '../components/SearchBar';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../context/MovieContext';

const genres = [
  { id: 28, name: 'Action' },
  { id: 12, name: 'Adventure' },
  { id: 16, name: 'Animation' },
  { id: 35, name: 'Comedy' },
  { id: 80, name: 'Crime' },
  { id: 18, name: 'Drama' },
  { id: 10751, name: 'Family' },
  { id: 14, name: 'Fantasy' },
  { id: 36, name: 'History' },
  { id: 27, name: 'Horror' },
  { id: 10402, name: 'Music' },
  { id: 9648, name: 'Mystery' },
  { id: 10749, name: 'Romance' },
  { id: 878, name: 'Science Fiction' },
  { id: 10770, name: 'TV Movie' },
  { id: 53, name: 'Thriller' },
  { id: 10752, name: 'War' },
  { id: 37, name: 'Western' },
];

function Home() {
  const { movies, trending, loading, error, search, loadTrendingMovies } = useMovies();
  const [genreFilter, setGenreFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [ratingFilter, setRatingFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const lastSearch = localStorage.getItem('lastSearch');
    if (lastSearch) {
      setSearchQuery(lastSearch);
      search(lastSearch);
    }
    loadTrendingMovies();
  }, [loadTrendingMovies, search]);

  const handleSearch = (query) => {
    setSearchQuery(query);
    search(query);
  };

  const filteredMovies = movies.filter((movie) => {
    if (genreFilter && !movie.genre_ids.includes(Number(genreFilter))) return false;
    if (yearFilter && new Date(movie.release_date).getFullYear() !== Number(yearFilter)) return false;
    if (ratingFilter && movie.vote_average < Number(ratingFilter)) return false;
    return true;
  });

  const years = Array.from({ length: 30 }, (_, i) => new Date().getFullYear() - i);

  return (
    <Box sx={{ p: 3 }}>
      <SearchBar onSearch={handleSearch} initialQuery={searchQuery} />
      
      <Box display="flex" gap={2} mb={3} flexWrap="wrap">
        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Genre</InputLabel>
          <Select
            value={genreFilter}
            label="Genre"
            onChange={(e) => setGenreFilter(e.target.value)}
          >
            <MenuItem value="">All Genres</MenuItem>
            {genres.map((genre) => (
              <MenuItem key={genre.id} value={genre.id}>
                {genre.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Year</InputLabel>
          <Select
            value={yearFilter}
            label="Year"
            onChange={(e) => setYearFilter(e.target.value)}
          >
            <MenuItem value="">All Years</MenuItem>
            {years.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 120 }} size="small">
          <InputLabel>Min Rating</InputLabel>
          <Select
            value={ratingFilter}
            label="Min Rating"
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <MenuItem value="">Any Rating</MenuItem>
            {[6, 7, 8, 9].map((rating) => (
              <MenuItem key={rating} value={rating}>
                {rating}+
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {searchQuery && (
        <Typography variant="h5" gutterBottom>
          Search Results for "{searchQuery}"
        </Typography>
      )}

      {loading && filteredMovies.length === 0 ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : filteredMovies.length > 0 ? (
        <MovieGrid movies={filteredMovies} />
      ) : (
        searchQuery && !loading && (
          <Typography>No movies found. Try a different search.</Typography>
        )
      )}

      <Typography variant="h5" mt={6} mb={3}>
        Trending This Week
      </Typography>
      {trending.length > 0 ? (
        <MovieGrid movies={trending} />
      ) : loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <Typography>No trending movies available.</Typography>
      )}
    </Box>
  );
}

export default Home;