import { useEffect, useState } from 'react';
import { Grid, Box, Button, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';
import { useMovies } from '../context/MovieContext';

function MovieGrid({ movies }) {
  const { loading, loadMore, hasMore } = useMovies();
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    const handleScroll = async () => {
      if (
        window.innerHeight + document.documentElement.scrollTop <
          document.documentElement.offsetHeight - 100 ||
        loading ||
        !hasMore
      ) {
        return;
      }
      setIsFetching(true);
      try {
        await loadMore();
      } finally {
        setIsFetching(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, loadMore]);

  return (
    <Box sx={{ mt: 4 }}>
      <Grid container spacing={3}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4} lg={3}>
            <MovieCard movie={movie} />
          </Grid>
        ))}
      </Grid>

      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {!loading && hasMore && (
        <Box display="flex" justifyContent="center" my={4}>
          <Button
            variant="contained"
            onClick={async () => {
              setIsFetching(true);
              try {
                await loadMore();
              } finally {
                setIsFetching(false);
              }
            }}
            disabled={isFetching}
          >
            {isFetching ? 'Loading...' : 'Load More'}
          </Button>
        </Box>
      )}
    </Box>
  );
}

export default MovieGrid;