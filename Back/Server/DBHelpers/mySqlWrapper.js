module.exports = {
    query: query,
}


var mysql = require('mysql');
var pool  = mysql.createPool({
    connectionLimit : 10,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'youtalkyou'
});


function query(query, callback){
    pool.getConnection(function(err, connection) {
      if (err) throw err; 
      
      connection.query(query, function (error, results, fields) {
        // When done with the connection, release it.
        console.log(`query: ${query}, error: `, err, ' results:', results)
        
        // Handle error after the release.
        // if (error) throw error;
        connection.release()
        callback({
            error: error,
            results: results
        })
        // Don't use the connection here, it has been returned to the pool.
      });
    });
}