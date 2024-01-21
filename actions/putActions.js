const { Document } = require("mongoose");
const { ModelWithIdNotFound, InternalServerError, getUserById } = require(".");
const { DataClassFacotry } = require("../dataclasses/base");


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
    const obj = await getUserById(model,id);
    // create a new object temperaroy w
    const tempObj = classFacotry.createObject(obj);
    const objectValidations = await tempObj.validate();
    if(objectValidations)return objectValidations;
    await obj.update(payload)
    return null;
    
}