const usuariosModel = require("../models/usuariosModel");

const buscarUsuarios = async (req, res) => {

    const usuario = await usuariosModel.buscarTodos();

    res.json(usuario);
};

const buscarUsuariosPorId = async (req, res) => {

    const id = req.params.id;

    const usuarios = await usuariosModel.buscarPorId(id);

    if (!usuarios) {
        return res.status(404).json({
            mensagem: "Usuário não encontrado"
        });
    }

    res.json(usuarios);
};

const addUsuarios = async (req, res) => {

    const { Nome_Completo, CPF, Email, Telefone, Data_Nascimento } = req.body;

    const novoUsuario = await usuariosModel.criar(
        Nome_Completo,
        CPF,
        Email,
        Telefone,
        Data_Nascimento
    );

    res.status(201).json(novoUsuario);
};

const editarUsuarios = async (req, res) => {

    const id = req.params.id;

    const { Nome_Completo, CPF, Email, Telefone, Data_Nascimento } = req.body;

    const lista = await usuariosModel.buscarPorId(id);

    if (!lista) {
        return res.status(404).json({
            mensagem: "Usuário não encontrado"
        });
    }

    const usuariosAtualizado = await usuariosModel.editar(
        id,
        Nome_Completo,
        CPF,
        Email,
        Telefone,
        Data_Nascimento
    );

    res.json(usuariosAtualizado);
};

const excluirUsuarios = async (req, res) => {
    const id = req.params.id;
    const usuario = await usuariosModel.buscarPorId(id);
    if (!usuario) {
        return res.status(404).json({
            mensagem: "Usuário não encontrado"
        });
    }
    const possuiEmprestimo = await usuariosModel.possuiEmprestimo(id);
    if (possuiEmprestimo) {
        return res.status(400).json({
            mensagem: "Usuário possui empréstimo cadastrado e não pode ser excluído"
        });
    }
    await usuariosModel.excluir(id);
    res.json({
        mensagem: "O usuário foi excluído com sucesso"
    });
};

module.exports = {
    buscarUsuarios,
    buscarUsuariosPorId,
    addUsuarios,
    editarUsuarios,
    excluirUsuarios
};