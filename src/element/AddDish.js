import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddCircleIcon from '@mui/icons-material/AddCircle'; // Import the AddCircleIcon
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import { FixedSizeList } from 'react-window';

export default function AddDish() {
  const [dishName, setDishName] = React.useState('');
  const [classIds, setClassIds] = React.useState([]);
  const [ingredient, setIngredient] = React.useState('');
  const [ingredients, setIngredients] = React.useState([]);

  const handleAddIngredient = () => {
    if (ingredient) {
      setIngredients((prevIngredients) => [...prevIngredients, ingredient]);
      setIngredient('');
    }
  };

  const handleSubmit = async () => {
    const dishData = {
      dishName,
      classIds,
      ingredients,
    };

    try {
      const response = await fetch('https://htjdonjs8c.execute-api.us-east-2.amazonaws.com/test/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dishData),
      });
      const responseData = await response.json();
      console.log('Dish added successfully:', responseData);
      // Clear the input fields and state
      setDishName('');
      setClassIds([]);
      setIngredients([]);
    } catch (error) {
      console.error('Error adding dish:', error);
    }
  };

  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' }, textAlign: 'center' }}
      noValidate
      autoComplete="off"
    >
      <TextField
        id="outlined-basic"
        label="Dish Name"
        variant="outlined"
        value={dishName}
        onChange={(e) => setDishName(e.target.value)}
        sx={{ input: { color: 'white' }, label: { color: 'white' } }}
      />

      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={classIds.includes(1)} onChange={(e) => {
            if (e.target.checked) {
              setClassIds([...classIds, 1]);
            } else {
              setClassIds(classIds.filter((id) => id !== 1));
            }
          }} />}
          label="staple food"
          sx={{ color: 'white' }}
        />
        <FormControlLabel
          control={<Checkbox checked={classIds.includes(2)} onChange={(e) => {
            if (e.target.checked) {
              setClassIds([...classIds, 2]);
            } else {
              setClassIds(classIds.filter((id) => id !== 2));
            }
          }} />}
          label="protein"
          sx={{ color: 'white' }}
        />
        <FormControlLabel
          control={<Checkbox checked={classIds.includes(3)} onChange={(e) => {
            if (e.target.checked) {
              setClassIds([...classIds, 3]);
            } else {
              setClassIds(classIds.filter((id) => id !== 3));
            }
          }} />}
          label="vegetable"
          sx={{ color: 'white' }}
        />
      </FormGroup>

      {/* Stack to align TextField and Button in the same line and center */}
      <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" sx={{ width: '100%' }}>
        <TextField
          id="outlined-basic"
          label="Ingredient"
          variant="outlined"
          value={ingredient}
          onChange={(e) => setIngredient(e.target.value)}
          sx={{ input: { color: 'white' }, label: { color: 'white' } }}
        />
        <Button variant="contained" endIcon={<AddCircleIcon />} onClick={handleAddIngredient}>
          Add
        </Button>
      </Stack>

      <Box
        sx={{
          width: '100%',
          height: 400,
          maxWidth: 360,
          bgcolor: 'white',
          color: 'black', // Override color to black for list items
          margin: '0 auto',
        }}
      >
        <FixedSizeList
          height={400}
          width={360}
          itemSize={46}
          itemCount={ingredients.length}
          overscanCount={5}
        >
          {({ index, style }) => (
            <ListItem style={{ ...style, backgroundColor: 'white', color: 'black' }} key={index} component="div" disablePadding>
              <ListItemButton>
                <ListItemText primary={ingredients[index]} />
              </ListItemButton>
            </ListItem>
          )}
        </FixedSizeList>
      </Box>

      <Button variant="contained" onClick={handleSubmit}>SUBMIT</Button>
    </Box>
  );
}
