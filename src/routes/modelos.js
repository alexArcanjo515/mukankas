const express = require('express');
const router = express.Router();
const db = require('../config/database');

// Listar todos os modelos
router.get('/', async (req, res) => {
    try {
        const [modelos] = await db.query('SELECT * FROM modelos_avioes');
        res.json(modelos);
    } catch (error) {
        console.error('Erro ao listar modelos:', error);
        res.status(500).json({ error: 'Erro ao listar modelos' });
    }
});

// Criar novo modelo
router.post('/', async (req, res) => {
    const { codigo_modelo, nome_modelo, capacidade, peso } = req.body;
    
    try {
        const [result] = await db.query(
            'INSERT INTO modelos_avioes (codigo_modelo, nome_modelo, capacidade, peso) VALUES (?, ?, ?, ?)',
            [codigo_modelo, nome_modelo, capacidade, peso]
        );
        
        res.status(201).json({
            codigo_modelo,
            nome_modelo,
            capacidade,
            peso
        });
    } catch (error) {
        console.error('Erro ao criar modelo:', error);
        res.status(500).json({ error: 'Erro ao criar modelo' });
    }
});

// Atualizar modelo
router.put('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    const { nome_modelo, capacidade, peso } = req.body;
    
    try {
        await db.query(
            'UPDATE modelos_avioes SET nome_modelo = ?, capacidade = ?, peso = ? WHERE codigo_modelo = ?',
            [nome_modelo, capacidade, peso, codigo]
        );
        
        res.json({
            codigo_modelo: codigo,
            nome_modelo,
            capacidade,
            peso
        });
    } catch (error) {
        console.error('Erro ao atualizar modelo:', error);
        res.status(500).json({ error: 'Erro ao atualizar modelo' });
    }
});

// Excluir modelo
router.delete('/:codigo', async (req, res) => {
    const { codigo } = req.params;
    
    try {
        await db.query('DELETE FROM modelos_avioes WHERE codigo_modelo = ?', [codigo]);
        res.status(204).send();
    } catch (error) {
        console.error('Erro ao excluir modelo:', error);
        res.status(500).json({ error: 'Erro ao excluir modelo' });
    }
});

module.exports = router; 