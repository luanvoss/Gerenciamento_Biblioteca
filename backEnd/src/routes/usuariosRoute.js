const express = require("express");
const router = express.Router();
const usuariosControllers = require("../controllers/usuariosControllers");

router.get("/usuarios", usuariosControllers.buscarUsuarios);
router.get("/usuarios/:id", usuariosControllers.buscarUsuariosPorId);
router.post("/usuarios", usuariosControllers.addUsuarios);
router.put("/usuarios/:id", usuariosControllers.editarUsuarios);
router.delete("/usuarios/:id", usuariosControllers.excluirUsuarios);

module.exports= router; 