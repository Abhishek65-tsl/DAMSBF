import { Typography, Box } from '@mui/material';

function Footer() {
  return (
    <Box sx={{ mt: 4, py: 2, textAlign: 'center' }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} My App
      </Typography>
    </Box>
  );
}

export default Footer;
