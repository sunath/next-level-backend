const { InternalServerError, ModelWithIdNotFound } = require(".")

/**
 * find an object by the object id
 * if a database or some kind of system error to be found it might return an internal server error
 * if the model with id is not found , error called ModelWithIdNotFound error might be thrown
 * @example
 * try{
 *    const model = await getModelObjectWithId(UserModel,id);
 *      return res.status(200).send({'data':model})
 * }catch(error){
 *  
 *    if(error instanceof ModelWithIdNotFound){
 *      return res.status(404).send({"error":"model with that id is not found"})
 *  }else if(error instanceof InternalServerError){
 *      return res.status(500).send({'error':"Internal server error"})
 * }
 * 
 * }
 * 
 * @param {Model} model - Mongoose model 
 * @param {String} id  - string which is a id of a mongo db model
 * @returns {Object}    - Queried Object
 * 
 */
async function getModelObjectWithId(model,id){
    try{
        // await until we receive the data
        const response = await model.findOne({_id:id})
        // if the data we recive is none throw an error
        if(!response)throw new ModelWithIdNotFound()
        // if not return the queried model
        return response
    }catch(error){
        // if a error occure we simply throw an internal server error
        throw new InternalServerError()
    }

}


module.exports = { getModelObjectWithId}