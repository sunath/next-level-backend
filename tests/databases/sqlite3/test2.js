

const sqlite = require("sqlite3").verbose()


const db = new sqlite.Database("./test.db",function(error){
    console.log(error)
})


db.run(`CREATE TABLE "users" (name TEXT)`)


db.close(function(error){
    console.log(error)
})