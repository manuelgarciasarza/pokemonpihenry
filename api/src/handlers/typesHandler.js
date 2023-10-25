const {
  getTypesFromApi,
  saveTypesToDB,
} = require("../controllers/typesController");
const { Type } = require("../db");

const getTypes = async (req, res) => {
  try {
    const typeInDB = await Type.findAll();
    if (typeInDB.length === 0) {
      const typesFromApi = await getTypesFromApi();
      await saveTypesToDB(typesFromApi);
      const updateTypesInDB = await Type.findAll();
      return res.status(200).json(updateTypesInDB);
    }
    return res.status(200).json(typeInDB);
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getTypes,
};
