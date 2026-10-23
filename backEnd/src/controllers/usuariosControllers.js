const usuariosModel = require("../models/usuariosModel");
const { gerarHashSenha, verificarHashSenha } = require("../util/hash");
const { criptografar, descriptografar } = require("../util/criptografia");



const buscarUsuarios = async (req, res) => {
    try {
        const usuarios = await usuariosModel.buscarTodos();
        const usuariosFormatados = usuarios.map((usuario) => {
            const CPF = descriptografar({
                ivArmazenado: usuario.cpf_iv,
                tagArmazenada: usuario.cpf_tag,
                valorArmazenado: usuario.CPF
            });
            return {
                Id_Usuario: usuario.Id_Usuario,
                Nome_Completo: usuario.Nome_Completo,
                CPF,
                Email: usuario.Email,
                Telefone: usuario.Telefone,
                Data_Nascimento: usuario.Data_Nascimento
            };
        });
        return res.json(usuariosFormatados);
    } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        return res.status(500).json({
            error: "Erro ao buscar usuários"
        });
    }
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
        const { Nome_Completo, CPF, Email, Telefone, Data_Nascimento, senha } = req.body;
        if (!Nome_Completo || !CPF || !Email || !Telefone || !senha) {
            return res.status(400).json({
                error: "Preencha todos os campos obrigatórios"
            });
        }
        const { salt, hash } = await gerarHashSenha(senha);
        const { iv, tag, valorCriptografado: cpfCriptografado } = criptografar(CPF);
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
    try {
        const id = req.params.id;
        const usuario = await usuariosModel.buscarPorId(id);
        if (!usuario) {
            return res.status(404).json({
                error: "Usuário não encontrado"
            });
        };
        const { Nome_Completo, CPF, Email, Telefone, Data_Nascimento, senha } = req.body;
        const dadosAtualizados = {};

        if (Nome_Completo !== undefined) {
            dadosAtualizados.Nome_Completo = Nome_Completo;
        };
        if (Email !== undefined) {
            dadosAtualizados.Email = Email;
        };
        if (Telefone !== undefined) {
            dadosAtualizados.Telefone = Telefone;
        };
        if (Data_Nascimento !== undefined) {
            dadosAtualizados.Data_Nascimento = Data_Nascimento;
        };
        if (CPF !== undefined) {
            const{iv: cpf_iv,tag:cpf_tag, valorCriptografado:cpfCriptografado} = criptografar(CPF);
            dadosAtualizados.CPF = CPF;
            dadosAtualizados.cpf_iv = cpf_iv;
            dadosAtualizados.cpf_tag = cpf_tag;
        };
        if (senha !== undefined) {
           const{salt: senha_salt,hash: senha_hash} = gerarHashSenha(senha);
           dadosAtualizados.senha_salt = senha_salt;
           dadosAtualizados.senha_hash = senha_hash;
        };

        await usuariosModel.editar(id,dadosAtualizados);
        
        return res.json({
            mensagem: "Usuário editado com sucesso"
        })
    } catch(error){
        console.log(error);
        return res.status(500).json({
        mensagem : "Erro ao editar usuário"
        });
    };
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