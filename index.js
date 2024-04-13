const {DataClass,DataClassFactory,InvalidDataClassError,NotReturnPromiseError} = require('./dataclasses/base')

const {applyBasicCrud} = require("./routers/basic_crud")


module.exports = {DataClass,DataClassFactory,InvalidDataClassError,NotReturnPromiseError,applyBasicCrud}