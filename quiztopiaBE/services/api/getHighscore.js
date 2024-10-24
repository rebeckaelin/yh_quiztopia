const { db } = require("../data/db");
const { sendResponse, sendError } = require("../utils/responses");

exports.handler = async (event) => {
  const quizId = event.pathParameters.quizId;
  try {
    const result = await db.query({
      TableName: "leaderboard",
      KeyConditionExpression: "quizId = :quizId",
      ExpressionAttributeValues: {
        ":quizId": quizId,
      },
    });

    if (result.Items.length === 0) {
      return sendError(404, "No scores added yet!");
    }

    const sortedPoints = result.Items.sort((a, b) => b.highscore - a.highscore);

    return sendResponse(200, "Success", sortedPoints);
  } catch (error) {
    return sendError(500, "Error fetching leaderboard.");
  }
};
