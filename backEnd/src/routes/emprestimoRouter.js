const express = require("express");
const router = express.Router();
const emprestimoControllers = require("../controllers/emprestimoControllers");

router.get("/emprestimo", emprestimoControllers.buscarEmprestimo);
router.get("/emprestimo/:id", emprestimoControllers.buscarEmprestimoPorId);
router.post("/emprestimo", emprestimoControllers.addEmprestimo);
router.put("/emprestimo/:id", emprestimoControllers.editarEmprestimo);
router.delete("/emprestimo/:id", emprestimoControllers.excluirEmprestimo);

module.exports= router; 