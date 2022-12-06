const {Sequelize, DataTypes} = require("sequelize");
//const Sequelize = require("sequelize");
const mysql = require('mysql2/promise');


const sequelize = new Sequelize(
 'thinkadamdb',
 'root',
 'password',
  {
    host: 'localhost',
    dialect: 'mysql'
  }
);
async function uwhatDB(){
  try{
    await sequelize.authenticate();
    const allrequests = sequelize.define(
      "allrequests",{
        id_type: DataTypes.TEXT
      },
      {
        createdAt: false,
        updatedAt: false
      }
    );

    allrequests.findOne({
      where:{
            id_type: "SerialNumber"
      },
      limit: 100,
    }).then(res => {
      console.log(res)
    }).catch((error) => {
      console.error('fail to retrieve',error)
    })
  }
  catch(error){
    console.log(error)
  }
}
uwhatDB();

