const { Model } = require("mongoose");
const { DataClass, DataClassFacotry } = require("../dataclasses/base");
const {Router} = require("express");
const { sendInternalServerError, sendGetItemsResponse } = require("../utils/basic_returns");
const { ModelWithIdNotFound } = require("../actions");



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
    addGetById(router,model);
    getAllObjects(router,model);


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
            return res.status(400).send({'error':"Id must be defined",errorId:ERROR_CODES.ID_NOT_FOUND})
        }else{

            try{
                // get the object by the factory class 
                const object = await factory.getModelObjectById(id)
                return sendGetItemsResponse(res,object)
            }catch(error){
                // if the id do not exists
                if(error instanceof ModelWithIdNotFound){
                    // send an 404 error
                    return res.status(404).send({error:"invalid id",errorID:ERROR_CODES.ID_IS_INVALID}) 
                }else{
                    // in case of database connection failed
                    // or any other error ouccured
                    return res.status(500).send({error:"Internal server error",errorId:ERROR_CODES.INTERNAL_SERVER_ERROR})
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
            // retrive the objects
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
        let response = await classFactory.createObject(req.data).validate()
        if(!response.okay)return res.status(400).send(response)
        try{
            response = await classFactory.createModelObject(req.data)
            return res.status(200).send(response)
        }catch(error){
            return res.status(500).send({'error':"Internal server error"})
        }
       
    })
}

module.exports = {applyBasicCrud,ERROR_CODES}