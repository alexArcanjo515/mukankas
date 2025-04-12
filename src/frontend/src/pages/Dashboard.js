import React, { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from '@mui/material';
import {
    Flight as FlightIcon,
    People as PeopleIcon,
    Engineering as EngineeringIcon,
    Assessment as AssessmentIcon,
} from '@mui/icons-material';
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

function Dashboard() {
    const [stats, setStats] = useState({
        totalAvioes: 0,
        totalEmpregados: 0,
        totalTestes: 0,
        ultimosTestes: [],
    });

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const [avioesRes, empregadosRes, testesRes] = await Promise.all([
                axios.get(`${API_URL}/avioes`),
                axios.get(`${API_URL}/empregados`),
                axios.get(`${API_URL}/testes`),
            ]);

            setStats({
                totalAvioes: avioesRes.data.length,
                totalEmpregados: empregadosRes.data.length,
                totalTestes: testesRes.data.length,
                ultimosTestes: testesRes.data.slice(-5).reverse(),
            });
        } catch (error) {
            console.error('Erro ao carregar estatísticas:', error);
        }
    };

    const StatCard = ({ title, value, icon: Icon, color }) => (
        <Paper
            sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: color,
                color: 'white',
            }}
        >
            <Icon sx={{ fontSize: 40, mb: 1 }} />
            <Typography variant="h4">{value}</Typography>
            <Typography variant="subtitle1">{title}</Typography>
        </Paper>
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                Dashboard
            </Typography>

            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total de Aviões"
                        value={stats.totalAvioes}
                        icon={FlightIcon}
                        color="#1a73e8"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total de Empregados"
                        value={stats.totalEmpregados}
                        icon={PeopleIcon}
                        color="#4caf50"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Total de Testes"
                        value={stats.totalTestes}
                        icon={EngineeringIcon}
                        color="#f44336"
                    />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <StatCard
                        title="Média de Testes por Avião"
                        value={(stats.totalTestes / stats.totalAvioes).toFixed(1)}
                        icon={AssessmentIcon}
                        color="#ff9800"
                    />
                </Grid>
            </Grid>

            <Typography variant="h5" gutterBottom>
                Últimos Testes Realizados
            </Typography>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avião</TableCell>
                            <TableCell>Data</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Resultado</TableCell>
                            <TableCell>Empregado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {stats.ultimosTestes.map((teste) => (
                            <TableRow key={teste.id}>
                                <TableCell>{teste.numero_registo_aviao}</TableCell>
                                <TableCell>
                                    {new Date(teste.data_teste).toLocaleDateString('pt-BR')}
                                </TableCell>
                                <TableCell>{teste.tipo_teste}</TableCell>
                                <TableCell>{teste.resultado}</TableCell>
                                <TableCell>{teste.nome_empregado}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
}

export default Dashboard; 