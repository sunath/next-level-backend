const { Model } = require("mongoose");
const { DataClass, DataClassFacotry } = require("../dataclasses/base");
const {Router} = require("express")


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

    
    addGetById(router,model);


    /**
     * Get all requests
     */
    router.get("/all",function(req,res){
        const skipVal = req.query['from'] || 0
        const limitVal = req.query['to'] || 10
        console.log(model)
        model.find().skip(skipVal).limit(limitVal).then(e => {
            return res.status(200).send(e)
        })

        
    })

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
 * 
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
            return res.status(400).send({'error':"Id must be defined"})
        }else{
            // find the model with the id
            model.findOne({_id:id}).then(e => {
                if(!e){
                    return res.status(404).send({error:"invalid id"})
                }
                return res.status(200).send(e)
            }).catch(error => {
                console.log(error)
                return res.status(500).send({})
            })
        }
    })
}


module.exports = {applyBasicCrud}