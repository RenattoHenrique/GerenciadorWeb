DROP DATABASE IF EXISTS gerenciador;
CREATE DATABASE gerenciador;
USE gerenciador;

CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(60),
    email VARCHAR(80) UNIQUE,
    senha VARCHAR(100)
);

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(60),
    descricao VARCHAR(400),
    categoria VARCHAR(100),
    status ENUM('pendente', 'concluida') DEFAULT 'pendente',
    prazo DATE,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);

select * from usuarios;
select * from tarefas;