import React from 'react';
import { Card as MuiCard, CardContent, CardProps as MuiCardProps, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { theme } from '../../styles/theme';

// Custom styled Card component
const CustomCard = styled(MuiCard)(({ theme }) => ({
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  borderRadius: theme.shape.borderRadius,
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
}));

interface CardProps extends MuiCardProps {
  children: React.ReactNode;
  title?: string;
}

const Card: React.FC<CardProps> = ({ children, title, ...props }) => {
  return (
    <CustomCard {...props}>
      {title && (
        <Typography variant="h6" component="h2" gutterBottom sx={{ padding: theme.spacing(2, 2, 0) }}>
          {title}
        </Typography>
      )}
      <CardContent>{children}</CardContent>
    </CustomCard>
  );
};

export default Card;

// TODO: Implement responsive design for different screen sizes
// TODO: Add accessibility attributes for better screen reader support