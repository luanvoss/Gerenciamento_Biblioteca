const express = require("express");
const router = express.Router();
const usuariosControllers = require("../controllers/usuariosControllers");

router.get("/", usuariosControllers.buscarUsuarios);
router.get("/:id", usuariosControllers.buscarUsuariosPorId);
router.post("/", usuariosControllers.addUsuarios);
router.put("/:id", usuariosControllers.editarUsuarios);
router.delete("/:id", usuariosControllers.excluirUsuarios);

module.exports= router; 