const db = require("../config/db");
const buscarTodos = async () => {
    const [livros] = await db.query(
        `SELECT
            livros.*,
            GROUP_CONCAT(DISTINCT autores_has_livros.Id_Autores) AS Id_Autores,
            GROUP_CONCAT(DISTINCT livros_has_generos.Id_Genero) AS Id_Generos
        FROM livros
        LEFT JOIN autores_has_livros
            ON livros.Id_Livro = autores_has_livros.Id_Livro
        LEFT JOIN livros_has_generos
            ON livros.Id_Livro = livros_has_generos.Id_Livro
        GROUP BY livros.Id_Livro`
    );
    return livros;
};
const buscarPorId = async (Id_Livro) => {
    const [livros] = await db.query(
        `SELECT
            livros.*,
            GROUP_CONCAT(DISTINCT autores_has_livros.Id_Autores) AS Id_Autores,
            GROUP_CONCAT(DISTINCT livros_has_generos.Id_Genero) AS Id_Generos
        FROM livros
        LEFT JOIN autores_has_livros
            ON livros.Id_Livro = autores_has_livros.Id_Livro
        LEFT JOIN livros_has_generos
            ON livros.Id_Livro = livros_has_generos.Id_Livro
        WHERE livros.Id_Livro = ?
        GROUP BY livros.Id_Livro`,
        [Id_Livro]
    );
    return livros[0];
};
const criar = async (Titulo,Isbn,Ano_Publicacao,Numero_Paginas,Sinopse,Id_Autores,Id_Generos) => {
    const [livro] = await db.query(
        `INSERT INTO livros (Titulo, Isbn, Ano_Publicacao, Numero_Paginas, Sinopse) VALUES (?, ?, ?, ?, ?)`,
        [
            Titulo,
            Isbn,
            Ano_Publicacao,
            Numero_Paginas,
            Sinopse
        ]
    );
    const Id_Livro = livro.insertId;
    for (const Id_Autor of Id_Autores) {
        await db.query(
            `INSERT INTO autores_has_livros (Id_Autores, Id_Livro) VALUES (?, ?)`,
            [
                Id_Autor,
                Id_Livro
            ]
        );
    }
    for (const Id_Genero of Id_Generos) {
        await db.query(
            `INSERT INTO livros_has_generos (Id_Livro, Id_Genero) VALUES (?, ?)`,
            [
                Id_Livro,
                Id_Genero
            ]
        );
    }
    return {
        Id_Livro,
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores,
        Id_Generos
    };
};


const editar = async ( Id_Livro, Titulo, Isbn,Ano_Publicacao,Numero_Paginas,Sinopse,Id_Autores,Id_Generos) => {
    await db.query(
        `UPDATE livros SET Titulo = ?, Isbn = ?, Ano_Publicacao = ?, Numero_Paginas = ?, Sinopse = ?
        WHERE Id_Livro = ?`,
        [
            Titulo,
            Isbn,
            Ano_Publicacao,
            Numero_Paginas,
            Sinopse,
            Id_Livro
        ]
    );
    await db.query(
        `DELETE FROM autores_has_livros WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    for (const Id_Autor of Id_Autores) {
        await db.query(
            `INSERT INTO autores_has_livros (Id_Autores, Id_Livro) VALUES (?, ?)`,
            [
                Id_Autor,
                Id_Livro
            ]
        );
    }
    await db.query(
        `DELETE FROM livros_has_generos WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    for (const Id_Genero of Id_Generos) {
        await db.query(
            `INSERT INTO livros_has_generos (Id_Livro, Id_Genero) VALUES (?, ?)`,
            [
                Id_Livro,
                Id_Genero
            ]
        );
    }
    return {
        Id_Livro,
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores,
        Id_Generos
    };
};
const excluir = async (Id_Livro) => {
    await db.query(
        `DELETE FROM autores_has_livros WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    await db.query(
        `DELETE FROM livros_has_generos WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    const [resultado] = await db.query(
        `DELETE FROM livros WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    return resultado.affectedRows;
};
module.exports = {
    buscarTodos,
    buscarPorId,
    criar,
    editar,
    excluir
};