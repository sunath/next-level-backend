
/**
 * define the field with data provided.
 * shortcut method to define fields
 * @param {Type} type  - String,Boolean,Number 
 * @param {Boolean} unique  - wether the field is unique or not 
 * @param {Array<ValidationFunc>} validations - validation functions
 * @param {Array<MapFunc>} beforeValidation - before validation functions
 * @returns 
 */
function createMongoDBField(type,unique,validations,beforeValidation){
    return {type,unique,validations,beforeValidation}
}

module.exports = {createMongoDBField}