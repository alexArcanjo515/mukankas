const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// Middleware de validação para testes
const validateTeste = [
    body('nome').isString().notEmpty(),
    body('pontuacao_maxima').isInt({ min: 1 })
];

// Middleware de validação para testes realizados
const validateTesteRealizado = [
    body('numero_registo').isString().notEmpty(),
    body('numero_bi').isString().notEmpty(),
    body('data_realizacao').isISO8601(),
    body('horas_gastas').isFloat({ min: 0 }),
    body('pontuacao_obtida').isInt({ min: 0 }),
    body('nome_teste').isString().notEmpty()
];

// Listar todos os testes
router.get('/', async (req, res) => {
    try {
        const [testes] = await db.query('SELECT * FROM testes');
        res.json(testes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar testes' });
    }
});

// Adicionar novo teste
router.post('/', validateTeste, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { nome, pontuacao_maxima } = req.body;
        await db.query(
            'INSERT INTO testes (nome, pontuacao_maxima) VALUES (?, ?)',
            [nome, pontuacao_maxima]
        );
        res.status(201).json({ message: 'Teste registrado com sucesso' });
    } catch (error) {
        res.status(500).json({ error: 'Erro ao registrar teste' });
    }
});

// Registrar realização de teste
router.post('/realizados', validateTesteRealizado, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { numero_registo, numero_bi, data_realizacao, horas_gastas, pontuacao_obtida, nome_teste } = req.body;

        await db.query(
            'INSERT INTO testes_realizados (numero_registo, numero_bi, data_realizacao, horas_gastas, pontuacao_obtida, nome_teste) VALUES (?, ?, ?, ?, ?, ?)',
            [numero_registo, numero_bi, data_realizacao, horas_gastas, pontuacao_obtida, nome_teste]
        );

        res.status(201).json({ message: 'Teste realizado registrado com sucesso' });
    } catch (error) {
        console.error('Erro ao registrar teste realizado:', error);
        res.status(500).json({ error: 'Erro ao registrar teste realizado' });
    }
});

// Listar testes realizados por avião
router.get('/realizados/aviao/:numero_registo', async (req, res) => {
    try {
        const { numero_registo } = req.params;
        const [testes] = await db.query(
            'SELECT * FROM testes_realizados WHERE numero_registo = ? ORDER BY data_realizacao DESC',
            [numero_registo]
        );
        res.json(testes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar testes realizados' });
    }
});

// Listar testes realizados por técnico
router.get('/realizados/tecnico/:numero_bi', async (req, res) => {
    try {
        const { numero_bi } = req.params;
        const [testes] = await db.query(
            'SELECT * FROM testes_realizados WHERE numero_bi = ? ORDER BY data_realizacao DESC',
            [numero_bi]
        );
        res.json(testes);
    } catch (error) {
        res.status(500).json({ error: 'Erro ao buscar testes realizados' });
    }
});

// Listar todos os testes realizados
router.get('/realizados', async (req, res) => {
    try {
        const [testes] = await db.query(`
            SELECT 
                tr.id,
                tr.numero_registo,
                tr.numero_bi,
                tr.data_realizacao,
                tr.horas_gastas,
                tr.pontuacao_obtida,
                tr.nome_teste,
                a.numero_registo as aviao_registo,
                e.nome as nome_empregado
            FROM testes_realizados tr
            LEFT JOIN avioes a ON tr.numero_registo = a.numero_registo
            LEFT JOIN empregados e ON tr.numero_bi = e.numero_bi
            ORDER BY tr.data_realizacao DESC
        `);
        
        res.json(testes || []);
    } catch (error) {
        console.error('Erro ao buscar testes realizados:', error);
        res.status(500).json({ 
            error: 'Erro ao buscar testes realizados',
            details: error.message
        });
    }
});

// Excluir teste realizado
router.delete('/realizados/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.query('DELETE FROM testes_realizados WHERE id = ?', [id]);
        res.json({ message: 'Teste excluído com sucesso' });
    } catch (error) {
        console.error('Erro ao excluir teste:', error);
        res.status(500).json({ error: 'Erro ao excluir teste' });
    }
});

module.exports = router;