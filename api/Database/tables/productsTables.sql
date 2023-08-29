USE  shopie_ecommerce;

-- product_category
DROP TABLE IF EXISTS product_category;

BEGIN TRY
    CREATE TABLE product_category (
        id VARCHAR(255) PRIMARY KEY,
        category_name VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        )
END TRY
BEGIN CATCH
    SELECT ERROR_MESSAGE() AS ErrorMessage;
END CATCH;

DROP TABLE IF EXISTS product;

BEGIN TRY
    CREATE TABLE product (
        id VARCHAR(255) PRIMARY KEY,
        product_name VARCHAR(255) NOT NULL,
        product_description VARCHAR(255) NOT NULL,
        product_category_id VARCHAR(255) NOT NULL,
        product_initial_price INT NOT NULL,
        product_price INT NOT NULL,
        product_image VARCHAR(255) NOT NULL,
        product_stock INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (product_category_id) REFERENCES product_category(id)
        )
END TRY
BEGIN CATCH
    SELECT ERROR_MESSAGE() AS ErrorMessage;
END CATCH;

DROP TABLE IF EXISTS cart;

BEGIN TRY
    CREATE TABLE cart (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
        )
END TRY
BEGIN CATCH
    SELECT ERROR_MESSAGE() AS ErrorMessage;
END CATCH;

DROP TABLE IF EXISTS cart_item;

BEGIN TRY
    CREATE TABLE cart_item (
        id VARCHAR(255) PRIMARY KEY,
        cart_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        product_quantity INT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (cart_id) REFERENCES cart(id),
        FOREIGN KEY (product_id) REFERENCES product(id)
        )
END TRY
BEGIN CATCH
    SELECT ERROR_MESSAGE() AS ErrorMessage;
END CATCH;


DROP DATABASE IF EXISTS customer_address;

BEGIN TRY
    CREATE TABLE customer_address (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        address VARCHAR(255) NOT NULL,
        city VARCHAR(255) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
        )
END TRY
BEGIN CATCH
    SELECT ERROR_MESSAGE() AS ErrorMessage;
END CATCH;

DROP TABLE IF EXISTS orders;
BEGIN TRY
    CREATE TABLE orders (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        order_status VARCHAR(255) NOT NULL,
        order_total_price INT NOT NULL,
        address VARCHAR(255) NOT NULL,
        is_completed BIT DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
        )
END TRY
BEGIN CATCH
    SELECT ERROR_MESSAGE() AS ErrorMessage;
END CATCH;




