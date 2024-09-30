const sendResponse = (statusCode, message, data) => {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            message: message,
            data: data
        }),
    };
};

const sendError = (statusCode, message) => {
    return {
        statusCode: statusCode,
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({message: message})
    }
}

module.exports = {sendResponse, sendError}