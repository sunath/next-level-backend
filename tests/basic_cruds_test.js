const { Router } = require("express");
const { applyBasicCrud } = require("../routers/basic_crud");
const { UserDataClass,UserDataClassFactory } = require("./dataclassTest");
const express  = require("express")
const app = express()
app.use(express.json())

const mongoose = require("mongoose");
const { createSecurityAccessMiddleware, CreateSecurityAccessTokenError } = require("../middleware/seucrityAccessMiddleware");
const { DataClass, DataClassFacotry } = require("../dataclasses/base");
const { is_required } = require("../dataclasses/validators");
const { sendErrorWithValidationErrorResponse, sendInternalServerError } = require("../utils/basic_returns");
const { getModelObjectWithPayload, ModelWithQueryNotFound, InternalServerError } = require("../actions");
const { addNotFoundMiddleware } = require("../middleware/notFoundMiddleware");
const { modelDataValidationMiddleware } = require("../middleware/dataValidationMiddleware");

mongoose.connect("mongodb+srv://next-level-backend:jAe5v6ASvlCsqUwg@cluster0.tc7v1.mongodb.net/next-level-backend?retryWrites=true&w=majority")


class UserLogDataClass extends DataClass{
    username = {
        type:String,
        validations:[is_required("username is required")]
    }

    password = {
        type:String,
        validations:[is_required("passwor is required")]
    }

    getName(){
        return "user_logged_dataclass"
    }
}

const UserLoggedFactory = DataClassFacotry.createFactory(UserLogDataClass)

const userRouter = Router()

applyBasicCrud(userRouter,UserDataClass);
app.use(express.json({strict:false}))
app.use("/user",userRouter)


userRouter.post("/accesstoken",modelDataValidationMiddleware(UserLoggedFactory),addNotFoundMiddleware(UserDataClassFactory.getModel(),(data) => data,403,"Invalid Credentials"),async function (req,res)  {
    try{
        console.log(req.headers.modelObject,"this is the modek object")
        const token = "hello"
        // const token = await create({username,_id})
        return res.status(200).send(token)
    }catch(error){
        console.log(error)
        if(error instanceof CreateSecurityAccessTokenError){
            return res.status(500).send(error.errorDetails)
        }
        else if(error instanceof InternalServerError){
            return sendInternalServerError(res)
        }
        return res.status(400).send("some kind of error")
    }
    

})

app.get("",(req,res) => res.status(200).send("tes"))
app.listen(8000,() => {
    console.log("I'm listening")
})