const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');
const os = require('os');
require('dotenv').config();

// Configuração inicial
const app = express();
const startTime = new Date();
const packageJson = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));

// Função para contar arquivos recursivamente
const countFiles = (dir) => {
    try {
        let count = 0;
        const files = fs.readdirSync(dir);
        for (const file of files) {
            const fullPath = path.join(dir, file);
            if (fs.statSync(fullPath).isDirectory()) {
                if (!fullPath.includes('node_modules') && !fullPath.includes('.git')) {
                    count += countFiles(fullPath);
                }
            } else {
                count++;
            }
        }
        return count;
    } catch (error) {
        return 0;
    }
};

// Middleware básico
app.use(cors());
app.use(helmet());
app.use(express.json());

// Rate limiting
app.use(rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
}));

// Rotas
app.use('/api/avioes', require('./src/routes/avioes'));
app.use('/api/empregados', require('./src/routes/empregados'));
app.use('/api/testes', require('./src/routes/testes'));
app.use('/api/modelos', require('./src/routes/modelos'));

// Servir frontend em produção
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'frontend/build')));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
    });
}

// Gerar relatório inicial
const serverReport = {
    status: "online",
    porta: process.env.PORT || 3000,
    grupo_servidor: os.hostname(),
    tipo_banco: "MySQL/MariaDB",
    total_arquivos: countFiles(__dirname),
    frameworks: Object.keys(packageJson.dependencies),
    tempo_ligado: "0 seconds"
};

// Middleware de tempo de operação
app.use((req, res, next) => {
    req.startTime = startTime;
    next();
});

// Iniciar servidor
const server = app.listen(serverReport.porta, () => {
    serverReport.tempo_ligado = `${Math.round((new Date() - startTime) / 1000)} seconds`;
    
    console.log(JSON.stringify({
        ...serverReport,
        sistema: {
            plataforma: os.platform(),
            arquitetura: os.arch(),
            memoria_total: `${Math.round(os.totalmem() / (1024 ** 3))} GB`
        }
    }, null, 2));
});

// Atualizar tempo de operação periodicamente
setInterval(() => {
    serverReport.tempo_ligado = `${Math.round((new Date() - startTime) / 1000)} seconds`;
}, 1000);

// Tratamento de erros
app.use((err, req, res, next) => {
    console.error(JSON.stringify({
        status: "error",
        mensagem: err.message,
        stack: err.stack,
        timestamp: new Date().toISOString()
    }, null, 2));
    res.status(500).json({ error: 'Erro interno do servidor' });
});