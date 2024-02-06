
const {Error} = require("mongoose")

/**
 * Usually called when the post request happens
 * basically create the object and save it
 * then return the object given by the mongodb
 * @param {Model} model 
 * @param {Object} validatedData 
 * @returns {Promise<Object>}
 */
async function addNewObjectToCollection(model,validatedData){
    try{
        console.log(model, " this is the model")
        // create the object
        const modelObject = model(validatedData)
        // wait until it saved
        const response = await modelObject.save()
        return response;
    }catch(error){
        // raise an error if the error ouccred
        console.log(error)
        return error;
    }
    
}

module.exports = {addNewObjectToCollection}