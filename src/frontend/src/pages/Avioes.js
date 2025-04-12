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
    MenuItem,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function Avioes() {
    const [avioes, setAvioes] = useState([]);
    const [modelos, setModelos] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        numero_registo: '',
        codigo_modelo: '',
    });
    const [editing, setEditing] = useState(false);

    useEffect(() => {
        loadAvioes();
        loadModelos();
    }, []);

    const loadAvioes = async () => {
        try {
            const response = await axios.get(`${API_URL}/avioes`);
            setAvioes(response.data);
        } catch (error) {
            toast.error('Erro ao carregar aviões');
        }
    };

    const loadModelos = async () => {
        try {
            const response = await axios.get(`${API_URL}/modelos`);
            setModelos(response.data);
        } catch (error) {
            toast.error('Erro ao carregar modelos');
        }
    };

    const handleOpen = () => {
        setOpen(true);
        setEditing(false);
        setFormData({
            numero_registo: '',
            codigo_modelo: '',
        });
    };

    const handleClose = () => {
        setOpen(false);
        setEditing(false);
        setFormData({
            numero_registo: '',
            codigo_modelo: '',
        });
    };

    const handleEdit = (aviao) => {
        setEditing(true);
        setFormData({
            numero_registo: aviao.numero_registo,
            codigo_modelo: aviao.codigo_modelo,
        });
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editing) {
                await axios.put(`${API_URL}/avioes/${formData.numero_registo}`, formData);
                toast.success('Avião atualizado com sucesso');
            } else {
                await axios.post(`${API_URL}/avioes`, formData);
                toast.success('Avião adicionado com sucesso');
            }
            handleClose();
            loadAvioes();
        } catch (error) {
            toast.error('Erro ao salvar avião');
        }
    };

    const handleDelete = async (numeroRegisto) => {
        if (window.confirm('Tem certeza que deseja excluir este avião?')) {
            try {
                await axios.delete(`${API_URL}/avioes/${numeroRegisto}`);
                toast.success('Avião excluído com sucesso');
                loadAvioes();
            } catch (error) {
                toast.error('Erro ao excluir avião');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Gestão de Aviões</Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Adicionar Avião
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Número de Registro</TableCell>
                            <TableCell>Modelo</TableCell>
                            <TableCell>Capacidade</TableCell>
                            <TableCell>Peso (kg)</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {avioes.map((aviao) => (
                            <TableRow key={aviao.numero_registo}>
                                <TableCell>{aviao.numero_registo}</TableCell>
                                <TableCell>{aviao.nome_modelo}</TableCell>
                                <TableCell>{aviao.capacidade}</TableCell>
                                <TableCell>{aviao.peso}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(aviao)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(aviao.numero_registo)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>
                    {editing ? 'Editar Avião' : 'Adicionar Avião'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Número de Registro"
                            type="text"
                            fullWidth
                            value={formData.numero_registo}
                            onChange={(e) => setFormData({ ...formData, numero_registo: e.target.value })}
                            required
                            disabled={editing}
                        />
                        <TextField
                            margin="dense"
                            label="Modelo"
                            select
                            fullWidth
                            value={formData.codigo_modelo}
                            onChange={(e) => setFormData({ ...formData, codigo_modelo: e.target.value })}
                            required
                        >
                            {modelos.map((modelo) => (
                                <MenuItem key={modelo.codigo_modelo} value={modelo.codigo_modelo}>
                                    {modelo.nome_modelo}
                                </MenuItem>
                            ))}
                        </TextField>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleClose}>Cancelar</Button>
                        <Button type="submit" variant="contained" color="primary">
                            {editing ? 'Atualizar' : 'Adicionar'}
                        </Button>
                    </DialogActions>
                </form>
            </Dialog>
        </Box>
    );
}

export default Avioes; 