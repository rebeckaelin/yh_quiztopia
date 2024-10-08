const { db } = require("../data/db");
const { v4: uuid } = require("uuid");
const { sendResponse, sendError } = require("../utils/responses");
const { hashPassword } = require("../utils/hashPassword");
const { getUserByUsername } = require("../utils/getUserByUsername");
const { checkUserData } = require("../utils/checkUserData");

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  try {
    await checkUserData(username, password);
  } catch (error) {
    return sendError(400, error.message);
  }

  const usernameRegex = /^[a-zA-Z]+$/; // Endast bokstäver
  if (!usernameRegex.test(username)) {
    return sendError(400, "Username can only contain letters (A-Z, a-z).");
  }

  let hashedPassword;

  try {
    hashedPassword = await hashPassword(password);
  } catch (error) {
    return sendError(500, "Error while hashing password.");
  }

  try {
    const userExists = await getUserByUsername(username);
    if (userExists) {
      return sendError(409, "Username already exists.");
    }

    const newUser = {
      userId: uuid(),
      username: username,
      password: hashedPassword,
    };

    await db.put({
      TableName: "users",
      Item: newUser,
    });
    return sendResponse(201, "New user created.", newUser);
  } catch (error) {
    return sendError(500, error.message);
  }
};
