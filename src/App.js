import './App.css';
import React, { useState } from 'react';
import CustomizedTables from './element/CustomizedTables';
import GetNextWeekMenu from './element/GetNextWeekMenu';
import CheckboxLabels from './element/CheckboxLabels';
import PinnedSubheaderList from './element/PinnedSubheaderList';
import AddDish from './element/AddDish';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

function App() {
  const [menu, setMenu] = useState(null);  // State to store the parsed menu
  const [ingredientsList, setIngredientsList] = useState(null);  // State to store ingredients list
  const [lastShownDishes, setLastShownDishes] = useState(null);  // State to store the last shown dishes
  const [dishCount, setDishCount] = useState(null);  // State to store the dish count

  // Function to parse the raw menu data into the desired format
  const parseMenu = (rawData) => {
    const dishes = JSON.parse(rawData); // Assuming rawData is JSON string

    const groupedDishes = {};
    const uniqueIngredients = new Set();

    dishes.forEach(({ className, dishName, ingredientName }) => {
      // Group dish names by class
      if (!groupedDishes[className]) {
        groupedDishes[className] = new Set();
      }
      groupedDishes[className].add(dishName);

      // Collect unique ingredients
      uniqueIngredients.add(ingredientName);
    });

    // Format the menu by class
    const formattedMenu = Object.entries(groupedDishes).map(([className, dishes]) => {
      return `${className}: ${[...dishes].join(', ')}`;
    }).join('; ');

    // Return the parsed menu and ingredients list
    return {
      parsedMenu: formattedMenu,
      uniqueIngredients: [...uniqueIngredients].join(', '),
    };
  };

  // Function to handle raw data passed from GetNextWeekMenu
  const handleMenuData = (rawData) => {
    const { parsedMenu, uniqueIngredients } = parseMenu(rawData);
    setMenu(parsedMenu);               // Update the state with the parsed menu data
    setIngredientsList(uniqueIngredients);  // Update the state with the ingredients list
  };

  // Callback to receive the last shown dishes and dish count from CustomizedTables
  const handleLastShownDishes = (lastDishes, dishCounts) => {
    setLastShownDishes(lastDishes);
    setDishCount(dishCounts);
  };

  return (
    <div className="App">
      <header className="App-header"></header>
      <div style={styles.parentContainer}>
        <Box style={styles.container}>
          {/* Pass handleMenuData to GetNextWeekMenu */}
          <GetNextWeekMenu onMenuFetched={handleMenuData} />
        </Box>

        <Box style={styles.container}>
          {/* Pass parsedMenu (menu) as a prop to CustomizedTables */}
          {menu ? (
            <CustomizedTables parsedMenu={menu} onReceiveLastShown={handleLastShownDishes} />
          ) : (
            <Typography>No menu data available</Typography>
          )}
        </Box>

        <Box style={styles.container}>
          <div style={styles.horizontalSplitContainer}>
            <Box style={styles.horizontalContainer}>
              <Typography>Do you have this in your refrigerator?</Typography>
              {/* Pass ingredientsList as a prop to CheckboxLabels */}
              {ingredientsList ? (
                <CheckboxLabels ingredientsData={ingredientsList} />
              ) : (
                <Typography>No ingredients data available</Typography>
              )}
            </Box>

            <Box style={styles.horizontalContainer}>
              <Typography>Buy!</Typography>
              <PinnedSubheaderList />
            </Box>
          </div>
        </Box>

        <Box style={styles.container}>
          <Typography>Upload New Dish</Typography>
          <AddDish />
        </Box>

        {/* Display last shown dishes and dish counts */}
        <Box style={styles.container}>
          {lastShownDishes && (
            <div>
              <h3>Last Shown Dishes:</h3>
              <pre>{JSON.stringify(lastShownDishes, null, 2)}</pre>
            </div>
          )}
          {dishCount && (
            <div>
              <h3>Dish Count:</h3>
              <pre>{JSON.stringify(dishCount, null, 2)}</pre>
            </div>
          )}
        </Box>
      </div>
    </div>
  );
}

const styles = {
  parentContainer: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100vh',
    paddingTop: '1vh',
    gap: '20px',
  },
  container: {
    width: '60%',
    textAlign: 'center',
    padding: '20px',
    border: '1px solid #ccc',
    borderRadius: '8px',
  },
  horizontalSplitContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  horizontalContainer: {
    flex: 1,
    border: '1px solid #ddd',
    padding: '10px',
    borderRadius: '4px',
    margin: '0 10px',
  },
};

export default App;
