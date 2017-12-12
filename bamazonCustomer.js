//require inquirer
var inquirer = require ("inquirer");

//require mysql
var mysql = require("mysql");

//require client table npm package
var Table = require("cli-table");

//creating the connection to mysql

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // username
  user: "root",

  // password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  display();
});

// function that displays all of the items for sale in the command line

function display() {
  
    connection.query('SELECT * FROM products', function(error, response) {
        if (error) throw err;
      
        var theDisplayTable = new Table({
            head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 30, 18, 10, 14]
        });
        for (i = 0; i < response.length; i++) {
            theDisplayTable.push(
                [response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
            );
        }
        console.log(theDisplayTable.toString());
        inquireForPurchase();
    });
};//end display function


//prompt the user for the id of the product they would like to buy

function inquireForPurchase() {
    inquirer.prompt([

        {
            name: "ID",
            type: "input",
            message: "What is the id of the item you would like to purchase?"
        }, {
            name: 'Quantity',
            type: 'input',
            message: "How many of this item would you like to buy?"
        },

    ]).then(function(answers) {
        var quantityDesired = answers.Quantity;
        var IDDesired = answers.ID;
        purchaseFromDatabase(IDDesired, quantityDesired);
    });

}; //end inquireForPurchase function

function purchaseFromDatabase(ID, quantityNeeded) {
    connection.query('SELECT * FROM products WHERE item_id = ' + ID, function(error, response) {
        if (error) { console.log(error) };

        //if in stock
        if (quantityNeeded <= response[0].stock_quantity) {
            //calculate cost
            var totalCost = response[0].price * quantityNeeded;
            //inform user
            console.log("We have what you need! I'll have your order right out!");
            console.log("Your total cost for " + quantityNeeded + " " + response[0].product_name + " is $" + totalCost + ". We will spend your money wiser than you have!");
            //update database, minus purchased quantity
            connection.query('UPDATE products SET stock_quantity = stock_quantity - ' + quantityNeeded + ' WHERE item_id = ' + ID);
        } else {
            console.log("Sorry!. We don't have enough " + response[0].product_name + " to fulfill your order. Better check out the real Amazon!");
        };
        display();
    });

}; //end purchaseFromDatabase function

