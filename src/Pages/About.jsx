import { Typography, Box } from '@mui/material';

function About() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        About Us
      </Typography>
      <Typography variant="body1">
        This is a simple about page.
      </Typography>
    </Box>
  );
}

export default About;
