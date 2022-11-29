const mysql = require('mysql2');

//DB configurations
const createCon = async () => {
const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'thinkadamdb'
});
//DB connection
        con.connect(function(err){
            if(err){
                throw err;
            }
            console.log("Database connected...")

        })
    
    }
    const queryCon = async () => {
            con.query('SELECT id_type FROM thinkadamdb.allrequests',function(err,result, fields){
                if(err){
                    throw err;
                }
            result.forEach(types => {
                console.log(types.id_type);
            })

            })
        }
module.exports = {
    createCon: createCon,
    queryCon: queryCon
}


