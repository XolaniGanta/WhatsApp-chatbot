
const mysql = require('mysql2/promise');

const createConnection = async () => {
    return await mysql.createConnection({
        host:'localhost',
        user:'root',
        password:'password',
        database:'thinkadamdb'
    });
    
} 
const getPackage = async (id)=>{
    const con = await createConnection();
    const[rows] =await con.execute('SELECT id_type FROM thinkadamdb.allrequests WHERE id=?',[id]);
    if(rows.length > 0) return rows.id_type;
    return false;
}
module.exports = {
    createConnection,
    getPackage
}