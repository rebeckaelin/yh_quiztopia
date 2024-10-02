const checkUserData = async (username, password) => {
  if (
    !username ||
    username.trim() === "" ||
    !password ||
    password.trim() === ""
  ) {
    throw new Error("Username and password are required.");
  }
};

module.exports = { checkUserData };
