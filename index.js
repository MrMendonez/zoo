var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'zoo_db'
});
var prompt = require('prompt');
prompt.start();

connection.connect(function(err) {
  if (err) {
      console.error('error connecting: ' + err.stack);
      return;
  };
  //console.log('connected as id ' + connection.threadId);
});

prompt.message = "";

//Finished Part 1. Tried running on terminal. No response. It just hangs as if it is trying to do something.