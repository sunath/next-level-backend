const {createMongoDBField} = require("./createFields")
const responses = require("./basic_returns")
const passwordHashing = require('./password_hashing')
const {removeFieldsAndReturnTheObject} = require("./removeFieldsAndGetTheObject")
const {functionToPromise} = require("./functionToPromise")
const checkTheObjectPromiseOrNot = require("./promiseChecking")

module.exports = {createMongoDBField,
    ...responses,
    ...passwordHashing,
    removeFieldsAndReturnTheObject,
    functionToPromise,
    checkTheObjectPromiseOrNot
}