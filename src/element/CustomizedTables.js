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

// Function to shuffle an array
const shuffleArray = (array) => {
  return array.sort(() => Math.random() - 0.5);
};

export default function CustomizedTables({ parsedMenu, onReceiveLastShown }) {
  const [currentMenu, setCurrentMenu] = useState({});
  const [shownDishes, setShownDishes] = useState({}); // Track shuffled lists per cell
  const [infoMessage, setInfoMessage] = useState('');  // Info message for when no new dishes are available

  const initialized = useRef(false);

  useEffect(() => {
    if (parsedMenu && !initialized.current) {
      const menuData = {};
      const shuffledDishes = {};

      parsedMenu.split('; ').forEach(entry => {
        const [className, dishes] = entry.split(': ');
        const dishList = dishes.split(', ');

        // Shuffle each class's dish list once
        menuData[className] = shuffleArray([...dishList]);

        // Create a unique shuffled list per cell by day
        shuffledDishes[className] = daysOfWeek.reduce((acc, day, index) => {
          acc[day] = shuffleArray([...dishList]); // Unique shuffled list for each cell
          return acc;
        }, {});
      });

      setCurrentMenu(menuData);
      setShownDishes(shuffledDishes);

      onReceiveLastShown(menuData);

      initialized.current = true; // Mark as initialized
    }
  }, [parsedMenu, onReceiveLastShown]);

  // Function to handle changing a dish for a specific day and class
  const handleChangeDish = (className, dayIndex) => {
    const day = daysOfWeek[dayIndex];
    const classDishes = shownDishes[className][day];
    const currentDishes = [...currentMenu[className]];

    // Find the next dish in the shuffled list that hasn't been shown in the current cell
    const currentDish = currentDishes[dayIndex];
    const remainingDishes = classDishes.filter(dish => dish !== currentDish);

    if (remainingDishes.length > 0) {
      // Cycle to the next dish
      const newDish = remainingDishes[0];
      currentDishes[dayIndex] = newDish;

      // Update menu and the shown list for the specific cell
      const newShownDishes = { ...shownDishes };
      newShownDishes[className][day] = remainingDishes;

      setCurrentMenu((prevMenu) => ({
        ...prevMenu,
        [className]: currentDishes,
      }));
      setShownDishes(newShownDishes);
      setInfoMessage('');

      onReceiveLastShown(currentMenu);
    } else {
      // If no new dishes are available for this cell
      setInfoMessage(`No new dishes available for ${className} on ${day}.`);
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
