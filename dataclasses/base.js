const { Schema, default: mongoose } = require("mongoose");
const iterateList = require("../utils/iterateAndPrint")
const checkTheObjectPromiseOrNot = require("../utils/promiseChecking");
const { typeChecking, unqiueValidator } = require("./validators");
const  {getModelObjectWithId,getAllModelsObjects,addNewObjectToCollection} = require("../actions");
const { linearFindMaxNumber } = require("../utils/linearAlogirthms");

/**
 * Base class for every data class
 * 
 * Data class will be used for validating and turn dictonary into classes
 * 
 * In case you are an oop fan
 */
class DataClass{

    
    /**
     * A function to validate user data
     * This function must be override by the subclass
     */
    validationAllData(form){return true};

    /**
     * Return the fields of the data class object
     * work as a helper method for retriving the attributes
     * @param {DataClass} thisObj 
     * @returns 
     */
    static getOwnPropertyNames(thisObj){
        return Object.keys(thisObj).filter(e => (e != "validations" && e != "form_data" && e != "model"))
    }
    
    /**
     * Initialize and setup the core of the data class
     * extract information about the model and extract validations.
     * Throw errors if the data isn't the way it supposed to
     */
    init(data){
        // Get the properties out of the instance created by the factory class
        const properties = DataClass.getOwnPropertyNames(this);
        // Initialize the validations into an empty list
       let validations = {}
        // Iterate through all the properties 
        iterateList(properties,(property) => {
            // Set the validations of the property into a new dictionary
            // add the type checking validation by the base class
            validations[property] =  [
                typeChecking(this[property]['type'],property),
            ...(this[property]['validations'] ||[])]

            // add the unique validator if the we have the unique in the property attributes
            if(this[property]['unique']){
                validations[property].push(unqiueValidator(property,this.model))
            }
        })

        // Define the validations in the object properites 
        //and set it to the extracted validations
        Object.defineProperty(this,'validations',{
            get:() => validations
        })

        Object.defineProperty(this,'form_data',{
            get:() => data
        })
    }


    async validate(){
       
        // Get the all fields of the validations in the class
        const validateKeys = DataClass.getOwnPropertyNames(this.validations);
        // gather information about how many validations owns by one by one
        const lengths = validateKeys.map(e => this.validations[e].length)
        // Start to calculate the maximum rounds we need to go
        let maxRounds = 0 ;
        let i = 0 ;
        // loop through lengths to find the maximum length
        for(i =  0;  i < lengths.length;i++){
            // set the maximum
            maxRounds = maxRounds < lengths[i] ? lengths[i] : maxRounds
        }

        // Start executing validations
        for(i=0; i < maxRounds;i++){
            // Get single validator from a field
            for(let j = 0 ; j < lengths.length;j++){
                // Grab the validation of specific key
                const element_validations = this.validations[validateKeys[j]];
                // if the validations are complete continue to the next one
                if(i >= element_validations.length)continue
                // grab the validations next function
                const validation  = element_validations[i]
                // validate it 
                const outputPromise = validation(this.form_data[validateKeys[j]])
                // Check weather our output is correct or not
                if(!checkTheObjectPromiseOrNot(outputPromise))throw new NotReturnPromiseError("promised object must be returned");
                // Get the promise data
                const data = await outputPromise;
                // if data is not okay return a payload else return nothing of course
                if(!data.okay){
                    return {data:data,field:validateKeys[j]}
                }
            }
        }

        return {data:{okay:true}}
    }

    /**
     * this only takes the data given and check the data is okay according to the model
     * validations done just like the normal validate function in the model
     * but the other fields that are not in payload will not be cared
     * suitable for run before updating data releated to a model
     * of course it means you should do it no matter what if you like to write code
     * @param {Object} payload - key value pair 
     * @returns {Object || Null} return an Object which contains error data or null if there's no errors
     */
    async validateOnlyPayload(payload){
        // get the fields that has to be validated
        const validateFields = Object.keys(payload)

        function getTheLengthOfValidateField(field){
            return this.validations[field].length
        }
        // get the maximum loops we have to run 
        const maximumNumber = linearFindMaxNumber(validateFields,getTheLengthOfValidateField.bind(this));
        //
        for(let i = 0; i < maximumNumber;i++){
            for(let j = 0 ; j < validateFields.length;j++){
                // get the field that needs to be validated
                const validateField = this.validations[validateFields[j]];
                // check wether it has run all the validations
                // if it is continue to next field;
                if(validateField.length > i )continue;
                // else get the next validation function
                const validation = validateField[i];
                // extract the value to pass to the validation function
                const validateValue = payload[validateFields[j]]
                // get the returned promise
                const validatePromise = validation(payload[validateValue]);
                // check weather output matches with our pattern
                // user must return a promise
                if(!checkTheObjectPromiseOrNot(validatePromise))throw new NotReturnPromiseError("A promise should be returned;");
                // if all clear wait till the validated output
                const validatedOutput = await validatePromise()
                // it it's not okay return the error data and the field
                if(!validatedOutput.okay){
                    return {data:validatedOutput,field:validateFields[j]}
                }             
            }
        }

        // all ran successfully
        return {data:{okay:true}};
    }

