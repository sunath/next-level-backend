const { DataClassFacotry } = require("../dataclasses/base");

/**
 * 
 * @param {DataClassFacotry} modelFactory 
 */
function modelDataValidationMiddleware(modelFactory){
    async function middleware(req,res,next){

        const object = modelFactory.createObject(req.body)
        // object.init(req.body);
        try{
            const response = await object.validate()
            if(response.data.okay){
                next()
            }else{
                return res.status(403).send(response)
            }
           

        }catch(error){
            return res.status(500).send("Internal Server Error")
        }

        next()
       
    }

    return middleware
}

module.exports = {modelDataValidationMiddleware}