//This code was used to work directly with the database, we executed the queries directly whithout an ORM.
/*
const mysql = require('mysql2');

//To create a pool of connections
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'Eleinco2019',
    database: 'node-complete'
});

module.exports = pool.promise();//To use promise feature instead of callbacks.
*/

//This is a review of Db chapter, I decided to review the Sql chapter and
// instead of sequelize I am going to make the queries using plain Sql.

const mysql = require('mysql2');
const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'node-complete',
    password: 'root'
});

//pool.promise() allow us to do promises.
module.exports = pool.promise();

//there are two ways to connect with the Db.
// mysql.createConnection //The developer has to handle all the connections(each query has a connection).
// mysql.createPool //You create a pool of connections(all queries)


//Working with Sequelize: http://docs.sequelizejs.com/manual/getting-started
//I don't want to work anymore with sequelize, I prefere to make the queries on my own.
/*
const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'root', {
    host: 'localhost',
    dialect:'mysql'
});

module.exports = sequelize;

*/