class InternalServerError extends Error{}
class NotFound404 extends Error{}

class ModelWithQueryNotFound extends NotFound404{}
class ModelWithIdNotFound extends NotFound404{}

module.exports = {InternalServerError,NotFound404,ModelWithQueryNotFound,ModelWithIdNotFound}