const mySql = require("../../../databases/mysql")
const {DataClass,validators} = require("../../../dataclasses")


class Comment extends DataClass{
    getName(){return "comments"}
    text = mySql.createField(mySql.types.VARCHAR,true,true,[],null,null,{max:200})
}


async function runner(){
    const con = new mySql.MySqlDatabase()
    await con.connect('nodejs','lol44lol','HelloWorld12345','localhost')
    // await con.createTable(Comment)
    // await con.updateById(Comment,'8e27ca6e-5a38-4425-9bae-200d4a1dc8f6',{text:"this not a comment.Why are you reading this,"})
    // const response = await con.createObject(Comment,{text:"This is nocxcxcxdefd js.Not python.fdhello world this is cool bro.this is not gonna be a waste of time."})
    // console.log(response)
    // await con.deleteByID(Comment,'8e27ca6e-5a38-4425-9bae-200d4a1dc8f6')
}

runner().then(e => console.log(e)).catch(e => console.error(e)).finally(e => process.exit(0))