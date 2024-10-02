const { sendResponse, sendError } = require("../utils/responses");
const { comparePassword } = require("../utils/comparePassword");
const { getUserByUsername } = require("../utils/getUserByUsername");
const { generateToken } = require("../auth/generateToken");
const { checkUserData } = require("../utils/checkUserData");

exports.handler = async (event) => {
  const { username, password } = JSON.parse(event.body);

  try {
    await checkUserData(username, password);
  } catch (error) {
    return sendError(400, error.message);
  }

  try {
    const user = await getUserByUsername(username);

    if (!user) {
      return sendError(401, "Wrong username or password.");
    }

    const correctPassword = await comparePassword(password, user);
    if (!correctPassword) {
      return sendError(401, "Wrong username or password.");
    }

    const token = generateToken(user);

    return sendResponse(200, "Login successful.", { token: token });
  } catch (error) {
    return sendError(500, "Error while logging in.");
  }
};
