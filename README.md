# Sistema de Gestão do Aeroporto da Mukanka

Sistema de gestão para o aeroporto da Mukanka na província da Huíla, Angola.

## Requisitos

- Node.js (versão 14 ou superior)
- MySQL (versão 5.7 ou superior)
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd aeroporto-mukanka
```

2. Instale as dependências:
```bash
npm install
```

3. Configure o banco de dados:
- Crie um banco de dados MySQL
- Execute o script `src/database/schema.sql` para criar as tabelas necessárias

4. Configure as variáveis de ambiente:
- Copie o arquivo `.env.example` para `.env`
- Ajuste as configurações conforme necessário

## Executando o Projeto

Para desenvolvimento:
```bash
npm run dev
```

Para produção:
```bash
npm start
```

## Endpoints da API

### Aviões
- GET /api/avioes - Lista todos os aviões
- POST /api/avioes - Adiciona um novo avião
- PUT /api/avioes/:numero_registo - Atualiza um avião
- DELETE /api/avioes/:numero_registo - Remove um avião

### Empregados
- GET /api/empregados - Lista todos os empregados
- POST /api/empregados - Adiciona um novo empregado
- PUT /api/empregados/:numero_bi - Atualiza um empregado
- DELETE /api/empregados/:numero_bi - Remove um empregado

### Testes
- GET /api/testes - Lista todos os testes
- POST /api/testes - Adiciona um novo teste
- POST /api/testes/realizados - Registra a realização de um teste
- GET /api/testes/realizados/aviao/:numero_registo - Lista testes realizados por avião
- GET /api/testes/realizados/tecnico/:numero_bi - Lista testes realizados por técnico

## Segurança

O sistema inclui:
- Rate limiting para prevenir ataques de força bruta
- Validação de dados em todas as entradas
- Transações de banco de dados para garantir integridade
- Headers de segurança com Helmet

## Licença

Este projeto está licenciado sob a licença MIT. 