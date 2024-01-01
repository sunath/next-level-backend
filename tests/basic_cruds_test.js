const { Router } = require("express");
const { applyBasicCrud } = require("../routers/basic_crud");
const { UserDataClass } = require("./dataclassTest");
const express  = require("express")
const app = express()

const mongoose = require("mongoose")

mongoose.connect("mongodb+srv://next-level-backend:jAe5v6ASvlCsqUwg@cluster0.tc7v1.mongodb.net/next-level-backend?retryWrites=true&w=majority")


const userRouter = Router()

applyBasicCrud(userRouter,UserDataClass);
app.use(express.json({strict:false}))
app.use("/user",userRouter)


app.get("",(req,res) => res.status(200).send("tes"))
app.listen(8000,() => {
    console.log("I'm listening")
})