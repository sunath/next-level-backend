const { Model } = require("mongoose");
const { DataClass, DataClassFacotry } = require("../dataclasses/base");
const {Router} = require("express");
const { sendInternalServerError, sendGetItemsResponse } = require("../utils/basic_returns");



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
    router.post("",async function(req,res){
        const object = classFactory.createObject(req.body)
        const response = await object.validate()
        if(!response.data.okay)return res.status(400).send(response.data)
        const obj = classFactory.model(req.body)
        obj.save().then(e => {
            return res.status(200).send(e)
        })
        
    })
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
 */
function addGetById(router,model){
     // write the default get function with id
     router.get("/",function(req,res){
        //take the id from the query
        const id = req.query['id']
        // check the id exists
        if(!id){
            // if the id is not given the response as a bad request
            // set the error as id must be defined
            return res.status(400).send({'error':"Id must be defined",errorId:ERROR_CODES.ID_NOT_FOUND})
        }else{
            // find the model with the id
            model.findOne({_id:id}).then(e => {
                if(!e){
                    return res.status(404).send({error:"invalid id",errorID:ERROR_CODES.ID_IS_INVALID})
                }
                return res.status(200).send(e)
            }).catch(error => {
                return res.status(500).send({error:"Internal server error",errorId:ERROR_CODES.INTERNAL_SERVER_ERROR})
            })
        }
    })
}



/**
 * Can be used to retrive many objects at one
 * 
 * for example think you have a class called Food
 * you can get 10 foods as a array by using this endpoint
 * 
 * @param {Router} router 
 * @param {Model} model 
 * @param {Number} limit 
 * @param {Number} skip 
 */
function getAllObjects(router,model,limit=10,skip=0){
    router.get("/all",async function(req,res){

        limit = req.query['limit'] || limit
        skip = req.query['skip'] || skip

        try{
            const models = await model.find({}).limit(limit).skip(skip)
            return sendGetItemsResponse(res,models)
        }catch(error){
            return sendInternalServerError(res)
        }
        
    }) 
}


/**
 * 
 */
function addModel(){

}

module.exports = {applyBasicCrud,ERROR_CODES}