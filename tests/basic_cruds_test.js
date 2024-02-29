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
const { sendErrorWithValidationErrorResponse } = require("../utils/basic_returns");
const { getModelObjectWithPayload, ModelWithQueryNotFound } = require("../actions");

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


userRouter.post("/accesstoken",async function (req,res)  {
    const {create} = createSecurityAccessMiddleware( async (data) => {
        console.log(data)
        const obj = UserLoggedFactory.createObject(data);
        const response = await obj.validate()
        if(response.data.okay){
            try{
                const modelObject = await getModelObjectWithPayload(UserDataClassFactory,data)
            }catch(error){
                if(error instanceof ModelWithQueryNotFound){
                    
                }
            }
            
        }
        return response;
    },"hrfehjr3nmnrb3nvbrc3v nr3mnrb3hnhbrh3ghrv3")

    try{
        const token = await create(req.body)
        return res.status(200).send(token)
    }catch(error){
        if(error instanceof CreateSecurityAccessTokenError){
            return sendErrorWithValidationErrorResponse(res,error.errorDetails)
        }
        return res.status(400).send("some kind of error")
    }
    

})

app.get("",(req,res) => res.status(200).send("tes"))
app.listen(8000,() => {
    console.log("I'm listening")
})