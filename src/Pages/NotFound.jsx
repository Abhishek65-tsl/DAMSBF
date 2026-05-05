import { Typography, Box } from '@mui/material';

function NotFound() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        404 Not Found
      </Typography>
      <Typography variant="body1">
        Page not found.
      </Typography>
    </Box>
  );
}

export default NotFound;
