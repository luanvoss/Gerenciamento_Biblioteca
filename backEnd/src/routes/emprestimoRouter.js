const express = require("express");
const router = express.Router();
const emprestimoControllers = require("../controllers/emprestimoControllers");

router.get("/", emprestimoControllers.buscarEmprestimo);
router.get("/:id", emprestimoControllers.buscarEmprestimoPorId);
router.get("/:id/emprestimos",emprestimoControllers.buscarEmprestimosPorLivro);
router.post("/", emprestimoControllers.addEmprestimo);
router.put("/:id", emprestimoControllers.editarEmprestimo);
router.delete("/:id", emprestimoControllers.excluirEmprestimo);

module.exports= router; 