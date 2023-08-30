const {Router} = require('express');
const { 
    getAllProducts, getProductById, createNewCategory, 
    getAllCategories, createNewProduct, updateProduct, 
    deleteProduct, 
    add_to_cart,
    getCategoryById,
    getCartItems,
    removeItemFromCart} = require('../Controllers/productsController');

const { forgotPassword, verifytoken, resetPassword} = require('../Controllers/forgotpwd.controller');
const productRouter = Router();
const { verifyToken } = require('../Middleware/verifyToken');
const { customeregister, login, adminregister } = require('../Controllers/Auth.controller');

//Authentication
productRouter.post('/register', customeregister);
productRouter.post('/login', login);
productRouter.post('/adminregister', adminregister);
productRouter.post('/forgot-password', forgotPassword);
productRouter.post('/reset-password', resetPassword);
productRouter.post('/verify-token', verifytoken);
productRouter.post('/verifyToken', verifyToken, verifyToken);

// products
productRouter.get('/', getAllProducts);
productRouter.post('/', verifyToken, createNewProduct);
productRouter.get('/:id', getProductById);
productRouter.put('/:id',verifyToken, updateProduct);
productRouter.delete('/:id', verifyToken, deleteProduct);
productRouter.get('/search/:name', getAllProducts);

// categories
productRouter.post('/category', verifyToken, createNewCategory)
productRouter.get('/category/all', getAllCategories)
productRouter.get('/category/:id', getCategoryById);

productRouter.post('/item/add-to-cart/:id', verifyToken, add_to_cart)
productRouter.delete('/item/remove-from-cart/:id', verifyToken, removeItemFromCart)
productRouter.get('/item/get-cart-items', verifyToken, getCartItems)

module.exports = {
    productRouter
}