const mysql = require('mysql2/promise');


const createConnection = async () => {
 return await mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'password',
  database:'thinkadamdb'
});
}

const getPackages =  async(id) => {
    const connection = await createConnection();
    const [fd] = await connection.execute('SELECT id_type FROM thinkadamdb.allrequests WHERE id=?',[id]);
    if(fd.length > 0) return fd[0].id_type;
    console.log(fd)
    return false;
}
getPackages()

