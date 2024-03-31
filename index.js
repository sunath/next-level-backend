const {DataClass,DataClassFacotry,InvalidDataClassError,NotReturnPromiseError} = require('./dataclasses/base')

const {applyBasicCrud} = require("./routers/basic_crud")


module.exports = {DataClass,DataClassFacotry,InvalidDataClassError,NotReturnPromiseError,applyBasicCrud}