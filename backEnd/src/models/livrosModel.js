const db = require("../config/db");

const buscarTodos = async () => {
    const [livros] = await db.query(
        `SELECT
            livros.*,
            GROUP_CONCAT(
                DISTINCT autores.Id_Autores
            ) AS Id_Autores,
            GROUP_CONCAT(
                DISTINCT autores.Nome
            ) AS Autores,
            GROUP_CONCAT(
                DISTINCT autores.Nacionalidade
            ) AS Nacionalidades,
            GROUP_CONCAT(
                DISTINCT autores.Data_Nascimento
            ) AS Datas_Nascimento,
            GROUP_CONCAT(
                DISTINCT livros_has_generos.Id_Genero
            ) AS Id_Generos,

            GROUP_CONCAT(
                DISTINCT generos.Genero
            ) AS Generos
        FROM livros
        LEFT JOIN autores_has_livros
            ON livros.Id_Livro = autores_has_livros.Id_Livro
        LEFT JOIN autores
            ON autores_has_livros.Id_Autores = autores.Id_Autores
        LEFT JOIN livros_has_generos
            ON livros.Id_Livro = livros_has_generos.Id_Livro
        LEFT JOIN generos
            ON livros_has_generos.Id_Genero = generos.Id_Genero
        GROUP BY livros.Id_Livro`
    );
    return livros;
};
const buscarPorId = async (Id_Livro) => {
    const [livros] = await db.query(
        `SELECT
            livros.*,
            GROUP_CONCAT(
                DISTINCT autores.Id_Autores
            ) AS Id_Autores,
            GROUP_CONCAT(
                DISTINCT autores.Nome
            ) AS Autores,
            GROUP_CONCAT(
                DISTINCT autores.Nacionalidade
            ) AS Nacionalidades,
            GROUP_CONCAT(
                DISTINCT autores.Data_Nascimento
            ) AS Datas_Nascimento,
            GROUP_CONCAT(
                DISTINCT generos.Id_Genero
            ) AS Id_Generos,
            GROUP_CONCAT(
                DISTINCT generos.Nome
            ) AS Generos
        FROM livros
        LEFT JOIN autores_has_livros
            ON livros.Id_Livro = autores_has_livros.Id_Livro
        LEFT JOIN autores
            ON autores_has_livros.Id_Autores = autores.Id_Autores
        LEFT JOIN livros_has_generos
            ON livros.Id_Livro = livros_has_generos.Id_Livro
        LEFT JOIN generos
            ON livros_has_generos.Id_Genero = generos.Id_Genero
        WHERE livros.Id_Livro = ?
        GROUP BY livros.Id_Livro`,
        [Id_Livro]
    );
    return livros[0];
};

const buscarLivrosPorAutor = async (Id_Autores) => {
    const [livros] = await db.query(
        `SELECT
            livros.*,
            autores.Id_Autores,
            autores.Nome AS Autor,
            autores.Nacionalidade,
            autores.Data_Nascimento
        FROM livros
        INNER JOIN autores_has_livros
            ON livros.Id_Livro = autores_has_livros.Id_Livro

        INNER JOIN autores
            ON autores_has_livros.Id_Autores = autores.Id_Autores
        WHERE autores.Id_Autores = ?`,
        [Id_Autores]
    );

    return livros;
};

const criar = async (Titulo, Isbn, Ano_Publicacao, Numero_Paginas, Sinopse, Id_Autores, Id_Generos) => {
    const [livro] = await db.query(
        `INSERT INTO livros
        (Titulo, Isbn, Ano_Publicacao, Numero_Paginas, Sinopse)
        VALUES (?, ?, ?, ?, ?)`,
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
            `INSERT INTO autores_has_livros
            (Id_Autores, Id_Livro)
            VALUES (?, ?)`,
            [
                Id_Autor,
                Id_Livro
            ]
        );
    }
    for (const Id_Genero of Id_Generos) {
        await db.query(
            `INSERT INTO livros_has_generos
            (Id_Livro, Id_Genero)
            VALUES (?, ?)`,
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
const editar = async (Id_Livro, Titulo, Isbn, Ano_Publicacao, Numero_Paginas, Sinopse, Id_Autores, Id_Generos) => {
    await db.query(
        `UPDATE livros
        SET Titulo = ?,
            Isbn = ?,
            Ano_Publicacao = ?,
            Numero_Paginas = ?,
            Sinopse = ?
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
        `DELETE FROM autores_has_livros
        WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    for (const Id_Autor of Id_Autores) {
        await db.query(
            `INSERT INTO autores_has_livros
            (Id_Autores, Id_Livro)
            VALUES (?, ?)`,
            [
                Id_Autor,
                Id_Livro
            ]
        );
    }
    await db.query(
        `DELETE FROM livros_has_generos
        WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    for (const Id_Genero of Id_Generos) {
        await db.query(
            `INSERT INTO livros_has_generos
            (Id_Livro, Id_Genero)
            VALUES (?, ?)`,
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
        `DELETE FROM autores_has_livros
        WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    await db.query(
        `DELETE FROM livros_has_generos
        WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    const [resultado] = await db.query(
        `DELETE FROM livros
        WHERE Id_Livro = ?`,
        [Id_Livro]
    );
    return resultado.affectedRows;
};
module.exports = {
    buscarTodos,
    buscarPorId,
    buscarLivrosPorAutor,
    criar,
    editar,
    excluir
};

