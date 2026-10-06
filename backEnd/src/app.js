const express = require("express");
const app = express();

const autoresRoute = require("./routes/autorRoute");
const livroRoute = require("./routes/livroRoute");
const emprestimoRoute = require("./routes/emprestimoRouter");


app.use(express.json());
app.use(autoresRoute);
app.use(livroRoute);
app.use(emprestimoRoute);

module.exports = app; 