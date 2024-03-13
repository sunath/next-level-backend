const { getModelObjectWithPayload, InternalServerError, ModelWithQueryNotFound } = require("../actions");

function addNotFoundMiddleware(model,bodyFilter,statusCode,errorMSG) {

    async function middleware(req,res,next) {
        try{
            const response = await getModelObjectWithPayload(model,bodyFilter(req.body))
            console.log(response)
             req.headers.modelObject = response
            next()
        }catch(error){
            console.log(error)
            if(error instanceof InternalServerError){
                return res.status(500).send("internal server error")
            }else if(error instanceof ModelWithQueryNotFound){
                return res.status(statusCode).send(errorMSG)
            }
        }

        next();    
    }

    return middleware
    
}

module.exports = {addNotFoundMiddleware}