
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

const criar = async ({
    Nome_Completo,
    CPF,
    cpf_iv,
    cpf_tag,
    Email,
    Telefone,
    Data_Nascimento,
    senha_hash,
    senha_salt,
    Tipo_Usuario = "comum"
}) => {
    const [usuario] = await db.query(
        `INSERT INTO usuarios (
            Nome_Completo,
            CPF,
            cpf_iv,
            cpf_tag,
            Email,
            Telefone,
            Data_Nascimento,
            senha_hash,
            senha_salt,
            Tipo_Usuario
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
            Nome_Completo,
            CPF,
            cpf_iv,
            cpf_tag,
            Email,
            Telefone,
            Data_Nascimento,
            senha_hash,
            senha_salt,
            Tipo_Usuario
        ]
    );

    return {
        Id_Usuario: usuario.insertId,
        Nome_Completo,
        Email,
        Telefone,
        Data_Nascimento,
        Tipo_Usuario
    };
};

async function editar(id, dados) {
    const camposPermitidos = [
        "Nome_Completo",
        "CPF",
        "cpf_iv",
        "cpf_tag",
        "Email",
        "Telefone",
        "Data_Nascimento",
        "senha_hash",
        "senha_salt"
    ];

    const campos = Object.keys(dados);

    if (campos.length === 0 || campos.some(campo => !camposPermitidos.includes(campo))) {
        throw new Error("Variáveis de atualização inválidas");
    }

    const atribuicoes = campos.map(campo => `\`${campo}\` = ?`).join(", ");
    const valores = campos.map(campo => dados[campo]);

    const sql = `
        UPDATE usuarios
        SET ${atribuicoes}
        WHERE Id_Usuario = ?
    `;

    const [resultado] = await db.execute(sql, [...valores, id]);

    return resultado;
}

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
