const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// Middleware de validação
const validateAviao = [
    body('numero_registo').isString().notEmpty(),
    body('codigo_modelo').isString().notEmpty()
];

// Listar todos os aviões
router.get('/', async (req, res) => {
    try {
        const [avioes] = await db.query(`
            SELECT a.*, m.nome_modelo, m.capacidade, m.peso 
            FROM avioes a
            JOIN modelos_avioes m ON a.codigo_modelo = m.codigo_modelo
        `);
        res.json(avioes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar aviões' });
    }
});

// Adicionar novo avião
router.post('/', validateAviao, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { numero_registo, codigo_modelo } = req.body;
        await db.query(
            'INSERT INTO avioes (numero_registo, codigo_modelo) VALUES (?, ?)',
            [numero_registo, codigo_modelo]
        );
        res.status(201).json({ message: 'Avião registrado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar avião' });
    }
});

// Atualizar avião
router.put('/:numero_registo', validateAviao, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { codigo_modelo } = req.body;
        const { numero_registo } = req.params;
        
        await db.query(
            'UPDATE avioes SET codigo_modelo = ? WHERE numero_registo = ?',
            [codigo_modelo, numero_registo]
        );
        res.json({ message: 'Avião atualizado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao atualizar avião' });
    }
});

// Deletar avião
router.delete('/:numero_registo', async (req, res) => {
    try {
        const { numero_registo } = req.params;
        await db.query('DELETE FROM avioes WHERE numero_registo = ?', [numero_registo]);
        res.json({ message: 'Avião deletado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao deletar avião' });
    }
});

module.exports = router; 