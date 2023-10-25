const axios = require("axios");
const { Type } = require("../db");

//types from api

const getTypesFromApi = async () => {
  const url = "https://pokeapi.co/api/v2/type";

  const response = await axios.get(url);
  return response.data.results.map((type) => type.name);
};

//types db

const saveTypesToDB = async (types) => {
  for (const typeName of types) {
    await Type.create({ name: typeName });
  }
};

module.exports = {
  getTypesFromApi,
  saveTypesToDB,
};
