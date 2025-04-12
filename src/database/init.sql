-- Criar tabelas
CREATE TABLE IF NOT EXISTS modelos_avioes (
    codigo_modelo VARCHAR(50) PRIMARY KEY,
    nome_modelo VARCHAR(100) NOT NULL,
    capacidade INT NOT NULL,
    peso DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS avioes (
    numero_registo VARCHAR(50) PRIMARY KEY,
    codigo_modelo VARCHAR(50) NOT NULL,
    FOREIGN KEY (codigo_modelo) REFERENCES modelos_avioes(codigo_modelo)
);

CREATE TABLE IF NOT EXISTS empregados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cargo VARCHAR(50) NOT NULL,
    salario DECIMAL(10,2) NOT NULL,
    data_contratacao DATE NOT NULL
);

CREATE TABLE IF NOT EXISTS testes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_registo_aviao VARCHAR(50) NOT NULL,
    data_teste DATE NOT NULL,
    tipo_teste VARCHAR(50) NOT NULL,
    resultado TEXT NOT NULL,
    id_empregado INT NOT NULL,
    FOREIGN KEY (numero_registo_aviao) REFERENCES avioes(numero_registo),
    FOREIGN KEY (id_empregado) REFERENCES empregados(id)
);

-- Inserir dados de exemplo
INSERT INTO modelos_avioes (codigo_modelo, nome_modelo, capacidade, peso) VALUES
('B737', 'Boeing 737-800', 189, 41413),
('A320', 'Airbus A320neo', 180, 39724),
('E190', 'Embraer E190-E2', 114, 28700);

INSERT INTO avioes (numero_registo, codigo_modelo) VALUES
('PP-ABC', 'B737'),
('PP-DEF', 'A320'),
('PP-GHI', 'E190');

INSERT INTO empregados (nome, cargo, salario, data_contratacao) VALUES
('João Silva', 'Piloto', 15000.00, '2020-01-15'),
('Maria Santos', 'Mecânico', 8000.00, '2019-06-20'),
('Pedro Oliveira', 'Inspetor', 10000.00, '2021-03-10');

INSERT INTO testes (numero_registo_aviao, data_teste, tipo_teste, resultado, id_empregado) VALUES
('PP-ABC', '2024-01-15', 'Manutenção Preventiva', 'Aprovado', 2),
('PP-DEF', '2024-02-01', 'Inspeção de Segurança', 'Aprovado', 3),
('PP-GHI', '2024-02-15', 'Teste de Motor', 'Aprovado com observações', 2); 