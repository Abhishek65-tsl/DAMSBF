import React, { useState, useEffect, useRef } from 'react';
import {
  Typography,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Box,
  Avatar,
  IconButton,
  Toolbar
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MenuIcon from '@mui/icons-material/Menu';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import routes from '../routes/routes'; // dynamic routes import

// Styled components
const SearchContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  position: 'relative',
}));

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(1),
    width: 'auto',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      width: '20ch',
      '&:focus': {
        width: '30ch',
      },
    },
  },
}));

const SuggestionBox = styled(Paper)(({ theme }) => ({
  position: 'absolute',
  zIndex: 1000,
  marginTop: theme.spacing(1),
  width: '100%',
  backgroundColor: theme.palette.background.paper,
}));

// Component
function Navbar({ handleDrawerToggle }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [myVisits, setMyVisits] = useState(0);
  const [totalVisits, setTotalVisits] = useState(0);
  const hasVisitedRef = useRef(false);
  const navigate = useNavigate();
  const userName = 'Lisa Das';

  // Dynamically derive valid pages from routes
  const pages = routes
    .filter(route =>
      route.path !== '*' &&
      !['/login', '/signout', '/reset', '/signedout'].includes(route.path)
    )
    .map(route => {
      const path = route.path;
      const name =
        path === '/'
          ? 'Home'
          : path
              .replace('/', '')
              .replace(/-/g, ' ')
              .replace(/\b\w/g, l => l.toUpperCase());
      return { name, path };
    });

  // Count visit stats once per session
  useEffect(() => {
    if (hasVisitedRef.current) return;
    hasVisitedRef.current = true;

    const visits = parseInt(localStorage.getItem('myVisits')) || 0;
    const total = parseInt(localStorage.getItem('totalVisits')) || 0;

    localStorage.setItem('myVisits', visits + 1);
    localStorage.setItem('totalVisits', total + 1);

    setMyVisits(visits + 1);
    setTotalVisits(total + 1);
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchQuery(value);

    if (value.trim() === '') {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const filtered = pages.filter((page) =>
      page.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredSuggestions(filtered);
    setShowSuggestions(true);
  };

  const handleSelect = (path) => {
    setSearchQuery('');
    setFilteredSuggestions([]);
    setShowSuggestions(false);
    navigate(path);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      if (filteredSuggestions.length > 0) {
        handleSelect(filteredSuggestions[0].path);
      } else {
        navigate('/notfound');
      }
    }
  };

  return (
    <Toolbar sx={{ justifyContent: 'space-between'}}>
      {/* Left: Menu icon + Title */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton
          size="large"
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={handleDrawerToggle}
          sx={{ mr: 2 }}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
          Intelligent Condition Monitoring System
        </Typography>
      </Box>

      {/* Right: Avatar, stats, search */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: '#fff', color: '#004C97', fontSize: '14px', width: 32, height: 32 }}>
          {userName?.[0] || 'U'}
        </Avatar>
        <Typography variant="body1" sx={{ fontWeight: 500 }}>
          {userName}
        </Typography>
        <Typography variant="body2">My Visits: <strong>{myVisits}</strong></Typography>
        <Typography variant="body2">Total Visits: <strong>{totalVisits}</strong></Typography>

        {/* Search box */}
        <SearchContainer sx={{ width: { xs: '120px', sm: '160px' }, marginRight: '70px' }}>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              placeholder="Search…"
              value={searchQuery}
              onChange={handleSearchChange}
              onKeyDown={handleKeyDown}
              inputProps={{ 'aria-label': 'search' }}
            />
            {showSuggestions && filteredSuggestions.length > 0 && (
              <SuggestionBox>
                <List dense>
                  {filteredSuggestions.map((suggestion) => (
                    <ListItem disablePadding key={suggestion.path}>
                      <ListItemButton onClick={() => handleSelect(suggestion.path)}>
                        <ListItemText primary={suggestion.name} />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </SuggestionBox>
            )}
          </Search>
        </SearchContainer>
      </Box>
    </Toolbar>
  );
}

export default Navbar;

