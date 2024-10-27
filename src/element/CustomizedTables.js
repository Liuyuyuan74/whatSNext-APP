import React, { useState, useEffect, useRef } from 'react';
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

  const initialized = useRef(false);

  useEffect(() => {
    if (parsedMenu && !initialized.current) {
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

      // Send initial last shown dishes to App.js after generating the menu
      onReceiveLastShown(menuData, count);

      initialized.current = true; // Mark as initialized
    }
  }, [parsedMenu, onReceiveLastShown]);

  // Function to handle changing a dish
  const handleChangeDish = (className, day) => {
    const currentDishes = currentMenu[className]; // Array of dishes for the given class
    const alreadyShown = shownDishes[className];

    // Find a dish that hasn't been shown yet
    const newDish = currentDishes.find(dish => !alreadyShown.includes(dish));

    if (newDish) {
      // Update the menu with the new dish
      const newMenu = {
        ...currentMenu,
        [className]: [...currentDishes], // Make a copy of the array
      };
      newMenu[className][day] = newDish;

      // Update shown dishes for the category
      const newShownDishes = {
        ...shownDishes,
        [className]: [...alreadyShown, newDish], // Add the new dish to the shown list
      };

      // Update the count of how many times the dish has been shown
      const newDishCount = {
        ...dishCount,
        [newDish]: (dishCount[newDish] || 0) + 1,
      };

      // Update state
      setCurrentMenu(newMenu);
      setShownDishes(newShownDishes);
      setDishCount(newDishCount);
      setInfoMessage('');

      // Send updated last shown dishes and dish count to App.js after a change
      onReceiveLastShown(newMenu, newDishCount);
    } else {
      // If no new dishes are available, show a message
      setInfoMessage(`No new dishes available for ${className}.`);
    }
  };

  return (
    <div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>NUTRITION</StyledTableCell>
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
    </div>
  );
}
