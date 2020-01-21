var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",

    password: "komatsuyun19",
    database: "bamazon_db"

});

var prompt = {
    managerOptions: {
        type: "list",
        name: "managerOptions",
        message: "Option Selection: ",
        choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"],
    },

    productIDProm: {
        type: "input",
        name: "productID",
        message: "Please enter the product ID of the product you want to stock: "
    },

    productNameProm: {
        type: "input",
        name: "productName",
        message: "Please enter the name the product you want to add to stock: "
    },

    departmentNameProm: {
        type: "input",
        name: "departmentName",
        message: "Please enter the product's department name: "
    },

    productPriceProm: {
        type: "input",
        name: "productPrice",
        message: "Please enter the product's price: "

    },

    numberOfUnitsProm: {
        type: "input",
        name: "numberofUnits",
        message: "Please enter the number of units you want to add to stock: "
    }

};

connection.connect(function (err) {
    if (err) throw err;
    selectOptions();
});

var selectOptions = function () {
    console.log('===========================================================');
    inquirer.prompt(prompt.managerOptions)
        .then(function (answers) {
            switch (answers.managerOptions) {
                case "View Products for Sale":
                    viewProduct();
                    break;

                case "View Low Inventory":
                    viewLowInven();
                    break;

                case "Add to Inventory":
                    addtoInven();
                    break;

                case "Add New Product":
                    addNewInven();
                    break;

                case "Exit":
                    exitProgram();
                    break;
            }
        });
};

var viewProduct = function () {
    console.log('=======================================================');
    console.log("\nSelecting all products...\n");
    connection.query("SELECT * FROM products", function (error, results) {
        if (error) throw error;

        results.forEach(function (element) {
            console.log('Product ID: ' + element.item_id + '\nName: ' + element.product_name + '\nPrice: $' + parseFloat(Math.round(element.price * 100) / 100).toFixed(2) + '\nQuantity: ' + element.stock_quantity + '\n');
        });

        selectOptions();
    });
};

var viewLowInven = function () {
    console.log('=======================================================');
    console.log("\nSearching for low inventory products...\n");
    var query = "SELECT * FROM products HAVING stock_quantity <= 5 ORDER By item_id";

    connection.query(query, function (error, results) {
        if (error) {
            console.log(error)
        }
        if (results.length === 0) {
            console.log("No low inventory products.");
            selectOptions();
        }

        else if (results.length > 0) {
            results.forEach(function (element) {
                console.log('Product ID: ' + element.item_id + '\nName: ' + element.product_name + '\nQuantity: ' + element.stock_quantity + '\n');
            });

            selectOptions();
        }
    });
};

var addtoInven = function () {
    console.log('============================================================');
    inquirer.prompt([prompt.productIDProm, prompt.numberOfUnitsProm])
        .then(function (answers) {
            console.log('===========================================================');
            console.log('\nUpdating stock quantities...\n');
            var query = "SELECT item_id, product_name, stock_quantity FROM products WHERE ?";
            connection.query(query, {
                item_id: answers.productID
            },
                function (error, results) {
                    if (results.length === 0) {
                        console.log("Product ID not found\n");
                        selectOptions();

                    }

                    else if (results.length > 0) {
                        var updatedStockQuantity = parseInt(answers.numberofUnits) + results[0].stock_quantity;
                        var productName = results[0].product_name;

                        var query = "UPDATE products SET ? WHERE ?";
                        connection.query(query, [{
                            stock_quantity: updatedStockQuantity
                        },
                        {
                            item_id: answers.productID
                        }],
                            function (error, results) {
                                console.log('Success!');
                                console.log('Updated "' + productName + '" quantity to ' + updatedStockQuantity + '\n');
                                selectOptions();
                            });
                    }
                });
        });
};

var addNewInven = function () {
    console.log('======================================================');
    inquirer.prompt([prompt.productNameProm, prompt.departmentNameProm, prompt.productPriceProm, prompt.numberOfUnitsProm])
        .then(function (answers) {
            var query = "SELECT * FROM products WHERE ?";
            connection.query(query, {
                product_name: answers.productName

            },
                function (error, results) {
                    if (results.length > 0) {
                        console.log('======================================================');
                        console.log("\nProduct already exists in Inventory\n");
                        selectOptions();
                    }

                    else if (results.length === 0) {
                        console.log('======================================================');
                        console.log("\nInserting a new product....\n");
                        var query = "INSERT INTO products SET ?";
                        connection.query(query, {
                            product_name: answers.productName,
                            department_name: answers.departmentName,
                            price: answers.numberofUnits
                        },
                            function (error, results) {
                                console.log('Success!!!');
                                console.log('"' + answers.productName + '" added to inventory\n')
                                selectOptions();
                            });
                    }
                });
        });
};

var exitProgram = function () {
    console.log('======================================================');
    console.log('\nSee you next time!!!');
    connection.end();
};
