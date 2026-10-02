const express = require("express");
const router = express.Router();
const autoresControllers = require("../controllers/autoresControllers");

router.get("/autores", autoresControllers.buscarAutores);
router.get("/autores/:id", autoresControllers.buscarAutoresPorId);
router.post("/autores", autoresControllers.addAutores);
router.put("/autores/:id", autoresControllers.editarAutores);
router.delete("/autores/:id", autoresControllers.excluirAutor);

module.exports= router; 