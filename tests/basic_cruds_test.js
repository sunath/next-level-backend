// process.traceProcessWarnings = true
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
const { getModelObjectWithPayload, ModelWithQueryNotFound, InternalServerError, getModelObjectWithId } = require("../actions");
const { addNotFoundMiddleware } = require("../middleware/notFoundMiddleware");
const { modelDataValidationMiddleware } = require("../middleware/dataValidationMiddleware");
const { runMiddlewares } = require("../middleware/runMiddlwares");
const { removeFieldsAndReturnTheObject } = require("../utils/removeFieldsAndGetTheObject");
const { UserBearerTokenHandler } = require("../middleware/userTokenMiddleware");
const { quickCheckOfRequiredFields } = require("../utils/quickCheckOfRequiredFields");
const { createMongoDBField } = require("../utils/createFields");

mongoose.connect("mongodb://localhost:27017")

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


class MovieDataClass extends DataClass{
    getName(){
        return "movies"
    }
    releaseDate = createMongoDBField(Date,false,[],[])
    name = createMongoDBField(String)
}


UserDataClassFactory.setRemovableFields(['password'])

const UserLoggedFactory = DataClassFacotry.createFactory(UserLogDataClass)
const MovieFactory = DataClassFacotry.createFactory(MovieDataClass)

const userRouter = Router()
const movieRouter = Router()


applyBasicCrud(userRouter,UserDataClass);
applyBasicCrud(movieRouter,MovieDataClass)
app.use(express.json({strict:false}))
app.use("/user",userRouter)
app.use("/movie",movieRouter)

const [createSecurityToken,securityTokenMiddleware]= createSecurityAccessMiddleware("fhejhfwjfbehfevgfenenwn3be3br b3  r3 rb3  r3 ")
// console.log(createSecurityToken,securityTokenMiddleware)
const userLoggedModelDataValiation = modelDataValidationMiddleware(UserLoggedFactory)
const addNotFoundMiddlewareValidation = addNotFoundMiddleware(UserDataClassFactory.getModel(),(data) => data,403,"Invalid Credentials");
userRouter.post("/accesstoken",async function (req,res)  {
//    let response = await userLoggedModelDataValiation(req,res)
//    if(response)return response;
//    response = await addNotFoundMiddlewareValidation(req,res)
//    if(response){
//     return response;
//    }
    const response = await runMiddlewares(req,res,[userLoggedModelDataValiation,addNotFoundMiddlewareValidation]);
    if(response){
       return response;
    }
    try{
        // console.log(req.headers.modelObject,"this is the modek object")
        const data = removeFieldsAndReturnTheObject(JSON.parse(JSON.stringify(req.headers.modelObject)),["password"])
        // console.log(data, " this is data")
        const token = await createSecurityToken(data,60)
        return res.status(200).send(token)
    }catch(error){
        // console.log(error)
        if(error instanceof CreateSecurityAccessTokenError){
            return res.status(500).send(error.errorDetails)
        }
        else if(error instanceof InternalServerError){
            return sendInternalServerError(res)
        }
        return res.status(400).send("some kind of error")
    }
    

})

userRouter.get("/userSecret",securityTokenMiddleware,async function(req,res){
    const user = await getModelObjectWithId(UserDataClassFactory.getModel(),req.verifyDetails._id)
    return res.status(200).send(user)
})


const userBearerTokenHandler = new UserBearerTokenHandler(UserDataClassFactory,"username","password","hejhf3h3hhh3rhg3gr3gr3gr3g3r3",true,60*60);

userRouter.post("/createNewToken",async function(req,res){
    try{
        const response =  await userBearerTokenHandler.checkUserExist(req)
        if(!response.okay){
            return res.status(400).send(response)
        }
       const token = await userBearerTokenHandler.createUserToken(removeFieldsAndReturnTheObject(response.user,["password"]))
       return res.status(200).send(token)
    }catch(error){
        // console.log(error)
        return res.status(400).send(error.message)
    }
       
})


userRouter.get("/verifyNewToken",userBearerTokenHandler.decodeUserToken(),async function(req,res){
    try{
            return res.status(200).send(req.verifyDetails)
    }catch(error){
        return res.status(200).send(error.message)
    }


})

app.get("",(req,res) => res.status(200).send("tes"))
app.listen(8000,() => {
    // console.log(UserDataClassFactory.removeByDefaultFields)
    UserDataClassFactory.setRemovableFields(['password'])
    // console.log(UserDataClassFactory.removableFieldsbyDefault, " these are must be removed")
    // console.log("I'm listening")
})