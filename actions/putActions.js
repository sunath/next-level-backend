const { Document } = require("mongoose");
const { ModelWithIdNotFound, InternalServerError } = require("./errors");
const {getModelObjectWithId} = require("./getActions")




/**
 * update a model with the payload
 * id , model , classfactory and payload must be given
 * model object will be updated according to the payload
 * return null if no error ouccred
 * @param {String} id 
 * @param {Document} model 
 * @param {DataClassFacotry} classFacotry 
 * 
 * @returns {null} 
 */
async function updateTheModelWithTheId(id,model,classFacotry,payload){
    // get the object if its exist
    // if an error thrown it's has to be handle by the high order function
    const obj = await getModelObjectWithId(model,id);
    await classFacotry.getModel().updateOne({_id:id},payload)
    return null;
    
}

module.exports = {updateTheModelWithTheId}