const db = require("../config/db");

const buscarTodos = async () => {
    const [usuarios] = await db.query(
        "SELECT * FROM usuarios"
    );

    return usuarios;
};

const buscarPorId = async (Id_Usuario) => {
    const [usuarios] = await db.query(
        "SELECT * FROM usuarios WHERE Id_Usuario = ?",
        [Id_Usuario]
    );

    return usuarios[0];
};

const criar = async (Nome_Completo, CPF, Email, Telefone, Data_Nascimento) => {
    const [usuario] = await db.query(
        "INSERT INTO usuarios (Nome_Completo, CPF, Email, Telefone, Data_Nascimento) VALUES (?, ?, ?, ?, ?)",
        [Nome_Completo, CPF, Email, Telefone, Data_Nascimento]
    );

    return {
        Id_Usuario: usuario.insertId,
        Nome_Completo, 
        CPF, 
        Email, 
        Telefone, 
        Data_Nascimento
    };
};

const editar = async (Id_Usuario, Nome_Completo, CPF, Email, Telefone, Data_Nascimento) => {
    await db.query(
        "UPDATE usuarios SET Nome_Completo=?, CPF=?, Email=?, Telefone=?, Data_Nascimento=? WHERE Id_Usuario=?",
        [Nome_Completo, CPF, Email, Telefone, Data_Nascimento, Id_Usuario]
    );

    return {
        Id_Usuario,
        Nome_Completo, 
        CPF, 
        Email, 
        Telefone, 
        Data_Nascimento
    };
};

const excluir = async (Id_Usuario) => {
    const [resultado] = await db.query(
        `DELETE FROM usuarios
         WHERE Id_Usuario = ?`,
        [Id_Usuario]
    );

    return resultado.affectedRows;
};

const possuiEmprestimo = async (Id_Usuario) => {
    const [emprestimos] = await db.query(
        "SELECT * FROM emprestimos WHERE Id_Usuario = ?",
        [Id_Usuario]
    );

    return emprestimos.length > 0;
};

module.exports = {
    buscarTodos,
    buscarPorId,
    criar,
    editar,
    excluir,
    possuiEmprestimo
};