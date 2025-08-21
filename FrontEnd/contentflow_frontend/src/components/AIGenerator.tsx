
import React, { useState } from 'react';
import axios from 'axios';
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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedContent('');

    try {
      const response = await axios.post('http://localhost:8000/api/generate-content/', { prompt });
      setGeneratedContent(response.data.generated_content);
    } catch (err) {
      console.error(err);
      setError('Failed to generate content. Please try again.');
    } finally {
      setLoading(false);
    }
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
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={loading || prompt.trim() === ''}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate Content'}
        </Button>
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