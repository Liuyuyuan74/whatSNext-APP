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
  return (
    <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="name" variant="outlined" />
      {/* <TextField id="filled-basic" label="Filled" variant="filled" />
      <TextField id="standard-basic" label="Standard" variant="standard" /> */}
      <FormGroup>
        <FormControlLabel control={<Checkbox defaultChecked />} label="staple food" />
        <FormControlLabel control={<Checkbox defaultChecked />} label="protein" />
        <FormControlLabel control={<Checkbox defaultChecked />} label="vegetable" />
        {/* <FormControlLabel required control={<Checkbox />} label="Required" />
        <FormControlLabel disabled control={<Checkbox />} label="Disabled" /> */}
      </FormGroup>
      <TextField id="outlined-basic" label="food material" variant="outlined" />
      <Stack direction="row" spacing={2}>
        <Button variant="contained" endIcon={<AddCircleIcon />}>
          Add
        </Button>
      </Stack>
      <Box
        sx={{ width: '100%', height: 400, maxWidth: 360, bgcolor: 'background.paper' }}
      >
        <FixedSizeList
          height={400}
          width={360}
          itemSize={46}
          itemCount={200}
          overscanCount={5}
        >
          {renderRow}
        </FixedSizeList>
      </Box>
      <Button variant="contained" >
        SUBMIT
      </Button>
    </Box>
  );
}

function renderRow(props) {
  const { index, style } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <ListItemText primary={`Item ${index + 1}`} />
      </ListItemButton>
    </ListItem>
  );
}