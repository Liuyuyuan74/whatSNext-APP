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
  const [ingredientsList, setIngredientsList] = useState([]);  // State to store ingredients list
  const [lastShownDishes, setLastShownDishes] = useState(null);  // State to store the last shown dishes
  const [dishCount, setDishCount] = useState(null);  // State to store the dish count
  const [selectedIngredients, setSelectedIngredients] = useState([]); // State to store selected ingredients for shopping

  // Function to parse the raw menu data into the desired format
  const parseMenu = (rawData) => {
    const dishes = JSON.parse(rawData); // Assuming rawData is JSON string

    const groupedDishes = {};
    const ingredients = {}; // To collect ingredient names and quantities

    dishes.forEach(({ className, dishName, ingredientName }) => {
      // Group dish names by class
      if (!groupedDishes[className]) {
        groupedDishes[className] = new Set();
      }
      groupedDishes[className].add(dishName);

      // Collect ingredients and their quantities
      if (!ingredients[ingredientName]) {
        ingredients[ingredientName] = 0;
      }
      ingredients[ingredientName]++;
    });

    // Format the menu by class
    const formattedMenu = Object.entries(groupedDishes).map(([className, dishes]) => {
      return `${className}: ${[...dishes].join(', ')}`;
    }).join('; ');

    return {
      parsedMenu: formattedMenu,
      ingredientsList: ingredients,
    };
  };

  // Function to handle raw data passed from GetNextWeekMenu
  const handleMenuData = (rawData) => {
    const { parsedMenu, ingredientsList } = parseMenu(rawData);
    setMenu(parsedMenu);               // Update the state with the parsed menu data
    setIngredientsList(Object.entries(ingredientsList));  // Update the state with the ingredients list
  };

  // Callback to receive the last shown dishes and dish count from CustomizedTables
  const handleLastShownDishes = (lastDishes, dishCounts) => {
    setLastShownDishes(lastDishes);
    setDishCount(dishCounts);

    // Update the ingredients list based on the current last shown dishes
    const newIngredientsList = {};
    Object.values(lastDishes).flat().forEach(dish => {
      // Assuming ingredientsList has the necessary data to extract ingredient quantities
      if (ingredientsList[dish]) {
        newIngredientsList[dish] = ingredientsList[dish];
      }
    });
    setIngredientsList(Object.entries(newIngredientsList));
  };

  // Callback to handle selected ingredients from CheckboxLabels
  const handleSelectedIngredients = (selectedIngredients) => {
    setSelectedIngredients(selectedIngredients);
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
              {ingredientsList.length > 0 ? (
                <CheckboxLabels ingredientsData={ingredientsList} onSelectedIngredients={handleSelectedIngredients} />
              ) : (
                <Typography>No ingredients data available</Typography>
              )}
            </Box>

            <Box style={styles.horizontalContainer}>
              <Typography>Buy!</Typography>
              {/* Pass selectedIngredients as a prop to PinnedSubheaderList */}
              {selectedIngredients.length > 0 ? (
                <PinnedSubheaderList ingredientsToBuy={selectedIngredients} />
              ) : (
                <Typography>No items selected to buy</Typography>
              )}
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