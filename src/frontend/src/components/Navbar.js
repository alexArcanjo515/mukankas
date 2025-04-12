import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

function Navbar() {
    return (
        <AppBar position="static">
            <Toolbar>
                <FlightTakeoffIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Aeroporto Mukanka
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/">
                        Dashboard
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/avioes">
                        Aviões
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/empregados">
                        Empregados
                    </Button>
                    <Button color="inherit" component={RouterLink} to="/testes">
                        Testes
                    </Button>
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Navbar; 