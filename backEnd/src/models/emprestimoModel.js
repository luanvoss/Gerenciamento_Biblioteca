const db = require("../config/db");

const buscarTodos = async () => {
    const [emprestimo] = await db.query(
        "SELECT * FROM emprestimos"
    );

    return emprestimo;
};

const buscarPorId = async (Id_Emprestimo) => {
    const [emprestimo] = await db.query(
        "SELECT * FROM emprestimos WHERE Id_Emprestimo = ?",
        [Id_Emprestimo]
    );

    return emprestimo[0];
};

const criar = async (Data_Emprestimo, Data_Devolucao, Id_Usuario, Id_Livro) => {
    const [emprestimo] = await db.query(
        "INSERT INTO emprestimos (Data_Emprestimo, Data_Devolucao, Id_Usuario, Id_Livro) VALUES (?, ?, ?, ?)",
        [Data_Emprestimo, Data_Devolucao, Id_Usuario, Id_Livro]
    );

    return {
        Id_Emprestimo: emprestimo.insertId,
        Data_Emprestimo, 
        Data_Devolucao, 
        Id_Usuario, 
        Id_Livro
    };
};

const editar = async (
    Id_Emprestimo,
    Data_Emprestimo,
    Data_Devolucao,
    Id_Usuario,
    Id_Livro
) => {
    await db.query(
        "UPDATE emprestimos SET Data_Emprestimo=?, Data_Devolucao=?, Id_Usuario=?, Id_Livro=? WHERE Id_Emprestimo=?",
        [
            Data_Emprestimo,
            Data_Devolucao,
            Id_Usuario,
            Id_Livro,
            Id_Emprestimo
        ]
    );
    return {
        Id_Emprestimo,
        Data_Emprestimo,
        Data_Devolucao,
        Id_Usuario,
        Id_Livro
    };
};

const excluir = async (Id_Emprestimo) => {
    const [resultado] = await db.query(
        `DELETE FROM emprestimos
        WHERE Id_Emprestimo = ?`,
        [Id_Emprestimo]
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