const { createPokemon } = require("../controllers/createPokemonController");

const createPokemonHandler = async (req, res) => {
  try {
    const pokemonData = req.body;
    const newPokemon = await createPokemon(pokemonData);
    return res.status(200).json(newPokemon);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createPokemonHandler,
};
