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