const express = require("express");
const router = express.Router();
const livrosControllers = require("../controllers/livrosControllers");

router.get("/livros", livrosControllers.buscarLivros);
router.get("/livros/:id", livrosControllers.buscarLivrosPorId);
router.get("/livros/:id/livros",livrosControllers.buscarLivrosPorAutor);
router.post("/livros", livrosControllers.addLivros);
router.put("/livros/:id", livrosControllers.editarLivros);
router.delete("/livros/:id", livrosControllers.excluirLivro);

module.exports= router; 