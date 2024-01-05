
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
        // create the object
        const modelObject = this.model(validatedData)
        // wait until it saved
        const response = await modelObject.save()
        return response;
    }catch(error){
        // raise an error if the error ouccred
        return error;
    }
    
}

module.exports = {addNewObjectToCollection}