import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert } from "@mui/material";

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username === "admin" && password === "123456qwe!#") {
      onLogin();
    } else {
      setError("Usuário ou senha inválidos.");
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      sx={{
        backgroundImage: "url('/Imagem WhatsApp 2025-04-12 às 19.15.56_f58ed0de.jpg')", // Caminho relativo para a imagem na pasta public
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        p={4}
        bgcolor="rgba(255, 255, 255, 0.8)" // Fundo branco com transparência
        borderRadius={2}
        boxShadow={3}
        textAlign="center"
        width="300px"
        border="2px solid white" // Bordas brancas
      >
        <Typography variant="h5" mb={2}>
          Login
        </Typography>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <TextField
          label="Usuário"
          variant="outlined"
          fullWidth
          margin="normal"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <TextField
          label="Senha"
          type="password"
          variant="outlined"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          sx={{ mt: 2 }}
        >
          Entrar
        </Button>
      </Box>
    </Box>
  );
};

export default Login;