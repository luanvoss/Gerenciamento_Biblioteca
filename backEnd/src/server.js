
const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const app = express();
const PORT = process.env.API_PORT;

const autoresRoute = require("./routes/autorRoute");
const livroRoute = require("./routes/livroRoute");
const emprestimoRoute = require("./routes/emprestimoRouter");
const usuariosRoute = require("./routes/usuariosRoute");
const authRoute = require("./routes/authRoute");

app.use(express.json());

app.use("/autores", autoresRoute);
app.use("/livros", livroRoute);
app.use("/emprestimo", emprestimoRoute);
app.use("/usuarios", usuariosRoute);
app.use("/auth", authRoute);

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta: ${PORT}\nhttp://localhost:${PORT}`);
});

