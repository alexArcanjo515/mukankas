import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import App from './App';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1a73e8',
        },
        secondary: {
            main: '#f8f9fa',
        },
    },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <BrowserRouter>
            <ThemeProvider theme={theme}>
                <App />
                <ToastContainer position="top-right" autoClose={3000} />
            </ThemeProvider>
        </BrowserRouter>
    </React.StrictMode>
); 