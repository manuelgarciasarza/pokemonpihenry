const { Pokemon, Type } = require("../db");

const createPokemon = async (pokemonData) => {
  const { name, image, life, attack, defense, types, height, weight, speed } =
    pokemonData;

  const newPokemon = await Pokemon.create({
    name,
    image,
    life,
    attack,
    defense,
    height,
    weight,
    speed,
    created: true,
  });

  if (types && types.length > 0) {
    const foundTypes = await Type.findAll({
      where: {
        name: types,
      },
    });

    await newPokemon.addTypes(foundTypes);
  }

  return newPokemon;
};

module.exports = {
  createPokemon,
};
