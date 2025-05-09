import { Box, Typography, Button, Alert } from '@mui/material';
import MovieGrid from '../components/MovieGrid';
import { useMovies } from '../context/MovieContext';

function Favorites() {
  const { favorites, toggleFavorite } = useMovies();

  const handleClearFavorites = () => {
    if (window.confirm('Are you sure you want to clear all favorites?')) {
      favorites.forEach(movie => toggleFavorite(movie));
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4">Your Favorite Movies</Typography>
        {favorites.length > 0 && (
          <Button 
            variant="outlined" 
            color="error"
            onClick={handleClearFavorites}
          >
            Clear All
          </Button>
        )}
      </Box>

      {favorites.length === 0 ? (
        <Alert severity="info">
          You haven't added any movies to your favorites yet. Search for movies and click the heart icon to add them.
        </Alert>
      ) : (
        <MovieGrid movies={favorites} />
      )}
    </Box>
  );
}

export default Favorites;