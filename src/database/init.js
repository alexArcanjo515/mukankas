const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function initializeDatabase() {
    let connection;
    try {
        // Criar conexão sem especificar o banco de dados
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Conectado ao servidor MySQL');

        // Recriar o banco de dados
        await connection.query(`DROP DATABASE IF EXISTS ${process.env.DB_NAME}`);
        await connection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
        await connection.query(`USE ${process.env.DB_NAME}`);
        console.log(`Banco de dados ${process.env.DB_NAME} criado`);

        // Ler e executar o schema
        const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
        const statements = schema.split(';').filter(stmt => stmt.trim());
        
        for (const statement of statements) {
            if (statement.trim()) {
                await connection.query(statement);
            }
        }
        console.log('Schema executado com sucesso');

        // Inserir dados iniciais
        // Primeiro, inserir modelos de aviões
        await connection.query(`
            INSERT INTO modelos_avioes (codigo_modelo, nome_modelo, capacidade, peso) 
            VALUES 
                ('MOD001', 'Boeing 737', 200, 50000.00),
                ('MOD002', 'Airbus A320', 180, 45000.00)
        `);
        console.log('Modelos de aviões inseridos');

        // Depois, inserir empregados
        await connection.query(`
            INSERT INTO empregados (numero_bi, endereco, telefone, numero_membro_sindicato, salario, tipo) 
            VALUES 
                ('123456789LA87', 'Rua Principal 123', '912345678', 'MS001', 2500.00, 'tecnico'),
                ('987654321LA87', 'Avenida Central 456', '923456789', 'MS002', 3000.00, 'tecnico')
        `);
        console.log('Empregados inseridos');

        // Depois, inserir aviões
        await connection.query(`
            INSERT INTO avioes (numero_registo, codigo_modelo) 
            VALUES 
                ('NM-90', 'MOD001'),
                ('NM-91', 'MOD002')
        `);
        console.log('Aviões inseridos');

        // Por fim, inserir testes
        await connection.query(`
            INSERT INTO testes (numero_ana, nome, pontuacao_maxima) 
            VALUES 
                ('TEST001', 'Teste de Sistema', 100),
                ('TEST002', 'Teste de Segurança', 100),
                ('TEST003', 'Teste de Motor', 100),
                ('TEST004', 'Teste de Navegação', 100),
                ('TEST005', 'Teste de Comunicação', 100),
                ('TEST006', 'Teste de Pressurização', 100),
                ('TEST007', 'Teste de Combustível', 100),
                ('TEST008', 'Teste de Pouso', 100),
                ('TEST009', 'Teste de Decolagem', 100),
                ('TEST010', 'Teste de Emergência', 100)
        `);
        console.log('Testes inseridos');

        console.log('Dados iniciais inseridos com sucesso');

    } catch (error) {
        console.error('Erro ao inicializar o banco de dados:', error);
        throw error;
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexão com o banco de dados fechada');
        }
    }
}

// Executar a inicialização
initializeDatabase()
    .then(() => console.log('Banco de dados inicializado com sucesso'))
    .catch(error => console.error('Falha ao inicializar o banco de dados:', error)); 