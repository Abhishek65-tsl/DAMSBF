import { Typography, Box, useTheme } from '@mui/material';

function Footer() {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        mt: 4, 
        py: 2, 
        textAlign: 'center',
        backgroundColor: theme.palette.mode === 'dark' 
          ? theme.palette.grey[900] 
          : theme.palette.grey[100],
        borderTop: `1px solid ${theme.palette.divider}`,
        transition: theme.transitions.create(['background-color', 'border-color'], {
          duration: theme.transitions.duration.standard,
        })
      }}
    >
      <Typography 
        variant="body2" 
        color="text.secondary"
        sx={{
          color: theme.palette.mode === 'dark' 
            ? theme.palette.grey[400] 
            : theme.palette.grey[600]
        }}
      >
        © {new Date().getFullYear()} My App
      </Typography>
    </Box>
  );
}

export default Footer;
