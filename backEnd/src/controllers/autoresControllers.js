const autoresModel = require("../models/autoresModel");

const buscarAutores = async (req, res) => {

    const autores = await autoresModel.buscarTodos();

    res.json(autores);
};

const buscarAutoresPorId = async (req, res) => {

    const id = req.params.id;

    const autores = await autoresModel.buscarPorId(id);

    if (!autores) {
        return res.status(404).json({
            mensagem: "Autor não encontrado"
        });
    }

    res.json(autores);
};

const addAutores = async (req, res) => {

    const { Nome, Nacionalidade, Data_Nascimento } = req.body;

    const novoAutor = await autoresModel.criar(
        Nome,
        Nacionalidade,
        Data_Nascimento
    );

    res.status(201).json(novoAutor);
};

const editarAutores = async (req, res) => {

    const id = req.params.id;

    const { Nome, Nacionalidade, Data_Nascimento } = req.body;

    const lista = await autoresModel.buscarPorId(id);

    if (!lista) {
        return res.status(404).json({
            mensagem: "Autor não encontrado"
        });
    }

    const autoresAtualizado = await autoresModel.editar(
        id,
        Nome,
        Nacionalidade,
        Data_Nascimento
    );

    res.json(autoresAtualizado);
};

const excluirAutor = async (req, res) => {

    const id = req.params.id;

    const autor = await autoresModel.buscarPorId(id);

    if (!autor) {
        return res.status(404).json({
            mensagem: "Autor não encontrado"
        });
    }

    await autoresModel.excluir(id);

    res.json({
        mensagem: "Autor e seus livros foram excluídos com sucesso"
    });
};

module.exports = {
    buscarAutores,
    buscarAutoresPorId,
    addAutores,
    editarAutores,
    excluirAutor
};

