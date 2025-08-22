
import React, { useState, useRef } from 'react';
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  Box,
  TextField,
  Card,
  CardContent,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  marginTop: theme.spacing(4),
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  padding: theme.spacing(3),
  gap: theme.spacing(3),
}));

export function AIGenerator() {
  const [prompt, setPrompt] = useState<string>('');
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  const handleStop = () => {
    if (socketRef.current) {
      socketRef.current.close();
    }
    setLoading(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setGeneratedContent('');
    setError(null);
    setLoading(true);
    
    // Open a new WebSocket connection
    const socket = new WebSocket('ws://localhost:8000/ws/generate-content/');
    socketRef.current = socket;

    socket.onopen = () => {
      console.log('WebSocket connected');
      socket.send(JSON.stringify({ prompt }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.status === 'streaming') {
        setGeneratedContent(prevContent => prevContent + data.content);
      } else if (data.status === 'complete') {
        setLoading(false);
        socket.close();
      } else if (data.status === 'error') {
        setError(data.message);
        setLoading(false);
        socket.close();
      }
    };

    socket.onclose = () => {
      console.log('WebSocket disconnected');
    };

    socket.onerror = (err) => {
      console.error('WebSocket error:', err);
      setError('WebSocket connection failed.');
      setLoading(false);
    };
  };

  return (
    <StyledContainer maxWidth="md">
      <Typography variant="h4" component="h1" gutterBottom>
        ContentFlow AI Generator
      </Typography>

      <form onSubmit={handleSubmit} style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
        <TextField
          label="Enter your prompt"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={loading || prompt.trim() === ''}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Content'}
          </Button>
          {loading && (
            <Button
              variant="outlined"
              color="secondary"
              onClick={handleStop}
            >
              Stop
            </Button>
          )}
        </Box>
      </form>

      {generatedContent && (
        <Card sx={{ width: '100%', mt: 4 }}>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Generated Content
            </Typography>
            <Typography variant="body1" whiteSpace="pre-wrap">
              {generatedContent}
            </Typography>
          </CardContent>
        </Card>
      )}

      {error && (
        <Typography variant="body1" color="error" sx={{ mt: 2 }}>
          {error}
        </Typography>
      )}
    </StyledContainer>
  );
}