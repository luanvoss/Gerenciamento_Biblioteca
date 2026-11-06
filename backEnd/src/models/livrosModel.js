
const db = require("../config/db");

const buscarTodos = async () => {
    const [livros] = await db.query(`
        SELECT 
            livros.*,
            autores.Nome AS Autor,
            autores.Nacionalidade,
            GROUP_CONCAT(DISTINCT genero.Id_Genero) AS Id_Generos,
            GROUP_CONCAT(DISTINCT genero.Genero) AS Generos
        FROM livros
        LEFT JOIN autores
            ON livros.Id_Autores = autores.Id_Autores
        LEFT JOIN livros_has_generos
            ON livros.Id_Livro = livros_has_generos.Id_Livro
        LEFT JOIN genero
            ON livros_has_generos.Id_Genero = genero.Id_Genero
        GROUP BY livros.Id_Livro
    `);

    return livros;
};


const buscarPorId = async (Id_Livro) => {
    const [livros] = await db.query(`
        SELECT 
            livros.*,
            autores.Nome AS Autor,
            autores.Nacionalidade,
            GROUP_CONCAT(DISTINCT genero.Id_Genero) AS Id_Generos,
            GROUP_CONCAT(DISTINCT genero.Genero) AS Generos
        FROM livros
        LEFT JOIN autores
            ON livros.Id_Autores = autores.Id_Autores
        LEFT JOIN livros_has_generos
            ON livros.Id_Livro = livros_has_generos.Id_Livro
        LEFT JOIN genero
            ON livros_has_generos.Id_Genero = genero.Id_Genero
        WHERE livros.Id_Livro = ?
        GROUP BY livros.Id_Livro
    `, [Id_Livro]);

    return livros[0];
};


const buscarLivrosPorAutor = async (Id_Autores) => {
    const [livros] = await db.query(`
        SELECT 
            livros.*,
            autores.Nome AS Autor,
            GROUP_CONCAT(DISTINCT genero.Id_Genero) AS Id_Generos,
            GROUP_CONCAT(DISTINCT genero.Genero) AS Generos
        FROM livros
        LEFT JOIN autores
            ON livros.Id_Autores = autores.Id_Autores
        LEFT JOIN livros_has_generos
            ON livros.Id_Livro = livros_has_generos.Id_Livro
        LEFT JOIN genero
            ON livros_has_generos.Id_Genero = genero.Id_Genero
        WHERE livros.Id_Autores = ?
        GROUP BY livros.Id_Livro
    `, [Id_Autores]);

    return livros;
};


const criar = async (
    Titulo,
    Isbn,
    Ano_Publicacao,
    Numero_Paginas,
    Sinopse,
    Id_Autores,
    Id_Generos
) => {

    const [livro] = await db.query(`
        INSERT INTO livros
        (Titulo, Isbn, Ano_Publicacao, Numero_Paginas, Sinopse, Id_Autores)
        VALUES (?, ?, ?, ?, ?, ?)
    `, [
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores
    ]);

    const Id_Livro = livro.insertId;

    for (const Id_Genero of Id_Generos || []) {
        await db.query(`
            INSERT INTO livros_has_generos (Id_Genero, Id_Livro)
            VALUES (?, ?)
        `, [Id_Genero, Id_Livro]);
    }

    return {
        Id_Livro,
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores,
        Id_Generos: Id_Generos || []
    };
};


const editar = async (
    Id_Livro,
    Titulo,
    Isbn,
    Ano_Publicacao,
    Numero_Paginas,
    Sinopse,
    Id_Autores,
    Id_Generos
) => {

    await db.query(`
        UPDATE livros
        SET Titulo = ?,
            Isbn = ?,
            Ano_Publicacao = ?,
            Numero_Paginas = ?,
            Sinopse = ?,
            Id_Autores = ?
        WHERE Id_Livro = ?
    `, [
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores,
        Id_Livro
    ]);

    await db.query(
        "DELETE FROM livros_has_generos WHERE Id_Livro = ?",
        [Id_Livro]
    );

    for (const Id_Genero of Id_Generos || []) {
        await db.query(`
            INSERT INTO livros_has_generos (Id_Genero, Id_Livro)
            VALUES (?, ?)
        `, [Id_Genero, Id_Livro]);
    }

    return {
        Id_Livro,
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores,
        Id_Generos: Id_Generos || []
    };
};


const excluir = async (Id_Livro) => {

    await db.query(
        "DELETE FROM livros_has_generos WHERE Id_Livro = ?",
        [Id_Livro]
    );

    const [resultado] = await db.query(
        "DELETE FROM livros WHERE Id_Livro = ?",
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
