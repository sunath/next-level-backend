const { DataClassSubFacotry } = require("../dataclasses/subFactory")
const {UserDataClassFactory, UserDataClass} = require("./dataclassTest")

const userSubFacotry =new  DataClassSubFacotry(UserDataClassFactory.buildDataClassFromModel(['username','age']),UserDataClass)
const classIntance = userSubFacotry.createObject()
// console.log(classIntance)
// console.log(userSubFacotry.dataClass)
// console.log(classIntance.username)
// console.log(userSubFacotry.dataClass.username)