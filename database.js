
const mysql = require('mysql2');

//DB configurations
 const con = mysql.createConnection({
    host:'localhost',
    user:'root',
    password:'password',
    database:'thinkadamdb'
});

con.connect((err)=>{
    if(err){
    console.log(err)
    }else{
        console.log("Database connected...")
    }
})

async function testings(){
    const res = await con.query('SELECT id_type FROM thinkadamdb.allrequests WHERE id=1');
    if(res.length > 0) return res.id_type;
    console.log(res);
}



/*
const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    password:'password',
    database:'thinkadamdb'

})
   async function testQuery(){
    const res = await pool.query('SELECT id_type FROM thinkadamdb.allrequests WHERE id=1');
    if(res.length > 0) return res.id_type;
   }
const getPackage = async (id)=>{
    const con = await createConnection();
    const[rows] =await con.execute('SELECT id_type FROM thinkadamdb.allrequests WHERE id=?',[id]);
    if(rows.length > 0) return rows.id_type;
    return false;
}

module.exports = {
    testings

}
*/
