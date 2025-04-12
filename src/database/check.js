const mysql = require('mysql2/promise');
require('dotenv').config();

async function checkDatabase() {
    let connection;
    try {
        // Criar conexão sem especificar o banco de dados
        connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || ''
        });

        console.log('Conectado ao servidor MySQL');

        // Verificar se o banco de dados existe
        const [databases] = await connection.query('SHOW DATABASES');
        const dbExists = databases.some(db => db.Database === process.env.DB_NAME);
        console.log(`Banco de dados ${process.env.DB_NAME} existe:`, dbExists);

        if (dbExists) {
            await connection.query(`USE ${process.env.DB_NAME}`);
            
            // Verificar tabelas
            const [tables] = await connection.query('SHOW TABLES');
            console.log('Tabelas encontradas:', tables.map(t => Object.values(t)[0]));

            // Verificar estrutura das tabelas
            for (const table of tables) {
                const tableName = Object.values(table)[0];
                const [columns] = await connection.query(`DESCRIBE ${tableName}`);
                console.log(`\nEstrutura da tabela ${tableName}:`, columns);
            }

            // Verificar dados
            const [testes] = await connection.query('SELECT * FROM testes');
            const [avioes] = await connection.query('SELECT * FROM avioes');
            const [empregados] = await connection.query('SELECT * FROM empregados');
            const [testesRealizados] = await connection.query('SELECT * FROM testes_realizados');

            console.log('\nDados nas tabelas:');
            console.log('Testes:', testes);
            console.log('Aviões:', avioes);
            console.log('Empregados:', empregados);
            console.log('Testes Realizados:', testesRealizados);
        }

    } catch (error) {
        console.error('Erro ao verificar banco de dados:', error);
    } finally {
        if (connection) {
            await connection.end();
            console.log('Conexão com o banco de dados fechada');
        }
    }
}

checkDatabase(); 