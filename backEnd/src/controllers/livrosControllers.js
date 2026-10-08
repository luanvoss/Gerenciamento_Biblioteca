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

const buscarLivrosPorAutor = async (req, res) => {
    try {
        const { id } = req.params;

        const livros = await livrosModel.buscarLivrosPorAutor(id);

        if (livros.length === 0) {
            return res.status(404).json({
                mensagem: "Nenhum livro encontrado para este autor"
            });
        }

        res.json(livros);

    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao buscar livros do autor",
            erro: error.message
        });
    }
};

const addLivros = async (req, res) => {

    const {
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores,
        Id_Generos
    } = req.body;
    const novoLivro = await livrosModel.criar(
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores,
        Id_Generos
    );

    res.status(201).json(novoLivro);
};

const editarLivros = async (req, res) => {
    const id = req.params.id;
    const {
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores,
        Id_Generos
    } = req.body;
    const lista = await livrosModel.buscarPorId(id);
    if (!lista) {
        return res.status(404).json({
            mensagem: "Livro não encontrado"
        });
    }
    const livrosAtualizado = await livrosModel.editar(
        id,
        Titulo,
        Isbn,
        Ano_Publicacao,
        Numero_Paginas,
        Sinopse,
        Id_Autores,
        Id_Generos
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
    buscarLivrosPorAutor,
    addLivros,
    editarLivros,
    excluirLivro
};