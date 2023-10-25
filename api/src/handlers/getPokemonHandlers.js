const {
  getAllPokemons,
  getPokemonById,
  getPokemonByName,
} = require("../controllers/getPokemonControllers");

// all pokemon handler

const getPokemonHandler = async (req, res) => {
  try {
    const response = await getAllPokemons();
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

// detail handler

const getDetailHandler = async (req, res) => {
  const { idPokemon } = req.params;
  const source = isNaN(idPokemon) ? "database" : "api";

  try {
    const response = await getPokemonById(idPokemon, source);
    return res.status(200).json(response);
  } catch (error) {
    let errorMessage = "Error al obtener el Pokémon.";
    if (source === "database" && error.name === "SequelizeEmptyResultError") {
      errorMessage = `No se encontró un Pokémon con la ID ${idPokemon} en la base de datos.`;
    }
    return res.status(400).json({ error: errorMessage });
  }
};

// byName handler

const getByNameHandler = async (req, res) => {
  const { name } = req.query;

  try {
    const response = await getPokemonByName(name);
    return res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPokemonHandler,
  getDetailHandler,
  getByNameHandler,
};
