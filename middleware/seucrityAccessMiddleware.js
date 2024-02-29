const { functionToPromise } = require("../utils/functionToPromise");
const {sign} = require("jsonwebtoken")


class CreateSecurityAccessTokenError extends Error{}
class SecurityKeyMustDefineError extends Error{}
class SecurityKeyLengthMustBeIncreased extends Error{}


const SECURITY_MINIMUM_LENGTH = 20

function createSecurityAccessMiddleware(securityAccessTokenValidation,secret){

    if(typeof(secret) != "string"){
        throw new SecurityKeyMustDefineError("security key must be given to create the token.")
    }else if(secret.length < SECURITY_MINIMUM_LENGTH){
        throw new SecurityKeyLengthMustBeIncreased(`seucrity key at least have ${SECURITY_MINIMUM_LENGTH} or many characters.`)
    }

    async function createSecurityAccessToken(data,tokenexpiresInSecond=60*60){
        const response = await securityAccessTokenValidation(data);
        if(response){
            const error = new CreateSecurityAccessTokenError(response);
            error.errorDetails = response
            throw error
        }
        const token = sign(data,secret,{
            expiresIn:tokenexpiresInSecond
        });
        return token;
    }

    /**
     * 
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @param {*} next 
     */
    async function validateSecurityAccessToken(req,res,next){
        
    }


    return {'create':createSecurityAccessToken}

}


module.exports = {createSecurityAccessMiddleware,CreateSecurityAccessTokenError}