class InternalServerError extends Error{}
class NotFound404 extends Error{}

class ModelWithIdNotFound extends NotFound404{}

const getItems = require("./getActions")
const postItems = require("./postActions")

module.exports = {InternalServerError,ModelWithIdNotFound,NotFound404,...getItems,...postItems}