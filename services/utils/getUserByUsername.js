const { db } = require("../data/db");

const getUserByUsername = async (username) => {
  const { Item } = await db.get({
    TableName: "users",
    Key: {
      username: username,
    },
  });
  return Item;
};

module.exports = { getUserByUsername };
