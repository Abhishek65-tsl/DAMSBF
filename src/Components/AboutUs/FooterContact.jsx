// src/components/AboutUs/FooterContact.jsx
import { Box, Typography, Stack, Link } from '@mui/material';
import { FaGithub, FaLinkedin } from 'react-icons/fa';

export default function FooterContact() {
  return (
    <Box
      sx={{
        py: 2,
        px: 2,
        background: 'linear-gradient(to right, #dbeeff, #eaf6ff)',
        textAlign: 'center',
        borderTop: '2px solid #b0d4f1',
      }}
    >
      <Typography
        variant="h6"
        sx={{ color: '#003366', fontWeight: 'bold', mb: 1 }}
      >
        Driven by innovation, Rooted in collaboration.
      </Typography>

      {/* <Typography variant="body2" sx={{ color: '#444', mb: 2 }}>
        Driven by innovation, Rooted in collaboration.
      </Typography> */}


      <Typography
        variant="caption"
        sx={{ display: 'block', mt: 2, fontWeight: 'bold', color: '#888' }}
      >
        © {new Date().getFullYear()} TATA STEEL LTD. All rights reserved.
      </Typography>
    </Box>
  );
}
