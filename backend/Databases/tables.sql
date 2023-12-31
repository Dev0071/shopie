CREATE DATABASE DBNAMEHEERE

USE DBNAMEHEERE

CREATE TYPE ProductCategoryType FROM NVARCHAR(50);

CREATE TABLE ProductCategory (
    CategoryID INT IDENTITY(1,1) PRIMARY KEY,
    CategoryName ProductCategoryType NOT NULL
);

INSERT INTO ProductCategory (CategoryName) VALUES ('Electronics');
INSERT INTO ProductCategory (CategoryName) VALUES ('Cosmetics');
INSERT INTO ProductCategory (CategoryName) VALUES ('Clothes');
INSERT INTO ProductCategory (CategoryName) VALUES ('Furniture');
INSERT INTO ProductCategory (CategoryName) VALUES ('Books');

select * from ProductCategory

CREATE TABLE Product (
    product_id VARCHAR(255) PRIMARY KEY,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    added_at DATETIME DEFAULT GETDATE(),
    price DECIMAL(10, 2),
    product_quantity INT,
    product_image VARCHAR(255),
    product_category ProductCategoryType
);


CREATE TABLE [User] (
    user_id VARCHAR(255) PRIMARY KEY,
    u_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);
alter table [User] add  is_admin BIT default 0

CREATE TABLE AnonymousCart (
    cart_id INT PRIMARY KEY IDENTITY,
    product_id VARCHAR(255) NOT NULL,
    session_id VARCHAR(255) NOT NULL,
    quantity INT,
	added_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (product_id) REFERENCES Product (product_id)
);

CREATE TABLE UserCart (
    cart_id INT PRIMARY KEY IDENTITY,
    user_id VARCHAR(255) NOT NULL,
    product_id VARCHAR(255) NOT NULL,
    quantity INT,
	added_at DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (user_id) REFERENCES [User] (user_id),
    FOREIGN KEY (product_id) REFERENCES Product (product_id)

);




select * from UserCart
select * from Product
select * from AnonymousCart
select * from [User]



CREATE TABLE ResetToken (
  id INT PRIMARY KEY IDENTITY(1,1),
  user_id VARCHAR(255),
  token VARCHAR(255) NOT NULL,
  expiry DATETIME NOT NULL,
  FOREIGN KEY (user_id) REFERENCES [User]
);