    getName(){
        throw new NotReturnPromiseError("getName function must be override by the subclass")
    }

    /**
     * 
     * @param {Boolean} timestamps - use to declare weather you need default timestamps or not
     * @returns 
     */
    buildModel(timestamps=true){
        const properties = DataClass.getOwnPropertyNames(this)
        const shcemaObject = {}
        for(let i = 0 ; i < properties.length;i++){
            const propertyName = properties[i]
            const attributes = this[propertyName]
            if(attributes['validations']){
                delete attributes['validations']
            }
            shcemaObject[propertyName] = attributes
        }
        const schema = new Schema(shcemaObject,{timestamps:timestamps});
        const model = mongoose.model(this.getName(),schema) 
        return model;
    }
}

/**
 * This error mainly be thrown by the DataClassFactory
 * 
 * It will be thrown if you give factory something that not extends from DataClass
 */
class InvalidDataClassError extends Error{}



/**
 * This error mainly be thrown by the validate function
 * the validation function must return a promise
 * wether it requires query or not
 * otherwise the error NotReturnPromiseError will occure
 */
class NotReturnPromiseError extends Error{}


/**
 * This error mainly cause when you don't override functions you have to
 * Especially you should override dataclass function call getName
 * @example
 * class DummyData extends DataClass{
 * 
 *      name = {
 *          type:String
 *      }
 * 
 *      getName(){
 *      return "dummy_data"     
*        }
 * }
 * 
 */
class MustBeOverrideByTheSubclass extends Error {}

/**
 * Base Factory for Data class 
 * It can be used to create objects and 
 * # Wrtie more document please
 */
class DataClassFacotry{

    // Store the subclass of the DataClass
    dataClass;
    model;


    static models = {}

    // Mainly used to get the subclass
    constructor(cls,metaData){
        this.dataClass = cls;
        this.model = this.getModel()
        this.metaData = metaData;
    }
   
    /**
     * 
     * @param {Object} data - A javascript object containing user data
     * @returns {DataClass} - the subclass 
     */
    createObject(data){
        // Init a new object
        let object = new this.dataClass()
         //set the model
        object.model = DataClassFacotry.models[object.getName()]
        // Check wether object is a data class or not
        if(!(object instanceof DataClass))throw new InvalidDataClassError("Data class is invalid");
        // extract field information
        object.init(data)
        // set the attriubute values
        iterateList(DataClass.getOwnPropertyNames(object),(e) => {
            object[e] = data[e]
        })
        // return the customize object
        return object

    }

    getModel(){
        const c  = new this.dataClass()
        if(!DataClassFacotry.models[c.getName()]){
            const timestamps = this.metaData ? this.metaData['timestamps'] : true
            DataClassFacotry.models[c.getName()] = c.buildModel(timestamps)
        }
        return DataClassFacotry.models[c.getName()];
    }

    // Create new class factory to the given class
    static createFactory(cls){
        return new DataClassFacotry(cls);
    }

    /**
     * get an object of a given id
     * if the id is not found throw an error
     * In case of an internal server error occurred a expection will be thrown(InternalServerError)
     * Moreover if the object with that given id does not exsit an exception will be thrown(ModelWithIdNotFound)
     * @param {String} id 
     * @returns 
     */
    getModelObjectById(id){
        return getModelObjectWithId(this.getModel(),id)
    }

    /**
     * Get the all objects with a limit and a skip
     * mostly used to retrive data for data tables
     * with the limit and skip
     * @param {Number} limit 
     * @param {Number} skip 
     * @returns 
     */
    getModelObjectsWithAll(limit=10,skip=0){
        return getAllModelsObjects(this.getModel(),limit,skip);
    }

    /**
     * create a new object of the data class in the database
     * @param {Object} validatedData - data that gone through the data class validation process
     * @returns {Promise<Object>}
     */
    createModelObject(validatedData){
            return addNewObjectToCollection(validatedData)
    }


    updateModelObject(){}

}


module.exports = {DataClass,DataClassFacotry,InvalidDataClassError,NotReturnPromiseError}


