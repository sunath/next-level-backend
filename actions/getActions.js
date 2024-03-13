const { InternalServerError, ModelWithIdNotFound } = require("./errors")
const {ModelWithQueryNotFound} = require("./errors");

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
        const response = await model.findOne({_id:id})
        if(!response)throw new Error("no model found")
        // if not return the queried model
        return response
    }catch(error){
        // if a error occure we simply throw an internal server error
        throw error;
    }
}

/**
 * get the object of the data class if matching payload was found in the query
 * if not throw an ModelWithQueryNotFound error
 * In case of server could not perform the query it throw an InternalServerError
 * @param model - Mongoose Model
 * @param query - Plain Javascript Object
 * @returns {Promise<Mongoose.Model>}
 */
async function getModelObjectWithPayload(model,query){
    try{
        const object = await model.findOne(query)
        if(!object)throw new ModelWithQueryNotFound("A model containing that data wasn't found")
        return object
    }catch(error){
        if(error instanceof ModelWithQueryNotFound)throw error;
        throw new InternalServerError("internal server error happened")
    }
}

/**
 *  return a list of models
 *  limit how many data parts we need
 *  skip is how much we wanna skip from the beginning
 * @param model {Mongoose.Model}
 * @param limit {Number}
 * @param skip {Number}
 * @returns {Promise<Mongoose.Model>}
 */
async function getAllModelsObjects(model,limit,skip){
        const models = await model.find().limit(limit).skip(skip)
        return models
}
module.exports = {getModelObjectWithId,getModelObjectWithPayload,getAllModelsObjects}