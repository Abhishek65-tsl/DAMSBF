// src/components/Navbar.jsx
import React, { useState } from 'react';
import {
  Typography,
  InputBase,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { styled, alpha } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

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

function Navbar() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();

  const pages = [
    { name: 'Home', path: '/' },
    { name: 'BLT', path: '/BLT' },
    { name: 'About', path: '/about' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

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
    <>
      <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
        Digital Asset Management System TSK
      </Typography>

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
    </>
  );
}

export default Navbar;
