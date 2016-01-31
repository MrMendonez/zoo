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

var that = this;

var zoo = {
  welcome: function() {
    console.log("Welcome to the Zoo And Friends App~!");
  },
  menu: function() {
    console.log('Enter (A): ------> to Add a new animal to the Zoo! \n');
    console.log('Enter (U): ------> to Update info on an animal in the Zoo! \n');
    console.log('Enter (V): ------> to Visit the animals in the Zoo! \n');
    console.log('Enter (D): ------> to Adopt an animal from the Zoo! \n');
    console.log('Enter (Q): ------> to Quit and exit the Zoo! \n');
  },
  add: function(input_scope) {
    var currentScope = input_scope;
    console.log("To add an animal to the zoo please fill out the following form for us!");
    prompt.get(['->', 'name', 'type', 'age'], function(err, result) {
      var randCaretaker = Math.floor(Math.random() * 10) + 1;
      var new_animal = {caretaker_id: randCaretaker, name: result.name, type: result.type, age: result.age};
      var query = connection.query('INSERT INTO animals SET ?', new_animal, function(err, result) {
        if(err) {throw err}
      });
      console.log(query.sql);
      currentScope.menu();
      currentScope.promptUser();
    }) // end prompt.get
  }, // end add key
  visit: function() {
    console.log("Enter (I): ------> do you know the animal by it's id? We will visit that animal!");
    console.log("Enter (N): ------> do you know the animal by it's name? We will visit that animal!");
    console.log("Enter (A): ------> here's the count for all animals in all locations!");
    console.log("Enter (C): ------> here's the count for all animals in this one city!");
    console.log("Enter (O): ------> here's the count for all the animals in all locations by the type you specified!");
    console.log("Enter (Q): ------> Quits to the main menu!");
    // currentScope.visit();
    // currentScope.view(currentScope);
  }, // end visit key
  view: function(input_scope) {
    var currentScope = input_scope;
    console.log("What would you like to visit?");
    prompt.get(['->', 'visit'], function(err, result) {
      if(result.visit == "Q") {
        currentScope.menu();
      }
      else if(result.visit == "O") {
        currentScope.type(input_scope);
      }
      else if(result.type == "I") {
        currentScope.type(input_scope);
      }
      else if(result.animId == "N") {
        currentScope.name(input_scope);
      }
      else if(result.name == "A") {
        currentScope.all(input_scope);
      }
      else if(result.all == "C") {
        currentScope.care(input_scope);
      }
      else {
        console.log("Sorry, not sure what you meant. What would you like to do?");
        currentScope.visit();
        currentScope.view(currentScope);
      }
    }) // end prompt.get
  }, // end view key
  type: function(input_scope) {
    var currentScope = input_scope;
    console.log("Enter animal type to find how many animals we have of that type.");
    prompt.get(['->', 'animal_type'], function(err, result) {
      connection.query('SELECT COUNT(*) AS total FROM `animals` WHERE `type` = ?', [result.animal_type], function(err, results, fields) {
        if (err) throw err;
       
        console.log('Total animals of that type: ' + results[0].total);
      });
      currentScope.menu();
      currentScope.promptUser();
    }) // end prompt.get
  }, // end type key
  care: function(input_scope) {
    var currentScope = input_scope;
    console.log("New York City or San Francisco?");
    console.log("Choose a city: (NY) or (SF).");
    prompt.get(['->', 'city_name'], function(err, result) {
      connection.query('SELECT COUNT(*) AS total FROM animals, caretakers WHERE animals.caretaker_id = caretakers.id AND caretakers.city = ?', [result.city_name], function(err, results, fields) {
        if (err) throw err;
       
        console.log('Total animals in that location: ' + results[0].total);
      });
      currentScope.visit();
      currentScope.view(currentScope);
    }) // end prompt.get
  }, // end care key
  animId: function(input_scope) {
    var currentScope = input_scope;
    console.log("Enter ID of the animal you want to visit.");
    prompt.get(['->', 'animal_id'], function(err, result) {
      connection.query('SELECT * FROM animals WHERE id = ?', [result.animal_id], function(err, results, fields) {
        if (err) throw err;
        else {
          console.log('Animal ID: ' + results[0].id);
        console.log('Caretaker ID: ' + results[0].caretaker_id);
        console.log('Name: ' + results[0].name);
        console.log('Animal Type: ' + results[0].type);
        console.log('Age: ' + results[0].age);
        }
      });
      currentScope.visit();
      currentScope.view(currentScope);
    }) // end prompt.get
  }, // end animId key
  name: function(input_scope) {
    var currentScope = input_scope;
    console.log("Enter name of the animal you want to visit.");
    prompt.get(['->', 'animal_name'], function(err, result) { // is 'animal_name' the correct string here?
      connection.query('SELECT * FROM animals WHERE name = ?', [result.animal_name], function(err, results, fields) {
        if (err) throw err;
        else {
          console.log('Animal ID: ' + results[0].id);
          console.log('Caretaker ID: ' + results[0].caretaker_id);
          console.log('Name: ' + results[0].name);
          console.log('Animal Type: ' + results[0].type);
          console.log('Age: ' + results[0].age);
        }
      });
      currentScope.visit();
      currentScope.view(currentScope);
    }) // end prompt.get
  }, // end name key
  all: function(input_scope) {
    connection.query('SELECT COUNT(*) AS total FROM animals', function(err, results, fields) {
      if (err) throw err;
      else {
        console.log('Total number of animals: ' + JSON.stringify(results[0].total));
      }
    });
  }, // end all key
  preUpdate: function(input_scope) {
    var currentScope = input_scope;
    console.log('Update by ID or name?');
    var userChoice;
    prompt.get(['IdOrName'], function(err, result) {
      userChoice = result.IdOrName;
      currentScope.update(currentScope, userChoice);
    });
  }, // end preUpdate key
  update: function(input_scope) {
    var currentScope = input_scope;
    prompt.get(['--->','id','new_name','new_age','new_type','new_caretaker_id'], function(err, result) {
      var update_animal = {name: result.new_name, age: result.new_age, type: result.new_type, caretaker_id: result.new_caretaker_id};
      var query = connection.query('UPDATE animals SET ? WHERE name = ?', [update_animal, result.old_name], function(err, results) {
        if (err) throw err;
      }); //update that particular animal with the input the user provided
      console.log(query.sql);
      currentScope.menu();
      currentScope.promptUser();
    }) // end prompt.get
  }, // end update key
  adopt: function(input_scope) {
    var currentScope = input_scope;
    prompt.get(['->', 'animal_id'], function(err, result) {
      connection.query('DELETE FROM animals WHERE id = ?', result.animal_id, function(err, results, fields) {
        if (err) throw err;
      }); //update that particular animal with the input the user provided
      currentScope.menu();
      currentScope.promptUser();
    }); // end prompt. get
  }, // end adopt key
  promptUser: function() {
    var self = this;
    prompt.get('input', function(err, result) {
      if(result.input == "Q") {
        self.exit();
      }
      else if(result.input == "A") {
        self.add(self);
      }
      else if(result.input == "V") {
        self.visit();
        self.view(self); // does this function belong here or is it supposed to be in its own else if statement? HW directions are unclear.
      }
      // instructions are incomplete. Not sure what to do with self.view(self)
      else if(result.input == "D") {
        self.adopt(self);
      }
      else if (result.input == 'U') {
        self.preUpdate(self);
      }
      else {
        console.log("Sorry, not sure what you meant. What would you like to do?");
      }
    }) // end prompt.get
  }, //end promptUser key
  exit: function() {
    console.log("Thank you for visiting us, good bye~!");
    process.exit();
  }, // end exit key
  open: function() {
    this.welcome();
    this.menu();
    this.promptUser();
  } // end open key
};

zoo.open();