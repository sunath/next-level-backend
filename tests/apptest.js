const express  = require('express')
const {runApp, connectMongoose } = require("../app");

const app = express()
app.get("/",(req,res) => {res.status(200).send("hello world")})

runApp(app,8000,null,connectMongoose("mongodb://localhost:27017"))