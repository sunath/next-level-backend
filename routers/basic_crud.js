const { Model, deleteModel } = require("mongoose");
const { DataClass, DataClassFacotry } = require("../dataclasses/base");
const {Router} = require("express");
const { sendInternalServerError, sendGetItemsResponse, sendErrorWithValidationErrorResponse, sendBadRequest, sendObjectWithQueryNotFoundErrorResponse } = require("../utils/basic_returns");
const { ModelWithIdNotFound, MongooseInvalidId, ModelWithQueryNotFound } = require("../actions");
const { deleteObjectFromCollection } = require("../actions/deleteActions");
const { removeFieldsAndReturnTheObject } = require("../utils/removeFieldsAndGetTheObject");


const ERROR_CODES = {
    ID_NOT_FOUND : 1,
    ID_IS_INVALID: 2,
    INTERNAL_SERVER_ERROR:3
}


/**
 * Takes a router and a data class
 * add 5 endpoints to the router
 * get getAll post update delete
 * A generic functions that can be applied for any class
 * @param {Router} router 
 * @param {DataClass} dataclass 
 */
function applyBasicCrud(router,cls){
    // initialize the basic factory from the given class
    const classFactory = DataClassFacotry.createFactory(cls)
    // get the mongoose model
    const model = classFactory.getModel();

    // add the get by id facility
    addGetById(router,classFactory);
    getAllObjects(router,classFactory);


    /**
     * Get all requests
     */
    // router.get("/all",function(req,res){
    //     const skipVal = req.query['from'] || 0
    //     const limitVal = req.query['to'] || 10
    //     console.log(model)
    //     model.find().skip(skipVal).limit(limitVal).then(e => {
    //         return res.status(200).send(e)
    //     })

        
    // })

    /**
     * Post request
     */
    addModelPost(router,classFactory)


    // update the model
    addModelPut(router,classFactory)

    // delete the mode 
    addModelDelete(router,classFactory)
}



/**
 * add the most baic route
 * 
 * get the user by id
 * 
 * request look like this 
 * // {url}?id=1213290490343
 * @param {Router} router 
 * @param {Model} model 
 * @param {DataClassFacotry} factory
 */
function addGetById(router,factory){
     // write the default get function with id
     router.get("/",async function(req,res){
        //take the id from the query
        const id = req.query['id']
        // check the id exists
        if(!id){
            // if the id is not given the response as a bad request
            // set the error as id must be defined
            return sendBadRequest({'error':"Id must be defined",errorId:ERROR_CODES.ID_NOT_FOUND})
        }else{

            try{
                // get the object by the factory class
                const object = await factory.getModelObjectById(id,null)
                return sendGetItemsResponse(res,object)
            }catch(error){
                if(error instanceof MongooseInvalidId){
                    return sendBadRequest("The given id is wrong.")
                }
                // if the id do not exists
                if(error instanceof ModelWithIdNotFound){
                    // send an 404 error
                    return res.status(404).send({error:"Object with that Id does not exist",errorID:ERROR_CODES.ID_IS_INVALID}) 
                }else{
                    // in case of database connection failed
                    // or any other error ouccured
                    // return res.status(500).send({error:"Internal server error",errorId:ERROR_CODES.INTERNAL_SERVER_ERROR})
                    return sendInternalServerError(res)
                }
            }
        }
    })
}



/**
 * Can be used to retrive many objects at one
 * most commonly used to retrive data in a table
 * or maybe in a scroll bar
 * for example think you have a class called Food
 * you can get 10 foods as a array by using this endpoint
 * 
 * @param {Router} router 
 * @param {DataClassFacotry} dataClassFactory 
 * @param {Number} limit 
 * @param {Number} skip 
 */
function getAllObjects(router,dataClassFactory,limit=10,skip=0){
    router.get("/all",async function(req,res){

        // query the limit
        // set it to user defined value or default value
        limit = req.query['limit'] || limit
        // query the skip
        // set it to user defined value or default value
        skip = req.query['skip'] || skip

        try{
            const models = await dataClassFactory.getModelObjectsWithAll(limit,skip)
            // send items to the user
            return sendGetItemsResponse(res,models)
        }catch(error){
            // send an internal server error if a error occured
            return sendInternalServerError(res)
        }
        
    }) 
}


/**
 *add a basic post endpoint create a new object of a model
 * @param {Router} router
 * @param {DataClassFacotry} classFactory
 */
function addModelPost(router,classFactory){
    router.post("/",async function(req,res){
        // create a new empty object object and set the data according to the request body
        const newObject = classFactory.createObject(req.body)
        // console.log(newObject, " object intialized")
        // validate the data
        let response = await newObject.validate()
        // console.log("got the response ",response)
        // if an error happens
        if(!response.data.okay){
            // only send the error in the field and the field name
            return sendErrorWithValidationErrorResponse(res,response)
        }
        try{
            // get the data should be saved to the database
            // if the dataclass have beforeValidation functions they will change the details 
            const data = await newObject.transformValidateDataToBeSaved(req.body)
            // await until we create the user
            response = await classFactory.createModelObject(data)
            // remove the fields that should remove by default and send the object
            return res.status(200).send(removeFieldsAndReturnTheObject(response['_doc'],newObject.getRemovableFields()))
        }catch(error){
            // console.log(error)
            return sendInternalServerError(res)
        }
       
    })
}

/**
 * a dynamic view to write the update route  for any model
 * @param {Router} router 
 * @param {DataClassFacotry} classFactory 
 * @param {Object} changes 
 */
function addModelPut(router,classFactory,changes){
    router.put("/",async function(req,res){
       try{
        // update the model if we can
           const data = await classFactory.updateModelObject(req.body.query,req.body.payload)
           return res.status(200).send(data)
       }catch (error){
        // console.log(error)
           if(error instanceof ModelWithQueryNotFound) return sendObjectWithQueryNotFoundErrorResponse(res)
           return sendInternalServerError(res)
       }

    })
}

/**
 * delete a model with a specific id if only exist
 * a simple view
 * take an id
 * then try to find it exist or not
 * if it's exist then delete
 * otherwise throw an error 
 * @param {Express.Router} router 
 * @param {*} classFactory 
 */
function addModelDelete(router,classFactory){
    router.delete("/",async function(req,res){

        try{
            // grab the id if exists
            const id = req.query['id']
            if(!id){
                // throw an error if not
                return sendBadRequest("id must be defined")
            }
            // wait till the object is being deleted
            const response = await deleteObjectFromCollection(classFactory.getModel(),id)
            // if no error ouccred send an empty response
            return res.status(204).send("")
        }catch(error){
            // return the message of the error
            return res.status(400).send(error.message)
        }
      
    })
    
}


module.exports = {applyBasicCrud,addGetById,addModelPost,addModelPut}