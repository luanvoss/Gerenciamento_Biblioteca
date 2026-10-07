DROP DATABASE IF EXISTS gerenciamento_biblioteca;

CREATE DATABASE gerenciamento_biblioteca;

USE gerenciamento_biblioteca;

CREATE TABLE autores (
    Id_Autores INT AUTO_INCREMENT PRIMARY KEY,
    Nome VARCHAR(100) NOT NULL,
    Nacionalidade VARCHAR(100),
    Data_Nascimento DATE
);

INSERT INTO autores (Nome, Nacionalidade, Data_Nascimento)
VALUES
('Machado de Assis', 'Brasileiro', '1839-06-21'),
('J. K. Rowling', 'Britânica', '1965-07-31'),
('J. R. R. Tolkien', 'Britânico', '1892-01-03');

CREATE TABLE livros (
    Id_Livro INT AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(150) NOT NULL,
    Isbn VARCHAR(20) UNIQUE,
    Ano_Publicacao INT,
    Numero_Paginas INT,
    Sinopse TEXT,
    Id_Autores INT,

    CONSTRAINT fk_livros_autores
        FOREIGN KEY (Id_Autores)
        REFERENCES autores(Id_Autores)
        ON DELETE CASCADE
);

INSERT INTO livros (Titulo, Isbn, Ano_Publicacao, Numero_Paginas, sinopse)
VALUES
('Dom Casmurro', '9788535902778', 1899, 256,
'Romance de Machado de Assis que narra a história de Bentinho e Capitu.'),

('O Hobbit', '9788595084742', 1937, 310,
'A aventura de Bilbo Bolseiro em uma jornada pela Terra-média.'),

('Harry Potter e a Pedra Filosofal', '9788532530783', 1997, 264,
'A história de Harry Potter, um jovem que descobre ser um bruxo e começa seus estudos em Hogwarts.');

CREATE TABLE genero (
    Id_Genero INT AUTO_INCREMENT PRIMARY KEY,
    Genero VARCHAR(80) NOT NULL
);

INSERT INTO genero (Genero)
VALUES
('Romance'),
('Fantasia'),
('Ficção');

CREATE TABLE usuarios (
    Id_Usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nome_Completo VARCHAR(150) NOT NULL,
    CPF VARCHAR(20) NOT NULL,
    Email VARCHAR(150) NOT NULL,
    Telefone VARCHAR(20) NOT NULL,
    Data_Nascimento DATE
);

INSERT INTO usuarios 
(Nome_Completo, CPF, Email, Telefone, Data_Nascimento)
VALUES
('Carlos Eduardo Silva', '123.456.789-01', 'carlos.silva@email.com', '47999991111', '1995-04-15'),

('Mariana Oliveira Santos', '234.567.890-12', 'mariana.santos@email.com', '47988882222', '1998-09-22'),

('Lucas Henrique Souza', '345.678.901-23', 'lucas.souza@email.com', '47977773333', '1992-12-10');

CREATE TABLE emprestimos (
    Id_Emprestimo INT AUTO_INCREMENT PRIMARY KEY,
    Data_Emprestimo DATE,
    Data_Devolucao DATE,
    Id_Usuario INT,
    Id_Livro INT
);

INSERT INTO emprestimos
(Data_Emprestimo, Data_Devolucao, Id_Usuario, Id_Livro)
VALUES
('2026-09-20', '2026-10-04', 1, 1),
('2026-09-22', '2026-10-06', 2, 2),
('2026-09-25', '2026-10-09', 3, 3);

CREATE TABLE autores_has_livros (
    Id_Autores INT,
    Id_Livro INT
);

INSERT INTO autores_has_livros (Id_Autores, Id_Livro)
VALUES
(1, 1),
(2, 2),
(3, 3);

CREATE TABLE livros_has_generos (
    Id_Genero INT,
    Id_Livro INT
);

INSERT INTO livros_has_generos (Id_Genero, Id_Livro)
VALUES
(1, 1),
(2, 2),
(3, 3);