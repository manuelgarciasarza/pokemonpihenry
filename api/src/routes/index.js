const { Router } = require("express");
const { getPokemonRouter } = require("./getPokemonRouter");
const { typesRouter } = require("./typesRouter");
const { createPokemonRouter } = require("./createPokemonRouter");
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);
router.use("/pokemon", getPokemonRouter, createPokemonRouter);

router.use("/types", typesRouter);

module.exports = router;
