const axios = require("axios");
const { Pokemon, Type } = require("../db");
const { Op } = require("sequelize");

// TRAER TODOS LOS POKEMON

const getAllPokemons = async () => {
  const pokemonList = "https://pokeapi.co/api/v2/pokemon?limit=151&offset=0";

  const allPokemonsDB = await Pokemon.findAll({
    include: Type,
  });

  const response = await axios.get(pokemonList);
  const allPokemonApi = response.data.results.map(async (pokemon) => {
    const { data: pokemonData } = await axios.get(pokemon.url);
    return {
      id: pokemonData.id,
      name: pokemonData.name,
      type: pokemonData.types.map((typeInfo) => typeInfo.type.name).join(", "),
      image: pokemonData.sprites.front_default,
      attack: pokemonData.stats[1].base_stat,

      created: false,
    };
  });
  const pokemonData = await Promise.all(allPokemonApi);

  if (allPokemonsDB) {
    const dbPokemonData = allPokemonsDB.map((pokemon) => ({
      id: pokemon.id,
      name: pokemon.name,
      type: pokemon.types.map((type) => type.name).join(", "),
      image: pokemon.image,
      created: pokemon.created,
      attack: pokemon.attack,
    }));
    return [...dbPokemonData, ...pokemonData];
  }

  return pokemonData;
};

// TRAER POKEMON POR ID

const getPokemonById = async (idPokemon, source) => {
  if (source === "api") {
    const url = `https://pokeapi.co/api/v2/pokemon/${idPokemon}`;
    const response = await axios.get(url);
    const { data } = response;

    const { id, name, types, sprites, stats, weight, height, abilities } = data;

    return {
      id,
      name,
      types: types.map((typeInfo) => typeInfo.type.name).join(" "),
      image: sprites.front_default,
      life: stats[0].base_stat,
      attack: stats[1].base_stat,
      defense: stats[2].base_stat,
      speed: stats[5].base_stat,
      weight,
      height,
      abilities: abilities
        .map((abilitiesInfo) => abilitiesInfo.ability.name)
        .join(", "),
      created: false,
    };
  } else if (source === "database") {
    const pokemonData = await Pokemon.findByPk(idPokemon, {
      include: Type,
    });

    if (!pokemonData) {
      throw new Error("Pokémon no encontrado en la base de datos");
    }

    const {
      id,
      name,
      image,
      life,
      attack,
      defense,
      weight,
      height,
      speed,
      types,
      created,
    } = pokemonData;

    const typeNames = types.map((type) => type.name).join(", ");

    return {
      id,
      name,
      types: typeNames,
      image,
      life,
      attack,
      defense,
      weight,
      height,
      speed,
      created,
    };
  } else {
    throw new Error("Fuente de datos no válida");
  }
};

// TRAER POKEMON POR NOMBRE

const getPokemonByName = async (name) => {
  const nameLowerCase = name.toLowerCase();
  const url = `https://pokeapi.co/api/v2/pokemon/${nameLowerCase}`;

  const apiResponse = await axios.get(url);

  const apiData = {
    id: apiResponse.data.id,
    name: apiResponse.data.name,
    types: apiResponse.data.types
      .map((typeInfo) => typeInfo.type.name)
      .join(", "),
    image: apiResponse.data.sprites.front_default,
    created: false,
  };
  const dbResults = await Pokemon.findAll({
    where: {
      name: {
        [Op.iLike]: `%${nameLowerCase}%`,
      },
    },
    include: [
      {
        model: Type,
        through: "PokemonType",
      },
    ],
  });

  const dbData = dbResults.map((result) => ({
    id: result.id,
    name: result.name,
    types: result.types.map((type) => type.name).join(", "),
    image: result.image,
    created: result.created,
  }));

  const combinedResults = [...dbData, apiData];

  if (combinedResults.length === 0) {
    return { message: "No se encontraron Pokémon con ese nombre." };
  }

  return combinedResults;
};

module.exports = {
  getAllPokemons,
  getPokemonById,
  getPokemonByName,
};
