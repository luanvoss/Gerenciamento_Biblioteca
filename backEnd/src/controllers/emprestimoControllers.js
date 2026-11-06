const emprestimoModel = require("../models/emprestimoModel");

const buscarEmprestimo = async (req, res) => {

    const emprestimo = await emprestimoModel.buscarTodos();

    res.json(emprestimo);
};

const buscarEmprestimoPorId = async (req, res) => {

    const id = req.params.id;

    const emprestimo = await emprestimoModel.buscarPorId(id);

    if (!emprestimo) {
        return res.status(404).json({
            mensagem: "emprestimo não encontrado"
        });
    }

    res.json(emprestimo);
};

const buscarEmprestimosPorLivro = async (req, res) => {
    try {
        const { id } = req.params;
        const emprestimos =
            await emprestimoModel.buscarEmprestimosPorLivro(id);
        if (emprestimos.length === 0) {
            return res.status(404).json({
                mensagem: "Nenhum empréstimo encontrado para este livro"
            });
        }
        res.json(emprestimos);
    } catch (error) {
        res.status(500).json({
            mensagem: "Erro ao buscar empréstimos do livro",
            erro: error.message
        });
    }
};


const addEmprestimo = async (req, res) => {

    const { Data_Emprestimo, Data_Devolucao, Id_Usuario, Id_Livro } = req.body;

    const novoEmprestimo = await emprestimoModel.criar(
        Data_Emprestimo,
        Data_Devolucao,
        Id_Usuario,
        Id_Livro
    );

    res.status(201).json(novoEmprestimo);
};

const editarEmprestimo = async (req, res) => {

    const id = req.params.id;

    const { Data_Emprestimo, Data_Devolucao, Id_Usuario, Id_Livro } = req.body;

    const lista = await emprestimoModel.buscarPorId(id);

    if (!lista) {
        return res.status(404).json({
            mensagem: "Emprestimo não encontrado"
        });
    }

    const emprestimoAtualizado = await emprestimoModel.editar(
        id,
        Data_Emprestimo,
        Data_Devolucao,
        Id_Usuario,
        Id_Livro
    );

    res.json(emprestimoAtualizado);
};

const excluirEmprestimo = async (req, res) => {

    const id = req.params.id;

    const emprestimo = await emprestimoModel.buscarPorId(id);

    if (!emprestimo) {
        return res.status(404).json({
            mensagem: "Emprestimo não encontrado"
        });
    }

    await emprestimoModel.excluir(id);

    res.json({
        mensagem: "Seus emprestimos foram  excluídos com sucesso"
    });
};

module.exports = {
    buscarEmprestimo,
    buscarEmprestimoPorId,
    buscarEmprestimosPorLivro,
    addEmprestimo,
    editarEmprestimo,
    excluirEmprestimo
};