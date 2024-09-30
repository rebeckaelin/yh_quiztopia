const {db} = require("../data/db")

const getQuiz = async (quizname, userId) => {

    try {
        const result = await db.query({
            TableName: "quizes",
            IndexName: "QuizNameIndex",
            KeyConditionExpression: "quizName = :quizname",
            ExpressionAttributeValues: {
                ":quizname": quizname
            },
            FilterExpression: "userId = :userId",
            ExpressionAttributeValues: {
                ":quizname": quizname,
                ":userId": userId
            }
        })
        return result.Items.length > 0 ? result.Items[0] : null
    } catch (error) {
        throw new Error("Could not retrieve quiz.")
    }

}

exports.handler = {getQuiz}