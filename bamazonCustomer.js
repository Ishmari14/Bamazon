var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    port: 3306,

    user: "root",

    password: "komatsuyun19",

    database: "bamazon_db"
});

var prompts = {
    productsIDPrompt: {
        type: "input",
        name: "productID",
        message: "Please enter the product ID of the product you want to buy: "
    },

    numberofUnitsPrompt: {
        type: "input",
        name: "numberofUnits",
        message: "Please enter the number of the units you want to buy: "
    }
}



var productsDisplay = function () {
    console.log("=================================================");
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;

        results.forEach(function (element) {
            console.log('Product ID: ' + element.item_id + '\nName: ' + element.product_name + '\nPrice($): ' + element.price + '\n');
        });

        productBuy();

    });
}

var productBuy = function () {
    console.log("=================================================");
    inquirer.prompt([prompts.productsIDPrompt, prompts.numberofUnitsPrompt])
        .then(function (answers) {
            let query = "SELECT item_id, stock_quantity, price FROM products WHERE ?";
            connection.query(query, {
                item_id: answers.productID
            }, function (error, results) {
                if (results.length === 0) {
                    console.log("=================================================");
                    console.log("\nProduct ID not found\n");
                    productBuy();
                } else if (results.length > 0) {
                    if (answers.numberofUnits <= results[0].stock_quantity) {
                        let costTotal = answers.numberofUnits * results[0].price;
                        let updateStockQuantity = results[0].stock_quantity - answers.numberofUnits;

                        let query = connection.query(
                            "UPDATE products SET? WHERE ?", [{
                                stock_quantity: updateStockQuantity
                            },
                            {
                                item_id: answers.productID
                            }],
                            function (error, results) {
                                console.log("=================================================");
                                console.log('\nSuccess!!!');
                                console.log('The total cost of your purchase is: $' + costTotal);
                                connection.end();
                            }
                        );
                    } else if (answers.numberofUnits > results[0].stock_quantity) {
                        console.log("=================================================");
                        console.log('\nInsufficient stock!');
                        console.log('Only' + results[0].stock_quantity + 'units available.');
                        console.log('Please try again!\n');
                        productBuy();
                    }
                }
            })
        })
}

productsDisplay();

