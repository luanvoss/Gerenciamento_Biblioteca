const express = require("express");
const router = express.Router();
const autoresControllers = require("../controllers/autoresControllers");

router.get("/", autoresControllers.buscarAutores);
router.get("/:id", autoresControllers.buscarAutoresPorId);
router.post("/", autoresControllers.addAutores);
router.put("/:id", autoresControllers.editarAutores);
router.delete("/:id", autoresControllers.excluirAutor);

module.exports= router; 