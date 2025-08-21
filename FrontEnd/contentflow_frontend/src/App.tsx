import './App.css'
import { Button, Container, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

// Create a simple styled container
const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

function App() {
  return (
    <>
     <StyledContainer maxWidth="sm">
      <Typography variant="h4" component="h1" gutterBottom>
        Welcome to ContentFlow!
      </Typography>
      <Button variant="contained" color="primary">
        Get Started
      </Button>
    </StyledContainer>
    </>
  )
}

export default App
