const usuariosModel = require("../models/usuariosModel");
const { gerarHashSenha, verificarHashSenha } = require("../util/hash");
const { criptografar, descriptografar } = require("../util/criptografia");



const buscarUsuarios = async (req, res) => {
 try {
    const usuario = await usuariosModel.buscarTodos();

    res.json(usuario);
     } catch(error) {
        console.log(error);
        return res.status(500).json({error: "Erro ao buscar usuários"});
    };
};

const buscarUsuariosPorId = async (req, res) => {
    try {
        const id = req.params.id;
        const usuario = await usuariosModel.buscarPorId(id);
        if (!usuario) {
            return res.status(404).json({
                mensagem: "Usuário não encontrado"
            });
        }
        const CPF = descriptografar({
            ivArmazenado: usuario.cpf_iv,
            tagArmazenada: usuario.cpf_tag,
            valorArmazenado: usuario.CPF
        });
        return res.json({
            Id_Usuario: usuario.Id_Usuario,
            Nome_Completo: usuario.Nome_Completo,
            CPF,
            Email: usuario.Email,
            Telefone: usuario.Telefone,
            Data_Nascimento: usuario.Data_Nascimento
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao buscar o usuário"
        });
    }
};

const addUsuarios = async (req, res) => {
    try {
        const {Nome_Completo, CPF, Email, Telefone, Data_Nascimento,senha } = req.body;
        if (!Nome_Completo || !CPF || !Email || !Telefone || !senha) {
            return res.status(400).json({
                error: "Preencha todos os campos obrigatórios"
            });
        }
        const { salt, hash } = await gerarHashSenha(senha);
        const { iv, tag, valorCriptografado:cpfCriptografado } = criptografar(CPF);
        await usuariosModel.criar({
            Nome_Completo,
            CPF: cpfCriptografado,
            cpf_iv: iv,
            cpf_tag: tag,
            Email,
            Telefone,
            Data_Nascimento,
            senha_hash: hash,
            senha_salt: salt
        });
        return res.status(201).json({
            mensagem: "Usuário criado com sucesso"
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error: "Erro ao criar usuário"
        });
    }
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