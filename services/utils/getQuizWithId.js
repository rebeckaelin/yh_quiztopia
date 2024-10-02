const {sendError} = require("../utils/responses");

const getQuizById = async (quizType, quizId) => {
    try {
        const fetchedQuiz = await db.get({
        TableName: "quizes",
        Key: {quizType: quizType, quizId: quizId}
    })

    return fetchedQuiz

    } catch (error) {
        return sendError(404, "Quiz not found..")
    }


}
module.exports = {getQuizById}



