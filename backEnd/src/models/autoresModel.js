const db = require("../config/db");

const buscarTodos = async () => {
    const [autores] = await db.query(
        "SELECT * FROM autores"
    );

    return autores;
};

const buscarPorId = async (Id_Autores) => {
    const [autores] = await db.query(
        "SELECT * FROM autores WHERE Id_Autores = ?",
        [Id_Autores]
    );

    return autores[0];
};

const criar = async (Nome, Nacionalidade, Data_Nascimento) => {
    const [autor] = await db.query(
        "INSERT INTO autores (Nome, Nacionalidade, Data_Nascimento) VALUES (?, ?, ?)",
        [Nome, Nacionalidade, Data_Nascimento]
    );

    return {
        Id_Autores: autor.insertId,
        Nome,
        Nacionalidade,
        Data_Nascimento
    };
};

const editar = async (Id_Autores, Nome, Nacionalidade, Data_Nascimento) => {
    await db.query(
        "UPDATE autores SET Nome=?, Nacionalidade=?, Data_Nascimento=? WHERE Id_Autores=?",
        [Nome, Nacionalidade, Data_Nascimento, Id_Autores]
    );

    return {
        Id_Autores,
        Nome,
        Nacionalidade,
        Data_Nascimento
    };
};

const excluir = async (Id_Autores) => {
    const [livros] = await db.query(
        `SELECT Id_Livro 
         FROM autores_has_livros 
         WHERE Id_Autores = ?`,
        [Id_Autores]
    );

    await db.query(
        `DELETE FROM autores_has_livros 
         WHERE Id_Autores = ?`,
        [Id_Autores]
    );

    for (const livro of livros) {
        await db.query(
            `DELETE FROM livros 
             WHERE Id_Livro = ?`,
            [livro.Id_Livro]
        );
    };
    
    const [resultado] = await db.query(
        "DELETE FROM autores WHERE Id_Autores=?",
        [Id_Autores]
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

