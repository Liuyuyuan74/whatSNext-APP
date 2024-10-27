import * as React from 'react';
import { useState, useEffect } from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

export default function CheckboxLabels({ ingredientsData, onSelectedIngredients }) {
  // Initialize state with all ingredients checked
  const [checkedItems, setCheckedItems] = useState({});

  // Update `checkedItems` whenever `ingredientsData` changes
  useEffect(() => {
    const initialCheckedState = {};
    ingredientsData.forEach(([ingredient]) => {
      initialCheckedState[ingredient] = true;
    });
    setCheckedItems(initialCheckedState);
  }, [ingredientsData]);

  // Effect to update parent component with the checked ingredients
  useEffect(() => {
    const selectedIngredients = Object.entries(checkedItems)
      .filter(([, isChecked]) => isChecked)
      .map(([ingredient]) => ingredient);
    onSelectedIngredients(selectedIngredients);
  }, [checkedItems, onSelectedIngredients]);

  // Handle checkbox change
  const handleChange = (ingredient) => {
    setCheckedItems((prevCheckedItems) => ({
      ...prevCheckedItems,
      [ingredient]: !prevCheckedItems[ingredient],
    }));
  };

  return (
    <FormGroup>
      {ingredientsData.map(([ingredient, quantity]) => (
        <FormControlLabel
          key={ingredient}
          control={
            <Checkbox
              checked={!!checkedItems[ingredient]}
              onChange={() => handleChange(ingredient)}
            />
          }
          label={`${ingredient} (Quantity: ${quantity})`}
        />
      ))}
    </FormGroup>
  );
}
