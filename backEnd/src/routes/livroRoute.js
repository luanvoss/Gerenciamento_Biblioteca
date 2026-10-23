const express = require("express");
const router = express.Router();
const livrosControllers = require("../controllers/livrosControllers");

router.get("/", livrosControllers.buscarLivros);
router.get("/:id", livrosControllers.buscarLivrosPorId);
router.get("/:id/livros",livrosControllers.buscarLivrosPorAutor);
router.post("/", livrosControllers.addLivros);
router.put("/:id", livrosControllers.editarLivros);
router.delete("/:id", livrosControllers.excluirLivro);

module.exports= router; 