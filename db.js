const express = require("express");
const sql = require("mysql2");
const app = express();
const fs=require("fs");

const db = sql.createConnection({
    host:"localhost",
    user:"root",
    password:"ImGenius1818",
    database:"PbrowseDb",
    infileStreamFactory: (filePath) => {
        // MySQL sends the file path from LOAD DATA LOCAL INFILE
        return fs.createReadStream(filePath);
    }
});
db.connect(err=>{
    if(err){
        console.log("Database failed to connect, error:",err)
; return;    }
console.log("Connected to database successfully!!")
})
module.exports=db;