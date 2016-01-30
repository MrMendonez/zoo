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
      connection.query(); // takes the user's input and inserts it into the animal's table. Is this line coded correctly?
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
    currentScope.visit();
    currentScope.view(currentScope);
  }, // end visit key
  view: function() {
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
    console.log("Enter animal type to find how many animals we have of those type.");
    prompt.get(['->', 'animal_type'], function(err, result) {
      connection.query(); // gives a count of the animals of this type. Is this coded correctly?
      currentScope.menu();
      currentScope.promptUser();
    }) // end prompt.get
  }, // end type key
  care: function(input_scope) {
    var currentScope = input_scope;
    console.log("New York City or San Francisco?");
    console.log("Choose a city: (NY) or (SF).");
    prompt.get(['->', 'city_name'], function(err, result) {
      connection.query(); //call the function connection.query() with a string in the form of a mySQL select the number of animals that all the caretakers from the specific user inputed city. Is this coded correctly?
      currentScope.visit();
      currentScope.view(currentScope);
    }) // end prompt.get
  }, // end care key
  animId: function(input_scope) {
    var currentScope = input_scope;
    console.log("Enter ID of the animal you want to visit.");
    prompt.get(['->', 'animal_id'], function(err, result) {
      connection.query(); // gets the data for the particular animal of that id that the user typed in. Is this coded correctly?
      currentScope.visit();
      currentScope.view(currentScope);
    }) // end prompt.get
  }, // end animId key
  name: function(input_scope) {
    var currentScope = input_scope;
    console.log("Enter name of the animal you want to visit.");
    prompt.get(['->', 'animal_name'], function(err, result) { // is 'animal_name' the correct string here?
      connection.query(); // gets the data for the particular animal of that id that the user typed in. Is this coded correctly?
      currentScope.visit();
      currentScope.view(currentScope);
    }) // end prompt.get
  }, // end name key
  all: function(input_scope) {
    connection.query(); // gets total of all animals regardless of type.
  }, // end all key
  update: function(input_scope) {
    var currentScope = input_scope;
    prompt.get(['--->','id','new_name','new_age','new_type','new_caretaker_id'], function(err, result) {
      connection.query(); // updates that particular animal with the input the user provided. Is this coded correctly?
      currentScope.menu();
      currentScope.promptUser();
    }) // end prompt.get
  }, // end update key
  adopt: function(input_scope) {
    var currentScope = input_scope;
    prompt.get(['->', 'animal_id'], function(err, result) {
      connection.query(); // delete it from the animals table. Is this coded correctly?
      currentScope.visit();
      currentScope.view(currentScope);
    }) // end prompt. get
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