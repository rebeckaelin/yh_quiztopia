const { db } = require("../data/db");
const { sendResponse, sendError } = require("../utils/responses");
const { validateToken } = require("../../middleware/validateToken");
const middy = require("@middy/core");

const handler = middy()
  .use(validateToken())
  .handler(async (event) => {
    const quizId = event.pathParameters.quizId;
    const loggedInUser = event.userId;

    if (!quizId) {
      return sendError(400, "Quiz id is required in URL");
    }

    try {
      const existingQuiz = await db.get({
        TableName: "quizes",
        Key: { quizType: "quiz", quizId: quizId },
      });

      if (!existingQuiz.Item) {
        return sendError(404, "Quiz not found..");
      }
      if (existingQuiz.Item.userId !== loggedInUser) {
        return sendError(
          403,
          "You do not have permission to delete this quiz."
        );
      }

      const deletedQuiz = await db.delete({
        TableName: "quizes",
        Key: {
          quizType: "quiz",
          quizId: quizId,
        },
        ReturnValues: "ALL_OLD",
      });

      return sendResponse(
        200,
        "Quiz successfully deleted",
        deletedQuiz.Attributes
      );
    } catch (error) {
      return sendError(500, "Error deleting quiz.");
    }
  });

module.exports = { handler };
