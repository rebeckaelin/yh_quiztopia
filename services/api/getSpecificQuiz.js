const { getQuizById } = require("../utils/getQuizById");
const { sendResponse, sendError } = require("../utils/responses");

const handler = async (event) => {
  const quizId = event.pathParameters.quizId;

  if (!quizId) {
    return sendError(400, "Quiz id is required in URL");
  }
  try {
    const fetchedQuiz = await getQuizById("quiz", quizId);
    if (!fetchedQuiz) {
      return sendError(404, "Quiz not found..");
    }

    return sendResponse(200, "Success", fetchedQuiz);
  } catch (error) {
    return sendError(500, "Error fetching quiz!");
  }
};

module.exports = { handler };
