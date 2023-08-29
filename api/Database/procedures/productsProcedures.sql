USE shopie_ecommerce;
GO

-- procedures to get all products
CREATE OR ALTER PROCEDURE get_all_products
AS
BEGIN
    SELECT * FROM product;
END;
GO

-- procedures to get all products by category
CREATE OR ALTER PROCEDURE get_all_products_by_category
    @category_name VARCHAR(255)
AS
BEGIN
    SELECT * FROM product WHERE product_category_id = @category_name;
END;
GO

-- procedures to get all products by id
CREATE OR ALTER PROCEDURE get_all_products_by_id
    @product_id VARCHAR(255)
AS
BEGIN
    SELECT * FROM product WHERE id = @product_id;
END;
GO

-- procedures to get all products by name
CREATE OR ALTER PROCEDURE get_all_products_by_name
    @product_name VARCHAR(255)
AS
BEGIN
    SELECT * FROM product WHERE product_name = @product_name;
END;
GO

-- add product
CREATE OR ALTER PROCEDURE add_product
    @product_name VARCHAR(255),
    @product_description VARCHAR(255),
    @product_category_id VARCHAR(255),
    @product_initial_price INT,
    @product_price INT,
    @product_image VARCHAR(255),
    @product_stock INT
AS
BEGIN
    INSERT INTO product (product_name, product_description, product_category_id, product_initial_price, product_price, product_image, product_stock)
    VALUES (@product_name, @product_description, @product_category_id, @product_initial_price, @product_price, @product_image, @product_stock);
END;
GO

-- update product
CREATE OR ALTER PROCEDURE update_product
    @product_id VARCHAR(255),
    @product_name VARCHAR(255),
    @product_description VARCHAR(255),
    @product_category_id VARCHAR(255),
    @product_initial_price INT,
    @product_price INT,
    @product_image VARCHAR(255),
    @product_stock INT
AS
BEGIN
    UPDATE product
    SET product_name = @product_name, product_description = @product_description, product_category_id = @product_category_id, product_initial_price = @product_initial_price, product_price = @product_price, product_image = @product_image, product_stock = @product_stock
    WHERE id = @product_id;
END;
GO  

-- delete product
CREATE OR ALTER PROCEDURE delete_product
    @product_id VARCHAR(255)
AS
BEGIN
    DELETE FROM product WHERE id = @product_id;
END;
GO

-- add product to cart
CREATE OR ALTER PROCEDURE add_product_to_cart
    @cart_id VARCHAR(255),
    @product_id VARCHAR(255),
    @product_quantity INT
AS
BEGIN
    INSERT INTO cart_item (cart_id, product_id, product_quantity)
    VALUES (@cart_id, @product_id, @product_quantity);
END;