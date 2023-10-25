const Router = require("express");
const { createPokemonHandler } = require("../handlers/createPokemonHandler");

const createPokemonRouter = Router();

createPokemonRouter.post("/", createPokemonHandler);

module.exports = {
  createPokemonRouter,
};
