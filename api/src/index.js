const express = require('express');
const app = express();
const port = 3000;

var mysql = require('mysql');
var pool  = mysql.createPool({
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASS,
  database        : process.env.DB_NAME
});

app.use((req, res, next)=> {
  pool.getConnection(function(err, connection) {
    if (err) throw err; // not connected!
    // Use the connection
    connection.query('SELECT * FROM users', function (error, results, fields) {
      // When done with the connection, release it.
      connection.release();
   
      // Handle error after the release.
      if (error) throw error;
   
      // Don't use the connection here, it has been returned to the pool.
      console.log(results);
      next();
    });
  });
});

app.get('/', (req, res) => res.send('Helo World!'));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));