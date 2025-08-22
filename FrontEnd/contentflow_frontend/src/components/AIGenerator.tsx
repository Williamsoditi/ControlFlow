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
    Collapse,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { Send as SendIcon, Stop as StopIcon, ContentCopy as ContentCopyIcon } from '@mui/icons-material';
import { IconButton } from '@mui/material';

const StyledContainer = styled(Container)(({ theme }) => ({
    marginTop: theme.spacing(6), // Increased top margin
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    padding: theme.spacing(4), // Increased padding
    gap: theme.spacing(4), // Increased gap
    backgroundColor: theme.palette.background.paper, // Ensure background contrast
    borderRadius: theme.shape.borderRadius, // Slightly rounded corners
    boxShadow: theme.shadows[4], // Subtle shadow
}));

const StyledForm = styled('form')(({ theme }) => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: theme.spacing(2),
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const ResultsCard = styled(Card)(({ theme }) => ({
    width: '100%',
    marginTop: theme.spacing(3),
    boxShadow: theme.shadows[2],
}));

const ResultsCardContent = styled(CardContent)(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
}));

const GeneratedTypography = styled(Typography)(({ theme }) => ({
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace', // A monospaced font can sometimes look cleaner for generated text
    fontSize: '1rem',
    lineHeight: 1.6,
}));

const ActionButtons = styled(Box)(({ theme }) => ({
    display: 'flex',
    gap: theme.spacing(1),
    marginTop: theme.spacing(1),
    justifyContent: 'flex-end',
}));

export function AIGenerator() {
    const [prompt, setPrompt] = useState<string>('');
    const [generatedContent, setGeneratedContent] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const socketRef = useRef<WebSocket | null>(null);
    const [showResults, setShowResults] = useState<boolean>(false);

    const handleStop = () => {
        if (socketRef.current) {
            socketRef.current.close();
        }
        setLoading(false);
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent);
        // Optionally provide visual feedback to the user that the text has been copied
        alert('Content copied to clipboard!');
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setGeneratedContent('');
        setError(null);
        setLoading(true);
        setShowResults(false); // Hide previous results on new submission

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
                setShowResults(true); // Show results when complete
            } else if (data.status === 'error') {
                setError(data.message);
                setLoading(false);
                socket.close();
                setShowResults(false);
            }
        };

        socket.onclose = () => {
            console.log('WebSocket disconnected');
        };

        socket.onerror = (err) => {
            console.error('WebSocket error:', err);
            setError('WebSocket connection failed.');
            setLoading(false);
            setShowResults(false);
        };
    };

    return (
        <StyledContainer maxWidth="md">
            <Typography variant="h4" component="h1" gutterBottom>
                ContentFlow AI Generator
            </Typography>

            <StyledForm onSubmit={handleSubmit}>
                <StyledTextField
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
                        startIcon={<SendIcon />}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Generate'}
                    </Button>
                    {loading && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={handleStop}
                            startIcon={<StopIcon />}
                        >
                            Stop
                        </Button>
                    )}
                </Box>
            </StyledForm>

            <Collapse in={loading} sx={{ mt: 3 }}>
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <CircularProgress size={40} />
                    <Typography variant="body1" sx={{ mt: 2 }}>
                        Generating content...
                    </Typography>
                </Box>
            </Collapse>

            <Collapse in={showResults || generatedContent !== ''} sx={{ width: '100%' }}>
                <ResultsCard>
                    <ResultsCardContent>
                        <Typography variant="h6" gutterBottom>
                            Generated Content
                        </Typography>
                        <GeneratedTypography variant="body1">
                            {generatedContent}
                        </GeneratedTypography>
                        {generatedContent && (
                            <ActionButtons>
                                <IconButton aria-label="copy" onClick={handleCopy}>
                                    <ContentCopyIcon />
                                </IconButton>
                            </ActionButtons>
                        )}
                    </ResultsCardContent>
                </ResultsCard>
            </Collapse>

            {error && (
                <Typography variant="body2" color="error" sx={{ mt: 2 }}>
                    Error: {error}
                </Typography>
            )}
        </StyledContainer>
    );
}