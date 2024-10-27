import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { useState } from 'react';

export default function GetNextWeekMenu({ onMenuFetched }) {
  const [error, setError] = useState(null); // State to store errors
  const [loading, setLoading] = useState(false); // Loading state

  const fetchMenu = async () => {
    setLoading(true);
    setError(null);
  
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
      console.log('Fetched data:', data); // Check if `data.body` is a string

      // Parse `data.body` if it's a JSON string
      const parsedData = JSON.parse(data.body);
  
      // Shuffle the array
      const randomizedData = JSON.stringify(parsedData.sort(() => 0.5 - Math.random()));
  
      onMenuFetched(randomizedData); // Send randomized data to App component
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to fetch the menu. Please try again.');
    } finally {
      setLoading(false);
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
