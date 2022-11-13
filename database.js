const { application } = require("express");
const express = require("express");
const mysql = require("mysql2");
const app = require(express)

const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'blc'
})

con.connect((err)=>{
    if(err){
        console.log(err)
    }else{
        console.log("")
    }
})

let getPackages = (req,res) => {
    con.query('SELECT response_body FROM blc.operations WHERE id=1',(err,result) =>{
        if(err){
            console.log(err)
        }else{
            console.log(result)
        }
    })
}

module.exports ={
    getPackages: getPackages
}
