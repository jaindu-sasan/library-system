import React from 'react';
import { Button, ButtonProps } from '@mui/material';

interface CustomButtonProps extends ButtonProps {
  // You can add custom props here if needed
}

const CustomButton: React.FC<CustomButtonProps> = (props) => {
  return (
    <Button
      variant="contained"
      color="primary"
      sx={{ textTransform: 'none', borderRadius: 2 }}
      {...props}
    >
      {props.children}
    </Button>
  );
};

export default CustomButton;
