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
  // Your username
  user: "root",
  // Your password
  password: "",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  // run the start function after the connection is made to prompt the user
  start();
});

// prompt the user if they would like to do one of the following:

function start(){
	inquirer.prompt([{
		name: "action",
		type: "list",
		message: "What would you like to do next?",
		choices: ["View products for sale", "View items with low inventory", "Add inventory to any product", "Add a new product"]
	}]).then(function(answers){

		switch(answers.action){

			case "View products for sale":
				display();
				break;

			case "View items with low inventory":
				lowInventory();
				break;

			case "Add inventory to any product":
				addInventory();
				break;

			case "Add a new product":
				addProduct();
				break;
		}
	});
};//end of start function

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
        start();
    });
};

//if case view low inventory, show those with inventory less than 5

function lowInventory() {

	connection.query('SELECT * FROM products', function(error, response) {
		if (error) throw err;

        var theDisplayTable = new Table({
            head: ['item_id', 'product_name', 'department_name', 'price', 'stock_quantity'],
            colWidths: [10, 30, 18, 10, 14]
        });
        for (i = 0; i < response.length; i++) {
        	if(response[i].stock_quantity <= 5){
	            theDisplayTable.push(
	                [response[i].item_id, response[i].product_name, response[i].department_name, response[i].price, response[i].stock_quantity]
	            );
	        }
        }
        console.log(theDisplayTable.toString());
        start();
	});
}//end of low inventory

//if case add to inventory, display a prompt that allows user to add to inventory of any product

function addInventory() {
  
    connection.query('SELECT * FROM products', function(error, response) {
        if (error) throw err;
      
        var theDisplayTable = new Table({
            head: ['item_id', 'product_name', 'stock_quantity'],
            colWidths: [10, 30, 14]
        });
        for (i = 0; i < response.length; i++) {
            theDisplayTable.push(
                [response[i].item_id, response[i].product_name, response[i].stock_quantity]
            );
        }
        console.log(theDisplayTable.toString());

          var itemArray = [];
		  //pushes each item into an itemArray
		  for(var i=0; i<response.length; i++){
		    itemArray.push(response[i].product_name);
		  }
    

	    inquirer.prompt([{
	    	type: "list",
	    	name: "product",
	    	choices: itemArray,
	    	message: "What is the item_id that you would like to add inventory to?"
	    },{
	    	type:"input",
	    	name: "qty",
	    	message: "How much would you like to add?",
		    validate: function(value){
		      if(isNaN(value) === false){return true;}
		      else{return false;}
	    	}
		}]).then(function(ans){
			var currentQty;
			for (var i=0; i<response.length; i++){
		        if(response[i].product_name === ans.product){
		          currentQty = response[i].stock_quantity;
				}
			}

	      connection.query('UPDATE products SET ? WHERE ?', [
	        {stock_quantity: currentQty + parseInt(ans.qty)},
	        {product_name: ans.product}
	        ], function(err, response){
	          if(err) throw err;
	          console.log('The quantity was updated.');
	          start();
	        });
	      })
	});
};


function addProduct(){

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

	  inquirer.prompt([{
	  	type: "input",
	    name: "id",
	    message: "Item ID: ",
	    validate: function(value){
	      if(value){return true;}
	      else{return false;}
	    }
	  }, {
	    type: "input",
	    name: "product",
	    message: "Product Name: ",
	    validate: function(value){
	      if(value){return true;}
	      else{return false;}
	    }
	  }, {
	    type: "input",
	    name: "department",
	    message: "Department: ",
	  }, {
	    type: "input",
	    name: "price",
	    message: "Price: ",
	    validate: function(value){
	      if(isNaN(value) === false){return true;}
	      else{return false;}
	    }
	  }, {
	    type: "input",
	    name: "quantity",
	    message: "Quantity: ",
	    validate: function(value){
	      if(isNaN(value) == false){return true;}
	      else{return false;}
	    }
	  }]).then(function(ans){
	    connection.query('INSERT INTO products SET ?',{
	      item_id: ans.id,
	      product_name: ans.product,
	      department_name: ans.department,
	      price: ans.price,
	      stock_quantity: ans.quantity
	    }, function(err, res){
	      if(err) throw err;
	      console.log('Another item was added to the store.');
	    })
	    start();
	  });
	});
};
//if manager selects add a new product, it should allow  them to add a completely new product
