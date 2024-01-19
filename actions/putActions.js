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
    const obj = await getUserById(model,id);
    const tempObj = classFacotry.createObject(obj);
    const objectValidations = await tempObj.validate();
    if(objectValidations)return objectValidations;
    await obj.update(payload)
    return null;
    
}