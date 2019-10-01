
const generateMessage = (username,text) => {

    return {
        username,
        text: text,
        createdAt: new Date().getTime()
    }
}

const generateLocationMessage = (username,url) => {
    return {
        username,
        createdAt: new Date().getTime(),
        url
    }
}

module.exports = {
    generateMessage,
    generateLocationMessage
}