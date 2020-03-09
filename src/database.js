const mysql = require('mysql');
const { promisify } = require('util');
const { database } = require('./keys');

const pool = mysql.createPool(database);

pool.getConnection((error, connection)=>{
	if(error){
		if(error.console === 'PROTOCOL_CONNECTION_LOST')
			console.error("DATABASE CONNECTION WAS CLOSED.");
		if(error.console === 'ER_CON_COUNT_ERROR')
			console.error("DATABASE HAS TO MANY CONECTIONS.");
		if(error.console === 'ECONNREFUSED')
			console.error("DATABASE CONNECTION WAS REFUSED.");
		console.error(error.code);
	}
	if(connection){
		connection.release();
		console.log("DB conected.");
	}
	return;
});
//PROMISIFIED POOL QUERYS
pool.query = promisify(pool.query);
module.exports = pool;