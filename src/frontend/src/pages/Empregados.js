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

function Empregados() {
    const [empregados, setEmpregados] = useState([]);
    const [open, setOpen] = useState(false);
    const [formData, setFormData] = useState({
        numero_bi: '',
        endereco: '',
        telefone: '',
        numero_membro_sindicato: '',
        salario: '',
        tipo: '',
        data_ultimo_exame: ''
    });
    const [editing, setEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        loadEmpregados();
    }, []);

    const loadEmpregados = async () => {
        try {
            const response = await axios.get(`${API_URL}/empregados`);
            setEmpregados(response.data);
        } catch (error) {
            console.error('Erro detalhado ao carregar empregados:', error.response?.data || error.message);
            toast.error('Erro ao carregar empregados');
        }
    };

    const handleOpen = () => {
        setOpen(true);
        setEditing(false);
        setEditingId(null);
        setFormData({
            numero_bi: '',
            endereco: '',
            telefone: '',
            numero_membro_sindicato: '',
            salario: '',
            tipo: 'tecnico',
            data_ultimo_exame: ''
        });
    };

    const handleClose = () => {
        setOpen(false);
        setEditing(false);
        setEditingId(null);
        setFormData({
            numero_bi: '',
            endereco: '',
            telefone: '',
            numero_membro_sindicato: '',
            salario: '',
            tipo: 'tecnico',
            data_ultimo_exame: ''
        });
    };

    const handleEdit = (empregado) => {
        setEditing(true);
        setEditingId(empregado.numero_bi);
        setFormData({
            numero_bi: empregado.numero_bi,
            endereco: empregado.endereco,
            telefone: empregado.telefone,
            numero_membro_sindicato: empregado.numero_membro_sindicato,
            salario: empregado.salario,
            tipo: empregado.tipo,
            data_ultimo_exame: empregado.data_ultimo_exame ? empregado.data_ultimo_exame.split('T')[0] : ''
        });
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Verifica se o número de BI já existe (apenas para adição, não para edição)
            if (!editing) {
                const biExists = empregados.some(emp => emp.numero_bi === formData.numero_bi);
                if (biExists) {
                    toast.error('Já existe um empregado com este número de BI');
                    return;
                }
            }

            const dataToSend = {
                ...formData,
                salario: parseFloat(formData.salario)
            };
            
            if (editing) {
                await axios.put(`${API_URL}/empregados/${editingId}`, dataToSend);
                toast.success('Empregado atualizado com sucesso');
            } else {
                await axios.post(`${API_URL}/empregados`, dataToSend);
                toast.success('Empregado adicionado com sucesso');
            }
            handleClose();
            loadEmpregados();
        } catch (error) {
            console.error('Erro detalhado ao salvar empregado:', error.response?.data || error.message);
            if (error.response?.data?.details?.includes('Duplicate entry')) {
                toast.error('Já existe um empregado com este número de BI');
            } else {
                toast.error('Erro ao salvar empregado');
            }
        }
    };

    const handleDelete = async (numero_bi) => {
        if (window.confirm('Tem certeza que deseja excluir este empregado?')) {
            try {
                await axios.delete(`${API_URL}/empregados/${numero_bi}`);
                toast.success('Empregado excluído com sucesso');
                loadEmpregados();
            } catch (error) {
                toast.error('Erro ao excluir empregado');
            }
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Gestão de Empregados</Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Adicionar Empregado
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Número BI</TableCell>
                            <TableCell>Endereço</TableCell>
                            <TableCell>Telefone</TableCell>
                            <TableCell>Número Sindicato</TableCell>
                            <TableCell>Salário</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Data Último Exame</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {empregados.map((empregado) => (
                            <TableRow key={empregado.numero_bi}>
                                <TableCell>{empregado.numero_bi}</TableCell>
                                <TableCell>{empregado.endereco}</TableCell>
                                <TableCell>{empregado.telefone}</TableCell>
                                <TableCell>{empregado.numero_membro_sindicato}</TableCell>
                                <TableCell>kz {empregado.salario.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</TableCell>
                                <TableCell>{empregado.tipo}</TableCell>
                                <TableCell>
                                    {empregado.data_ultimo_exame 
                                        ? new Date(empregado.data_ultimo_exame).toLocaleDateString('pt-BR')
                                        : '-'}
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEdit(empregado)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDelete(empregado.numero_bi)}>
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
                    {editing ? 'Editar Empregado' : 'Adicionar Empregado'}
                </DialogTitle>
                <form onSubmit={handleSubmit}>
                    <DialogContent>
                        <TextField
                            autoFocus
                            margin="dense"
                            label="Número BI"
                            type="text"
                            fullWidth
                            value={formData.numero_bi}
                            onChange={(e) => setFormData({ ...formData, numero_bi: e.target.value })}
                            required
                            disabled={editing}
                        />
                        <TextField
                            margin="dense"
                            label="Endereço"
                            type="text"
                            fullWidth
                            value={formData.endereco}
                            onChange={(e) => setFormData({ ...formData, endereco: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Telefone"
                            type="text"
                            fullWidth
                            value={formData.telefone}
                            onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Número Sindicato"
                            type="text"
                            fullWidth
                            value={formData.numero_membro_sindicato}
                            onChange={(e) => setFormData({ ...formData, numero_membro_sindicato: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Salário"
                            type="number"
                            fullWidth
                            value={formData.salario}
                            onChange={(e) => setFormData({ ...formData, salario: e.target.value })}
                            required
                        />
                        <TextField
                            margin="dense"
                            label="Tipo"
                            select
                            fullWidth
                            value={formData.tipo}
                            onChange={(e) => {
                                const newTipo = e.target.value;
                                setFormData({
                                    ...formData,
                                    tipo: newTipo,
                                    data_ultimo_exame: newTipo === 'tecnico' ? '' : formData.data_ultimo_exame
                                });
                            }}
                            required
                        >
                            <MenuItem value="tecnico">Técnico</MenuItem>
                            <MenuItem value="controlador">Controlador</MenuItem>
                        </TextField>
                        <TextField
                            margin="dense"
                            label="Data Último Exame"
                            type="date"
                            fullWidth
                            value={formData.data_ultimo_exame}
                            onChange={(e) => setFormData({ ...formData, data_ultimo_exame: e.target.value })}
                            InputLabelProps={{
                                shrink: true,
                            }}
                            disabled={formData.tipo !== 'controlador'}
                            required={formData.tipo === 'controlador'}
                        />
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

export default Empregados; 