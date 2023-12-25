/**
 * This is prototype server of the real social media servers
 * In this application , we will simply 
 *          
 *      1.Create users
 *      2.Authentication
 *      3.Send Posts
 *      4.Like and Share
 *      5.Comments 
 */


// Configure the environment
require("dotenv").config()

// Setting constants
// 1. Defining the server port
const PORT = process.env.PORT || 8000

// 2. Defining the Cors middleware properites
// Since we use it to get other servers connected, 
// we are going to let the servers .env file provide or the every server to take data
// same goes for methods and credentials
const CORS_PROPERTIES = {
    'origin':process.env.CORS_ORIGINS || "*",
    'methods':process.env.CORS_METHODS || "*",
    'credentials':process.env.CORS_CREDENTIALS || '*'
}

// Add the most important libaries out of the node
const express = require("express")
const mongoose = require("mongoose")

// Import middlewares
const cors = require("cors")

// Connect to the mongo db database
mongoose.connect(process.env.URL)


// Initialize the server instance
const app = express()

// adding most important middlewaresc
// 1. JSON middleware (In order to get data in json  format)
app.use(express.json())

// 2. Cors Middleware (In order to deal with other severs)
app.use(cors(CORS_PROPERTIES))


// up and running the server
app.listen(PORT,() => {
    console.log(`We are listening of port: ${PORT}`)
})






