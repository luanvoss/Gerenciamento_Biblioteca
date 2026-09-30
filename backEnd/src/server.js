const express = require("express");
const db = require("./config/db");

const app = express();

app.use(express.json());

app.get("/teste-banco", async (req, res) => {
    try {
        const [resultado] = await db.query("SELECT 1");

        res.json({
            mensagem: "Conexão com o banco funcionando!",
            banco: "gerenciamento_biblioteca"
        });

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao conectar com o banco de dados"
        });
    }
});

app.listen(3030, () => {
    console.log("Servidor rodando na porta: 3030");
});

app.get("/livros", async (req, res) => {
    try {
        const [livros] = await db.query("SELECT * FROM livros");

        res.json(livros);

    } catch (erro) {
        console.error(erro);

        res.status(500).json({
            mensagem: "Erro ao buscar livros"
        });
    }
});