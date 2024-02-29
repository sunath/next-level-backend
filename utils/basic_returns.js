const { ERROR_CODES } = require("../routers/basic_crud");

/**
 * send an internal server error response to the user
 * 
 * espcially when the database connection failing 
 * @param {Response} res 
 * @returns {Response}
 */
function sendInternalServerError(res){
    return res.status(500).send({'error':"Internal Server error",'errorId':3})
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


/**
 * a shortcut method for sending response for bad data request in data class
 * simply get the field and the error , send it to the user as a Object
 * @param {Express.Response} res 
 * @param {Object} validationResponse - Validation response of the data class object
 */
function sendErrorWithValidationErrorResponse(res,validationResponse){
    res.status(400).send({'error':validationResponse.data.error,'field':validationResponse.field})
}

module.exports = {sendInternalServerError,sendGetItemsResponse,sendErrorWithValidationErrorResponse}