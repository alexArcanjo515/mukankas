import React, { useState, useEffect } from 'react';
import {
    Box,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Typography,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';

function Modelos() {
    const [modelos, setModelos] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [formData, setFormData] = useState({
        codigo_modelo: '',
        nome_modelo: '',
        capacidade: '',
        peso: '',
    });
    const [editingCodigo, setEditingCodigo] = useState(null);

    useEffect(() => {
        fetchModelos();
    }, []);

    const fetchModelos = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/modelos');
            const data = await response.json();
            setModelos(data);
        } catch (error) {
            toast.error('Erro ao carregar modelos');
        }
    };

    const handleOpenDialog = (modelo = null) => {
        if (modelo) {
            setFormData(modelo);
            setEditingCodigo(modelo.codigo_modelo);
        } else {
            setFormData({
                codigo_modelo: '',
                nome_modelo: '',
                capacidade: '',
                peso: '',
            });
            setEditingCodigo(null);
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setFormData({
            codigo_modelo: '',
            nome_modelo: '',
            capacidade: '',
            peso: '',
        });
        setEditingCodigo(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const url = editingCodigo
                ? `http://localhost:3000/api/modelos/${editingCodigo}`
                : 'http://localhost:3000/api/modelos';
            const method = editingCodigo ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success(
                    editingCodigo ? 'Modelo atualizado com sucesso!' : 'Modelo criado com sucesso!'
                );
                fetchModelos();
                handleCloseDialog();
            } else {
                throw new Error('Erro ao salvar modelo');
            }
        } catch (error) {
            toast.error('Erro ao salvar modelo');
        }
    };

    const handleDelete = async (codigo) => {
        if (window.confirm('Tem certeza que deseja excluir este modelo?')) {
            try {
                const response = await fetch(`http://localhost:3000/api/modelos/${codigo}`, {
                    method: 'DELETE',
                });

                if (response.ok) {
                    toast.success('Modelo excluído com sucesso!');
                    fetchModelos();
                } else {
                    throw new Error('Erro ao excluir modelo');
                }
            } catch (error) {
                toast.error('Erro ao excluir modelo');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Modelos de Aviões</Typography>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleOpenDialog()}
                >
                    Novo Modelo
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Código</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Capacidade</TableCell>
                            <TableCell>Peso (kg)</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {modelos.map((modelo) => (
                            <TableRow key={modelo.codigo_modelo}>
                                <TableCell>{modelo.codigo_modelo}</TableCell>
                                <TableCell>{modelo.nome_modelo}</TableCell>
                                <TableCell>{modelo.capacidade}</TableCell>
                                <TableCell>{modelo.peso}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenDialog(modelo)}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDelete(modelo.codigo_modelo)}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>
                    {editingCodigo ? 'Editar Modelo' : 'Novo Modelo'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            name="codigo_modelo"
                            label="Código do Modelo"
                            type="text"
                            fullWidth
                            value={formData.codigo_modelo}
                            onChange={handleInputChange}
                            required
                            disabled={editingCodigo !== null}
                        />
                        <TextField
                            margin="dense"
                            name="nome_modelo"
                            label="Nome do Modelo"
                            type="text"
                            fullWidth
                            value={formData.nome_modelo}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            margin="dense"
                            name="capacidade"
                            label="Capacidade"
                            type="number"
                            fullWidth
                            value={formData.capacidade}
                            onChange={handleInputChange}
                            required
                        />
                        <TextField
                            margin="dense"
                            name="peso"
                            label="Peso (kg)"
                            type="number"
                            fullWidth
                            value={formData.peso}
                            onChange={handleInputChange}
                            required
                        />
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {editingCodigo ? 'Atualizar' : 'Criar'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Modelos; 