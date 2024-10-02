// const {sendError} = require("../utils/responses");
const {db} = require("../data/db");


const getQuizById = async (quizType, quizId) => {
    try {
        const fetchedQuiz = await db.get({
        TableName: "quizes",
        Key: {quizType: quizType, quizId: quizId}
    })

    return fetchedQuiz.Item || null

    } catch (error) {
        console.error("Error fetching quiz by ID:", error);
        throw new Error ("Error fetching quiz..")
    }


}
module.exports = {getQuizById}



