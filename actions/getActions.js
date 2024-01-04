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
async function getModelObjectWithId(model,id,columns){
    try{
        const response = await model.findOne({_id:id},columns)
        if(!response)throw new ModelWithIdNotFound()
        return response
    }catch(error){
        console.error(error)
        throw new InternalServerError()
    }

}




/**
 * get objects with restrictions of limit and skip
 * return all the objects that given by the query
 * if an error ocuured throw an internal server error
 * @param {Model} model - mongoose model
 * @param {Number} limit - amount of objects you wanna limit
 * @param {Number} skip - how many objects you wanna skip
 * 
 * 
 * @example
 * try{
 * // get the first ten objects
 * const models = await  getAllObjects(model,10,0);
 *  // return the objectcs that received by the model
 *  return res.status(200).send(models)
 * }catch(error){
 * // If an error ouccred send an internal server error response
 *  return res.status(500).send("Internal server error")
 * }
 * 
 * @returns {Promise<Object[]>}
 */
async function getAllModelsObjects(model,limit=10,skip=0){
    try{
        const objects = await model.find({}).skip(skip).limit(limit)
        return objects
    }catch(error){
        throw new InternalServerError("database query could not perform")
    }
}


module.exports = {getModelObjectWithId,getAllModelsObjects}