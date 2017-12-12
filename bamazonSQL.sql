-- original sequel that was used to create database. I ultimately ended up querying this within sequel workbench to create the initial database.

CREATE DATABASE bamazon;

use bamazon;

CREATE TABLE products(
	item_id INTEGER NOT NULL,
    product_name VARCHAR(255) NULL,
    department_name VARCHAR(255) NULL,
    price MONEY NULL,
    stock_quantity INTEGER NULL,
    PRIMARY KEY (item_id)

);

INSERT INTO products(item_id, product_name, department_name, price, stock_quantity) 
VALUES 
(1, "Lamp", "Home Goods", 10.58, 8), 
(2, "Golf Club", "Sporting Goods", 249.99, 5),
(3, "Cashmere Sweater", "Clothing", 84.99, 15),
(4, "Winter Scarf", "Clothing", 25.00, 40),
(5, "Macbook Pro", "Electronics", 999.99, 25),
(6, "Yeti Mug", "Kitchen", 25, 80),
(7, "Nike Air Max", "Clothing", 99.95, 30),
(8, "Mascara", "Beauty", 7.00, 55),
(9, "55 inch Vizio TV", "Electronics", 249.99, 10),
(10, "2005 Ford Focus", "Auto", 13600.00, 1);

