const express = require('express');
const router = express.Router();
const db = require('../config/database');
const { body, validationResult } = require('express-validator');

// Middleware de validação
const validateEmpregado = [
    body('numero_bi').isString().notEmpty(),
    body('endereco').isString().notEmpty(),
    body('telefone').isString().notEmpty(),
    body('numero_membro_sindicato').isString().notEmpty(),
    body('salario').isFloat({ min: 0 }),
    body('tipo').isIn(['tecnico', 'controlador'])
];

// Listar todos os empregadosl
router.get('/', async (req, res) => {
    try {
        const [empregados] = await db.query(`
            SELECT e.*, 
                   CASE 
                       WHEN e.tipo = 'controlador' THEN c.data_ultimo_exame
                       ELSE NULL
                   END as data_ultimo_exame
            FROM empregados e
            LEFT JOIN controladores c ON e.numero_bi = c.numero_bi
        `);
        res.json(empregados);
    } catch (error) {
        console.error('Erro ao buscar empregados:', error);
        res.status(500).json({ error: 'Erro ao buscar empregados', details: error.message });
    }
});

// Adicionar novo empregado
router.post('/', validateEmpregado, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        console.error('Erro de validação:', errors.array());
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { numero_bi, endereco, telefone, numero_membro_sindicato, salario, tipo, data_ultimo_exame } = req.body;
        
        // Iniciar transação
        await db.query('START TRANSACTION');
        
        // Inserir empregado
        await db.query(
            'INSERT INTO empregados (numero_bi, endereco, telefone, numero_membro_sindicato, salario, tipo) VALUES (?, ?, ?, ?, ?, ?)',
            [numero_bi, endereco, telefone, numero_membro_sindicato, parseFloat(salario), tipo]
        );

        // Inserir em tabela específica
        if (tipo === 'tecnico') {
            await db.query('INSERT INTO tecnicos (numero_bi) VALUES (?)', [numero_bi]);
        } else if (tipo === 'controlador') {
            await db.query(
                'INSERT INTO controladores (numero_bi, data_ultimo_exame) VALUES (?, ?)',
                [numero_bi, data_ultimo_exame]
            );
        }

        await db.query('COMMIT');
        res.status(201).json({ message: 'Empregado registrado com sucesso' });
    } catch (error) {
        await db.query('ROLLBACK');
        console.error('Erro ao registrar empregado:', error);
        res.status(500).json({ error: 'Erro ao registrar empregado', details: error.message });
    }
});

// Atualizar empregado
router.put('/:numero_bi', validateEmpregado, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const { numero_bi } = req.params;
        const { endereco, telefone, numero_membro_sindicato, salario, tipo, data_ultimo_exame } = req.body;
        
        await db.query('START TRANSACTION');
        
        await db.query(
            'UPDATE empregados SET endereco = ?, telefone = ?, numero_membro_sindicato = ?, salario = ?, tipo = ? WHERE numero_bi = ?',
            [endereco, telefone, numero_membro_sindicato, salario, tipo, numero_bi]
        );

        if (tipo === 'controlador') {
            await db.query(
                'UPDATE controladores SET data_ultimo_exame = ? WHERE numero_bi = ?',
                [data_ultimo_exame, numero_bi]
            );
        }

        await db.query('COMMIT');
        res.json({ message: 'Empregado atualizado com sucesso' });
    } catch (error) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: 'Erro ao atualizar empregado' });
    }
});

// Deletar empregado
router.delete('/:numero_bi', async (req, res) => {
    try {
        const { numero_bi } = req.params;
        
        await db.query('START TRANSACTION');
        
        // Primeiro deletar das tabelas específicas
        await db.query('DELETE FROM tecnicos WHERE numero_bi = ?', [numero_bi]);
        await db.query('DELETE FROM controladores WHERE numero_bi = ?', [numero_bi]);
        
        // Depois deletar da tabela principal
        await db.query('DELETE FROM empregados WHERE numero_bi = ?', [numero_bi]);
        
        await db.query('COMMIT');
        res.json({ message: 'Empregado deletado com sucesso' });
    } catch (error) {
        await db.query('ROLLBACK');
        res.status(500).json({ error: 'Erro ao deletar empregado' });
    }
});

module.exports = router; 