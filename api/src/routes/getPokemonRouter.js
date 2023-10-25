const { Router } = require("express");
const {
  getPokemonHandler,
  getDetailHandler,
  getByNameHandler,
} = require("../handlers/getPokemonHandlers");

const getPokemonRouter = Router();

//all pokemon

getPokemonRouter.get("/", getPokemonHandler);

//pokemon by name

getPokemonRouter.get("/search", getByNameHandler);

// pokemon by id

getPokemonRouter.get("/:idPokemon", getDetailHandler);

module.exports = {
  getPokemonRouter,
};
