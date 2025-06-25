import React, { useState, useEffect, useRef } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Button
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

function Navbar() {
  const [myVisits, setMyVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const hasVisitedRef = useRef(false); // ✅ prevents double increment

  const userName = 'Lisa Das'; // Replace later with auth if needed

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    alert('Logged out!');
  };

  useEffect(() => {
    if (hasVisitedRef.current) return; // ✅ prevent multiple calls
    hasVisitedRef.current = true;

    const visits = parseInt(localStorage.getItem('myVisits')) || 0;
    const total = parseInt(localStorage.getItem('totalVisits')) || 0;

    localStorage.setItem('myVisits', visits + 1);
    localStorage.setItem('totalVisits', total + 1);

    setMyVisits(visits + 1);
    setTotalVisits(total + 1);
  }, []);

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#004C97', zIndex: 1201 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Intelligent Condition Monitoring System
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: '#fff', color: '#004C97', fontSize: '14px', width: 32, height: 32 }}>
            {userName[0]}
          </Avatar>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {userName}
          </Typography>
          <Typography variant="body2">My Visits: <strong>{myVisits}</strong></Typography>
          <Typography variant="body2">Total Visits: <strong>{totalVisits}</strong></Typography>

          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            borderRadius: 1,
            px: 1,
            width: { xs: '120px', sm: '160px' }
          }}>
            <SearchIcon sx={{ color: '#fff', fontSize: 20, mr: 1 }} />
            <input
              type="text"
              placeholder="Search..."
              style={{
                background: 'transparent',
                border: 'none',
                color: 'white',
                outline: 'none',
                width: '100%',
              }}
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </Box>

          <Button onClick={handleLogout} variant="contained" size="small" sx={{ backgroundColor: '#fff', color: '#004C97' }}>
            LOGOUT
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
