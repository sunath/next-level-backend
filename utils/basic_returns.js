const { ERROR_CODES } = require("../routers/basic_crud");

/**
 * send an internal server error response to the user
 * 
 * espcially when the database connection failing 
 * @param {Response} res 
 * @returns {Response}
 */
function sendInternalServerError(res){
    return res.status(500).send({'error':"Internal Server error",'errorId':ERROR_CODES.INTERNAL_SERVER_ERROR})
}



/**
 * send data with status code 200
 * 
 * especially for get requests with simple data 
 * 
 * @param {Response} res - express Response Object
 * @param {Object} data - json like object
 * @returns 
 */
function sendGetItemsResponse(res,data){
    return res.status(200).send(data)
}

module.exports = {sendInternalServerError,sendGetItemsResponse}