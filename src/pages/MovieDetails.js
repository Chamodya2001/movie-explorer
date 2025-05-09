import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, Chip, Button, CircularProgress, Alert, Paper, Divider } from '@mui/material';
import { useMovies } from '../context/MovieContext';
import YouTube from 'react-youtube';

function MovieDetails() {
  const { id } = useParams();
  const { getMovieDetails, toggleFavorite, favorites } = useMovies();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovie = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [id, getMovieDetails]);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;
  if (!movie) return <Alert severity="info">Movie not found</Alert>;

  const isFavorite = favorites.some((fav) => fav.id === movie.id);
  const trailer = movie.videos?.results.find((video) => video.type === 'Trailer');

  return (
    <Box sx={{ p: 3 }}>
      <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4}>
        <Box flexShrink={0}>
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            style={{ width: '100%', maxWidth: 400, borderRadius: 8 }}
          />
        </Box>
        <Box flexGrow={1}>
          <Typography variant="h3" gutterBottom>
            {movie.title}
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={2}>
            <Typography variant="subtitle1">
              {new Date(movie.release_date).getFullYear()} • {movie.runtime} min
            </Typography>
            <Chip label={`⭐ ${movie.vote_average.toFixed(1)}`} size="small" />
          </Box>
          <Box mb={2}>
            {movie.genres.map((genre) => (
              <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mb: 1 }} />
            ))}
          </Box>
          <Typography paragraph>{movie.overview}</Typography>
          <Button
            variant="contained"
            startIcon={<FavoriteIcon />}
            onClick={() => toggleFavorite(movie)}
            sx={{ mt: 2 }}
          >
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
          </Button>
        </Box>
      </Box>

      {trailer && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Trailer
          </Typography>
          <YouTube videoId={trailer.key} opts={{ width: '100%' }} />
        </Box>
      )}

      {movie.credits?.cast.length > 0 && (
        <Box mt={4}>
          <Typography variant="h5" gutterBottom>
            Cast
          </Typography>
          <Box display="flex" overflow="auto" gap={2} py={2}>
            {movie.credits.cast.slice(0, 10).map((person) => (
              <Paper key={person.id} sx={{ p: 2, minWidth: 150, textAlign: 'center' }}>
                <Typography variant="subtitle2">{person.name}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {person.character}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

export default MovieDetails;