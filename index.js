var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost', // how do I test if host, user, and pw are correct?
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

//Finished Part 1. Tried running on terminal. No response. Cursor just blinks and waits for a command. Is that what is supposed to happen at this point?

