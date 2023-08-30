const {v4} = require('uuid');
const { mssql, sqlConfig } = require('../Config/Config');

const createNewCategory = async (req, res) => {
    try {
        const { category_name } = req.body

        // validating all required fields are filled
        if (!category_name) {
            return res.status(400).json({
                error: 'Please provide name of category'
            })
        }

        const pool = await mssql.connect(sqlConfig)

        // checking if category already exists
        const categoryExists = await pool.request()
                .input('category_name', mssql.VarChar, category_name)
                .execute('get_category_by_name')

        if (categoryExists.recordset[0]) {
            return res.status(400).json({
                error: 'Category already exists'
            })
        }

        const category = await pool.request()
                .input('id', mssql.VarChar, v4())
                .input('category_name', mssql.VarChar, category_name)
                .execute('create_category')

        res.status(200).json({
            message: 'Category created successfully'
        })

    } catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getAllCategories = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig)
        const categories = await pool.request()
                .execute('get_all_categories')

        res.status(200).json({
            categories: categories.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params
        const pool = await mssql.connect(sqlConfig)
        const category = await pool.request()
                .input('category_id', mssql.VarChar, id)
                .execute('get_category_by_id')

        // if category is not found
        if (!category.recordset[0]) {
            return res.status(404).json({
                error: 'Category not found'
            })
        }

        res.status(200).json({
            category: category.recordset[0]
        })

    }
        catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
}

const getAllProducts = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig)
        const products = await pool.request()
                .execute('get_all_products')

        res.status(200).json({
            products: products.recordset
        })

        // if no products are found
        if (!products.recordset[0]) {
            return res.status(404).json({
                error: 'No products found'
            })
        }
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const getProductById = async (req, res) => {
    try {
        const { id } = req.params
        const pool = await mssql.connect(sqlConfig)
        const product = await pool.request()
                .input('product_id', mssql.VarChar, id)
                .execute('get_product_by_id')

        // if product is not found
        if (!product.recordset[0]) {
            return res.status(404).json({
                error: 'Product not found'
            })
        }

        res.status(200).json({
            product: product.recordset[0]
        })

    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const createNewProduct = async (req, res) => {
    try {
        const { 
            product_name, product_description,
            product_category_id, product_initial_price,
            product_price, product_image, product_stock
         } = req.body

         // validating all required fields are filled
        if (!product_name || !product_description || !product_category_id || !product_price || !product_image || !product_stock) {
            return res.status(400).json({
                error: 'Please provide all required fields'
            })
        }

        const pool = await mssql.connect(sqlConfig)
        const product = await pool.request()
                .input('id', mssql.VarChar, v4())
                .input('product_name', mssql.VarChar, product_name)
                .input('product_description', mssql.VarChar, product_description)
                .input('product_category_id', mssql.VarChar, product_category_id)
                .input('product_initial_price', mssql.Int, product_initial_price)
                .input('product_price', mssql.Int, product_price)
                .input('product_image', mssql.VarChar, product_image)
                .input('product_stock', mssql.Int, product_stock)
                .execute('add_product')

        res.status(200).json({
            message: 'Product created successfully',
        })
    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const updateProduct = async (req, res) => {
    try {
        const { id } = req.params
        const { 
            product_name, product_description,
            product_category_id, product_initial_price,
            product_price, product_image, product_stock
         } = req.body


         // validating all required fields are filled
        if (!product_name || !product_description || !product_category_id || !product_price || !product_image || !product_stock) {
            return res.status(400).json({
                error: 'Please provide all required fields'
            })
        }

        const pool = await mssql.connect(sqlConfig)
        const product = await pool.request()
                .input('id', mssql.VarChar, id)
                .input('product_name', mssql.VarChar, product_name)
                .input('product_description', mssql.VarChar, product_description)
                .input('product_category_id', mssql.VarChar, product_category_id)
                .input('product_initial_price', mssql.Int, product_initial_price)
                .input('product_price', mssql.Int, product_price)
                .input('product_image', mssql.VarChar, product_image)
                .input('product_stock', mssql.Int, product_stock)
                .execute('update_product')


        res.status(200).json({
            message: 'Product updated successfully',
        })
    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params
        const pool = await mssql.connect(sqlConfig)

        // checking if product exists
        const productExists = await pool.request()
                .input('product_id', mssql.VarChar, id)
                .execute('get_product_by_id')

        if (!productExists.recordset[0]) {
            return res.status(404).json({
                error: 'Product not found'
            })
        }

        const product = await pool.request()
                .input('product_id', mssql.VarChar, id)
                .execute('delete_product')

        res.status(200).json({
            message: 'Product deleted successfully',
        })
    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const add_to_cart = async (req, res) => {
    try {
        const { id } = req.params

        const { 
            product_quantity
        } = req.body

        // checking if product quantity is provided
        if (!product_quantity) {
            return res.status(400).json({
                error: 'Please provide product quantity'
            })
        }

        const product_id = id

        const pool = await mssql.connect(sqlConfig)

        // getting user id from token
        const user = req.user

        // get user by email
        const userExists = await pool.request()
                .input('email', mssql.VarChar, user.email)
                .execute('fetchUserByEmailPROC')

                if (!userExists.recordset[0]) {
                    return res.status(404).json({
                        error: 'You are not logged in'
                    })
                }

        const user_id = userExists.recordset[0].id

        // checking if product exists
        const productExists = await pool.request()
                .input('product_id', mssql.VarChar, id)
                .execute('get_product_by_id')

        if (!productExists.recordset[0]) {
            return res.status(404).json({
                error: 'Product not found'
            })
        }

        const cart_id = v4()

        const cart = await pool.request()
            .input('id', mssql.VarChar, v4())
            .input('user_id', mssql.VarChar, user_id)
            .input('product_id', mssql.VarChar, product_id)
            .input('quantity', mssql.Int, product_quantity)
            .execute('add_product_to_cart')

        res.status(200).json({
            message: 'Product added to cart successfully',
        })
    }
        
        catch (error) {
            res.status(500).json({
                error: error.message
            })
        }
}

const getCartItems = async (req, res) => {
    try {
        const pool = await mssql.connect(sqlConfig)
        const cart = await pool.request()
                .execute('get_all_products_in_cart')

        res.status(200).json({
            cart: cart.recordset
        })
    }

    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

const removeItemFromCart = async (req, res) => {
    try {
        const { id } = req.params
        const pool = await mssql.connect(sqlConfig)

        // checking if product exists
        const productExists = await pool.request()
                .input('cart_id', mssql.VarChar, id)
                .execute('get_cart_items_by_cart_id')

        if (!productExists.recordset[0]) {
            return res.status(404).json({
                error: 'Product not found'
            })
        }

        const cart = await pool.request()
                .input('cart_id', mssql.VarChar, id)
                .execute('remove_product_from_cart')

        res.status(200).json({
            message: 'Product removed from cart successfully',
        })
    }
    
    catch (error) {
        res.status(500).json({
            error: error.message
        })
    }
}

module.exports = {
    getAllProducts,
    getProductById,
    createNewCategory,
    createNewProduct,
    getAllCategories,
    updateProduct,
    deleteProduct,
    add_to_cart,
    getCategoryById,
    getCartItems,
    removeItemFromCart
}