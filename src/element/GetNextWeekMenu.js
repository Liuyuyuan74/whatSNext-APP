import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function GetNextWeekMenu({ onMenuFetched }) {
  const [error, setError] = useState(null); // State to store errors
  const [loading, setLoading] = useState(false); // Loading state

  // Function to fetch menu when button is clicked
  const fetchMenu = async () => {
    setLoading(true); // Set loading to true when fetching begins
    setError(null); // Clear any previous errors
    try {
      const response = await fetch('https://htjdonjs8c.execute-api.us-east-2.amazonaws.com/test/', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Call the callback function and pass the raw data to App.js
      onMenuFetched(data.body); // Pass raw data (unparsed) to App.js
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to fetch the menu. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after fetching completes
    }
  };

  return (
    <div>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant="h3" gutterBottom style={{ marginBottom: '10px' }}>
          Click Button to Generate Menu of Next Week
        </Typography>
        <Button variant="contained" onClick={fetchMenu} disabled={loading}>
          {loading ? 'Loading...' : 'GENERATE'}
        </Button>

        {loading && <Typography>Loading...</Typography>}

        {error && (
          <Typography style={{ color: 'red' }}>
            {error}
          </Typography>
        )}
      </Box>
    </div>
  );
}
