import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const daysOfWeek = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

export default function CustomizedTables({ parsedMenu, onReceiveLastShown }) {
  const [currentMenu, setCurrentMenu] = useState({});
  const [shownDishes, setShownDishes] = useState({}); // Track shown dishes per category
  const [dishCount, setDishCount] = useState({}); // Track how many times each dish has been shown
  const [infoMessage, setInfoMessage] = useState('');  // Info message for when no new dishes are available

  if (!parsedMenu) {
    return <div>No menu data available</div>;
  }

  // Initialize the menu data if it's not already set
  if (Object.keys(currentMenu).length === 0 && parsedMenu) {
    const menuData = {};
    const shown = {}; // Initialize shown dishes tracker
    const count = {}; // Initialize the dish count tracker

    parsedMenu.split('; ').forEach(entry => {
      const [className, dishes] = entry.split(': ');
      menuData[className] = dishes.split(', '); // Keep dishes as an array of strings
      shown[className] = []; // Track shown dishes for each category
      dishes.split(', ').forEach(dish => {
        count[dish] = 0; // Initialize each dish count to 0
      });
    });

    setCurrentMenu(menuData);
    setShownDishes(shown);
    setDishCount(count);
  }

  // Function to handle changing a dish
  const handleChangeDish = (className, day) => {
    const currentDishes = currentMenu[className]; // This is now an array of dishes
    const alreadyShown = shownDishes[className];

    // Find a dish that hasn't been shown yet
    const newDish = currentDishes.find(dish => !alreadyShown.includes(dish));

    if (newDish) {
      const newMenu = {
        ...currentMenu,
        [className]: [...currentDishes], // Make a copy of the array
      };
      newMenu[className][day] = newDish;

      const newShownDishes = {
        ...shownDishes,
        [className]: [...alreadyShown, newDish], // Add the new dish to the shown list
      };

      const newDishCount = {
        ...dishCount,
        [newDish]: (dishCount[newDish] || 0) + 1,
      };

      setCurrentMenu(newMenu);
      setShownDishes(newShownDishes);
      setDishCount(newDishCount);
      setInfoMessage('');
    } else {
      setInfoMessage(`No new dishes available for ${className}.`);
    }
  };

  const getLastShownDishes = () => {
    const lastShown = {};
    Object.keys(currentMenu).forEach((className) => {
      lastShown[className] = currentMenu[className].filter(Boolean); // Filter out empty slots
    });
    return lastShown;
  };

  const sendLastShownDishesToApp = () => {
    const lastDishes = getLastShownDishes();
    const count = dishCount;

    // Send last shown dishes and count to App.js via the callback
    onReceiveLastShown(lastDishes, count);
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>Category</StyledTableCell>
              {daysOfWeek.map(day => (
                <StyledTableCell key={day} align="center">{day}</StyledTableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(currentMenu).map(([className, dishes]) => (
              <StyledTableRow key={className}>
                <StyledTableCell component="th" scope="row">
                  {className}
                </StyledTableCell>
                {daysOfWeek.map((day, index) => (
                  <StyledTableCell key={day} align="center">
                    {dishes[index] || "-"}
                    {dishes[index] && (
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleChangeDish(className, index)}
                        style={{ marginLeft: '10px' }}
                      >
                        Change
                      </Button>
                    )}
                  </StyledTableCell>
                ))}
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>

        {infoMessage && (
          <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
            {infoMessage}
          </div>
        )}
      </TableContainer>

      {/* Button to send last shown dishes and count back to App.js */}
      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        <Button
          variant="contained"
          onClick={sendLastShownDishesToApp}
        >
          Send Last Shown Dishes to App
        </Button>
      </div>
    </div>
  );
}
