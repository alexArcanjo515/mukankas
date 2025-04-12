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
    Grid,
    FormControl,
    InputLabel,
    Select,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { toast } from 'react-toastify';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function Testes() {
    const [testes, setTestes] = useState([]);
    const [avioes, setAvioes] = useState([]);
    const [empregados, setEmpregados] = useState([]);
    const [tiposTeste, setTiposTeste] = useState([]);
    const [open, setOpen] = useState(false);
    const [editing, setEditing] = useState(false);
    const [formData, setFormData] = useState({
        numero_registo: '',
        data_realizacao: '',
        numero_ana: '',
        pontuacao_obtida: '',
        numero_bi: '',
        horas_gastas: ''
    });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                await loadTestes();
                await delay(1000); // Atraso de 1 segundo
                await loadAvioes();
                await delay(1000);
                await loadEmpregados();
                await delay(1000);
                await loadTiposTeste();
            } catch (error) {
                console.error('Erro ao carregar dados:', error);
            }
        };
        loadData();
    }, []);

    const loadTestes = async () => {
        try {
            console.log('Carregando testes...');
            const response = await axios.get(`${API_URL}/testes/realizados`);
            console.log('Dados recebidos:', response.data);
            setTestes(response.data);
        } catch (error) {
            console.error('Erro ao carregar testes:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error('Erro ao carregar testes realizados');
        }
    };

    const loadAvioes = async () => {
        try {
            const response = await axios.get(`${API_URL}/avioes`);
            setAvioes(response.data);
        } catch (error) {
            console.error('Erro ao carregar aviões:', error);
            toast.error('Erro ao carregar aviões');
        }
    };

    const loadEmpregados = async () => {
        try {
            const response = await axios.get(`${API_URL}/empregados`);
            // Filtrar apenas técnicos
            const tecnicos = response.data.filter(emp => emp.tipo === 'tecnico');
            setEmpregados(tecnicos);
        } catch (error) {
            console.error('Erro ao carregar empregados:', error);
            toast.error('Erro ao carregar empregados');
        }
    };

    const loadTiposTeste = async () => {
        try {
            const response = await axios.get(`${API_URL}/testes`);
            setTiposTeste(response.data);
        } catch (error) {
            console.error('Erro ao carregar tipos de teste:', error);
            toast.error('Erro ao carregar tipos de teste');
        }
    };

    const handleOpen = () => {
        setOpen(true);
        setEditing(false);
        setEditingId(null);
        setFormData({
            numero_registo: '',
            data_realizacao: '',
            numero_ana: '',
            pontuacao_obtida: '',
            numero_bi: '',
            horas_gastas: ''
        });
    };

    const handleClose = () => {
        setOpen(false);
        setEditing(false);
        setEditingId(null);
        setFormData({
            numero_registo: '',
            data_realizacao: '',
            numero_ana: '',
            pontuacao_obtida: '',
            numero_bi: '',
            horas_gastas: ''
        });
    };

    const handleEdit = (teste) => {
        setEditing(true);
        setEditingId(teste.id);
        setFormData({
            numero_registo: teste.numero_registo || '',
            data_realizacao: teste.data_realizacao || '',
            numero_ana: teste.numero_ana || '',
            pontuacao_obtida: teste.pontuacao_obtida || '',
            numero_bi: teste.numero_bi || '',
            horas_gastas: teste.horas_gastas || ''
        });
        setOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('Enviando dados do formulário:', formData);

            const dataToSend = {
                ...formData,
                nome_teste: formData.numero_ana, // Usa o valor digitado como nome do teste
                horas_gastas: parseFloat(formData.horas_gastas),
                pontuacao_obtida: parseInt(formData.pontuacao_obtida, 10)
            };

            console.log('Dados processados para envio:', dataToSend);

            if (editing) {
                await axios.put(`${API_URL}/testes/realizados/${editingId}`, dataToSend);
                toast.success('Teste atualizado com sucesso');
            } else {
                await axios.post(`${API_URL}/testes/realizados`, dataToSend);
                toast.success('Teste adicionado com sucesso');
            }
            handleClose();
            loadTestes();
        } catch (error) {
            console.error('Erro ao salvar teste:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            toast.error(error.response?.data?.error || 'Erro ao salvar teste');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja excluir este teste?')) {
            try {
                console.log('Tentando excluir teste com ID:', id);
                await axios.delete(`${API_URL}/testes/realizados/${id}`);
                toast.success('Teste excluído com sucesso');
                loadTestes();
            } catch (error) {
                console.error('Erro ao excluir teste:', error);
                toast.error('Erro ao excluir teste');
            }
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                <Typography variant="h4">Gestão de Testes</Typography>
                <Button variant="contained" color="primary" onClick={handleOpen}>
                    Adicionar Teste
                </Button>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avião</TableCell>
                            <TableCell>Data do Teste</TableCell>
                            <TableCell>Tipo de Teste</TableCell>
                            <TableCell>Resultado</TableCell>
                            <TableCell>Empregado</TableCell>
                            <TableCell>Horas Gastas</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
    {testes.map((teste) => (
        <TableRow key={teste.id}>
            <TableCell>{teste.numero_registo}</TableCell>
            <TableCell>{new Date(teste.data_realizacao).toLocaleDateString('pt-BR')}</TableCell>
            <TableCell>{teste.nome_teste}</TableCell> {/* Alterado de nome_testes para nome_teste */}
            <TableCell>{teste.pontuacao_obtida}</TableCell>
            <TableCell>{teste.numero_bi}</TableCell> {/* Mostra o BI diretamente */}
            <TableCell>{teste.horas_gastas}</TableCell>
            <TableCell>
                <IconButton onClick={() => handleEdit(teste)}>
                    <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDelete(teste.id)}>
                    <DeleteIcon />
                </IconButton>
            </TableCell>
        </TableRow>
    ))}
</TableBody>
                </Table>
            </TableContainer>

            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{editing ? 'Editar Teste' : 'Adicionar Teste'}</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Avião</InputLabel>
                                <Select
                                    name="numero_registo"
                                    value={formData.numero_registo}
                                    onChange={handleChange}
                                    required
                                >
                                    {avioes.map((aviao) => (
                                        <MenuItem key={`aviao-${aviao.numero_registo}`} value={aviao.numero_registo}>
                                            {aviao.numero_registo}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Data do Teste"
                                type="date"
                                name="data_realizacao"
                                value={formData.data_realizacao}
                                onChange={handleChange}
                                required
                                InputLabelProps={{
                                    shrink: true,
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Tipo de Teste"
                                name="numero_ana"
                                value={formData.numero_ana}
                                onChange={handleChange}
                                required
                                helperText="Digite o identificador do tipo de teste"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Resultado"
                                type="number"
                                name="pontuacao_obtida"
                                value={formData.pontuacao_obtida}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 0 }}
                                helperText={formData.numero_ana ? `Máximo: ${tiposTeste.find(t => t.numero_ana === formData.numero_ana)?.pontuacao_maxima || 0}` : ''}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Empregado</InputLabel>
                                <Select
                                    name="numero_bi"
                                    value={formData.numero_bi}
                                    onChange={handleChange}
                                    required
                                >
                                    {empregados.map((empregado) => (
                                        <MenuItem key={`empregado-${empregado.numero_bi}`} value={empregado.numero_bi}>
                                            {empregado.nome} - {empregado.numero_bi}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Horas Gastas"
                                type="number"
                                name="horas_gastas"
                                value={formData.horas_gastas}
                                onChange={handleChange}
                                required
                                inputProps={{ min: 0, step: 0.5 }}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancelar</Button>
                    <Button onClick={handleSubmit} variant="contained" color="primary">
                        {editing ? 'Atualizar' : 'Adicionar'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default Testes;