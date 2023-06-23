const Sequelize=require("sequelize");

const sequelize=require("../util/database");

const User=sequelize.define(
   "User", {
        id:{
            type:Sequelize.INTEGER,
            autoIncreament:true,
            allowNull:false,
            primaryKey:true
        },
        name: Sequelize.STRING,
        emailId : Sequelize.STRING
    }
);


module.exports=User;

module.exports=User;