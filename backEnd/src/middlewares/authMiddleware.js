
const jwt = require("jsonwebtoken");

const autenticar = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({
            mensagem: "Token não informado"
        });
    }

    const partes = authHeader.split(" ");
    const token = partes[1];

    if (partes[0] !== "Bearer" || !token) {
        return res.status(401).json({
            mensagem: "Formato de token inválido"
        });
    }

    try {
        const usuario = jwt.verify(token, process.env.JWT_SECRET);

        req.usuario = usuario;

        next();

    } catch (error) {
        return res.status(401).json({
            mensagem: "Token inválido ou expirado"
        });
    }
};

module.exports = autenticar;
