CREATE DATABASE IF NOT EXISTS aeroporto_mukanka;
USE aeroporto_mukanka;

CREATE TABLE IF NOT EXISTS modelos_avioes (
    codigo_modelo VARCHAR(10) PRIMARY KEY,
    nome_modelo VARCHAR(50) NOT NULL,
    capacidade INT NOT NULL,
    peso DECIMAL(10,2) NOT NULL
);

CREATE TABLE IF NOT EXISTS avioes (
    numero_registo VARCHAR(20) PRIMARY KEY,
    codigo_modelo VARCHAR(10) NOT NULL,
    FOREIGN KEY (codigo_modelo) REFERENCES modelos_avioes(codigo_modelo)
);

CREATE TABLE IF NOT EXISTS empregados (
    numero_bi VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    endereco VARCHAR(255) NOT NULL,
    telefone VARCHAR(20) NOT NULL,
    numero_membro_sindicato VARCHAR(20) NOT NULL,
    salario DECIMAL(10,2) NOT NULL,
    tipo ENUM('tecnico', 'controlador') NOT NULL
);

CREATE TABLE IF NOT EXISTS tecnicos (
    numero_bi VARCHAR(20) PRIMARY KEY,
    FOREIGN KEY (numero_bi) REFERENCES empregados(numero_bi)
);

CREATE TABLE IF NOT EXISTS controladores (
    numero_bi VARCHAR(20) PRIMARY KEY,
    data_ultimo_exame DATE,
    FOREIGN KEY (numero_bi) REFERENCES empregados(numero_bi)
);

CREATE TABLE IF NOT EXISTS especialidades_tecnicos (
    numero_bi VARCHAR(20),
    codigo_modelo VARCHAR(10),
    PRIMARY KEY (numero_bi, codigo_modelo),
    FOREIGN KEY (numero_bi) REFERENCES tecnicos(numero_bi),
    FOREIGN KEY (codigo_modelo) REFERENCES modelos_avioes(codigo_modelo)
);

CREATE TABLE IF NOT EXISTS testes (
    numero_ana VARCHAR(20) PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    pontuacao_maxima INT NOT NULL
);

CREATE TABLE IF NOT EXISTS testes_realizados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    numero_ana VARCHAR(20) NOT NULL,
    numero_registo VARCHAR(20) NOT NULL,
    numero_bi VARCHAR(20) NOT NULL,
    data_realizacao DATE NOT NULL,
    horas_gastas DECIMAL(5,2) NOT NULL,
    pontuacao_obtida INT NOT NULL,
    FOREIGN KEY (numero_ana) REFERENCES testes(numero_ana),
    FOREIGN KEY (numero_registo) REFERENCES avioes(numero_registo),
    FOREIGN KEY (numero_bi) REFERENCES empregados(numero_bi),
    CONSTRAINT chk_pontuacao CHECK (pontuacao_obtida >= 0),
    CONSTRAINT chk_horas CHECK (horas_gastas >= 0)
);
