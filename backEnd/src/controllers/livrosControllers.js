const livrosModel = require("../models/livrosModel");

const buscarLivros = async (req, res) => {

    const livros = await livrosModel.buscarTodos();

    res.json(livros);
};

const buscarLivrosPorId = async (req, res) => {

    const id = req.params.id;

    const livros = await livrosModel.buscarPorId(id);

    if (!livros) {
        return res.status(404).json({
            mensagem: "Livro não encontrado"
        });
    }

    res.json(livros);
};

const addLivros = async (req, res) => {

    const { Titulo, Isbn, Ano_Publicacao, Numero_Paginas, Sinopse } = req.body;

    const novoLivro = await livrosModel.criar(
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse
    );

    res.status(201).json(novoLivro);
};

const editarLivros = async (req, res) => {

    const id = req.params.id;

    const { Titulo, Isbn, Ano_Publicacao, Numero_Paginas, Sinopse } = req.body;

    const lista = await livrosModel.buscarPorId(id);

    if (!lista) {
        return res.status(404).json({
            mensagem: "Livro não encontrado"
        });
    }

    const livrosAtualizado = await livrosModel.editar(
       Titulo, 
       Isbn, Ano_Publicacao, 
       Numero_Paginas, 
       Sinopse
    );

    res.json(livrosAtualizado);
};

const excluirLivro = async (req, res) => {

    const id = req.params.id;

    const livro = await livrosModel.buscarPorId(id);

    if (!livro) {
        return res.status(404).json({
            mensagem: "Livro não encontrado"
        });
    }

    await livrosModel.excluir(id);

    res.json({
        mensagem: "Livro excluído com sucesso"
    });
};

module.exports = {
    buscarLivros,
    buscarLivrosPorId,
    addLivros,
    editarLivros,
    excluirLivro
};