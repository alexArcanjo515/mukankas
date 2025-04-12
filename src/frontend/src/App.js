import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Importando os componentes
import Layout from './components/Layout';
import Avioes from './pages/Avioes';
import Empregados from './pages/Empregados';
import Testes from './pages/Testes';
import Modelos from './pages/Modelos';

// Criando o tema
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Layout>
        <Routes>
          <Route path="/" element={<Avioes />} />
          <Route path="/avioes" element={<Avioes />} />
          <Route path="/empregados" element={<Empregados />} />
          <Route path="/testes" element={<Testes />} />
          <Route path="/modelos" element={<Modelos />} />
        </Routes>
      </Layout>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App; 