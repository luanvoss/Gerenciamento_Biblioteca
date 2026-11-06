
const usuariosModel = require("../models/usuariosModel");
const { verificarHashSenha } = require("../util/hash");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
    try {
        const { Email, senha } = req.body;

        if (!Email || !senha) {
            return res.status(400).json({
                mensagem: "Informe o e-mail e a senha"
            });
        }

        const usuarios = await usuariosModel.buscarTodos();

        const usuario = usuarios.find(
            usuario => usuario.Email === Email
        );

        if (!usuario) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos"
            });
        }

        const senhaCorreta = await verificarHashSenha(senha, {
            saltArmazenado: usuario.senha_salt,
            hashSenhaArmazenado: usuario.senha_hash
        });

        if (!senhaCorreta) {
            return res.status(401).json({
                mensagem: "E-mail ou senha inválidos"
            });
        }

        const token = jwt.sign(
            {
                Id_Usuario: usuario.Id_Usuario,
                Tipo_Usuario: usuario.Tipo_Usuario
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "2h"
            }
        );

        return res.json({
            mensagem: "Login realizado com sucesso",
            token,
            usuario: {
                Id_Usuario: usuario.Id_Usuario,
                Nome_Completo: usuario.Nome_Completo,
                Email: usuario.Email,
                Tipo_Usuario: usuario.Tipo_Usuario
            }
        });

    } catch (error) {
        console.error("Erro ao realizar login:", error);

        return res.status(500).json({
            mensagem: "Erro ao realizar login"
        });
    }
};

module.exports = {
    login
};
