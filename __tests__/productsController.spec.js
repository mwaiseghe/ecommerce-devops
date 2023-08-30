const {v4} = require('uuid')
const mssql = require('mssql')
const { createNewCategory, createNewProduct, getAllProducts, getProductById, updateProduct } = require('../api/Controllers/productsController')
// mocking theresponse objects
const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
}

describe('createNewCategory', () => {
    test('should return 400 if no category name is provided', async () => {
        const req = {
            body: {
                category_name: ''
            }
        }
        await createNewCategory(req, res)
        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Please provide name of category'
        })
    })

    test('should return 400 if category already exists', async () => {
        const req = {
            body: {
                category_name: 'test'
            }
        }
        
        jest.spyOn(mssql, 'connect').mockImplementation(() => {
            return {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    recordset: [
                        {
                            category_name: 'test'
                        }
                    ]
                })
            }
        })

        await createNewCategory(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Category already exists'
        })
    })

    test('should return 200 if category is created successfully', async () => {
        const req = {
            body: {
                category_name: 'test2'
            }
        }

        jest.spyOn(mssql, 'connect').mockImplementation(() => {
            return {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    recordset: []
                })
            }
        })

        await createNewCategory(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Category created successfully'
        })
    })
})


describe('CreateNewProduct', () => {
    it('should return 400 if all fields are not provided', async () => {
        const req = {
            body: {
                product_name: '',
                product_price: '',
                product_category_id: '',
                product_description: ''
            }
        }

        await createNewProduct(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Please provide all required fields'
        })
    }
    )

    it('should return 200 if product is created successfully', async () => {
        const req = {
            body: {
                product_name: 'test',
                product_description: 'test',
                product_category_id: 'test',
                product_initial_price: 18,
                product_price: 15,
                product_image: 'test',
                product_stock: 10
            }
        }

        jest.spyOn(mssql, 'connect').mockImplementation(() => {
            return {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    recordset: []
                })
            }
        })

        await createNewProduct(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Product created successfully'
        })
    })
})

describe('GetAllProducts', () => {
    it('should return 200 if products are found', async () => {
        const req = {
            query: {
                name: ''
            }
        }

        jest.spyOn(mssql, 'connect').mockImplementation(() => {
            return {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    recordset: [
                        {
                            product_name: 'test',
                            product_description: 'test',
                            product_category_id: 'test',
                            product_initial_price: 18,
                            product_price: 15,
                            product_image: 'test',
                            product_stock: 10
                        }
                    ]
                })
            }
        })

        await getAllProducts(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            products: [
                {
                    product_name: 'test',
                    product_description: 'test',
                    product_category_id: 'test',
                    product_initial_price: 18,
                    product_price: 15,
                    product_image: 'test',
                    product_stock: 10
                }
            ]
        })
    })

    it('should return 404 if no products are found', async () => {
        const req = {
            query: {
                name: ''
            }
        }

        jest.spyOn(mssql, 'connect').mockImplementation(() => {
            return {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    recordset: []
                })
            }
        })

        await getAllProducts(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            error: 'No products found'
        })
    })
})

describe('GetProductById', () => {
    it('should return 200 if product is found', async () => {
        const req = {
            params: {
                id: v4()
            }
        }

        jest.spyOn(mssql, 'connect').mockImplementation(() => {
            return {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    recordset: [
                        {
                            product_name: 'test',
                            product_description: 'test',
                            product_category_id: 'test',
                            product_initial_price: 18,
                            product_price: 15,
                            product_image: 'test',
                            product_stock: 10
                        }
                    ]
                })
            }
        })

        await getProductById(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            product: {
                product_name: 'test',
                product_description: 'test',
                product_category_id: 'test',
                product_initial_price: 18,
                product_price: 15,
                product_image: 'test',
                product_stock: 10
            }
        })
    })

    it('should return 404 if product is not found', async () => {
        const req = {
            params: {
                id: v4()
            }
        }

        jest.spyOn(mssql, 'connect').mockImplementation(() => {
            return {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    recordset: []
                })
            }
        })

        await getProductById(req, res)

        expect(res.status).toHaveBeenCalledWith(404)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Product not found'
        })
    })
})

describe('UpdateProduct', () => {
    it('should return 400 if all fields are not provided', async () => {
        const req = {
            params: {
                id: v4()
            },
            body: {
                product_name: '',
                product_price: '',
                product_category_id: '',
                product_description: ''
            }
        }

        await updateProduct(req, res)

        expect(res.status).toHaveBeenCalledWith(400)
        expect(res.json).toHaveBeenCalledWith({
            error: 'Please provide all required fields'
        })
    })

    it('should return 200 if product is updated successfully', async () => {
        const req = {
            params: {
                id: v4()
            },
            body: {
                product_name: 'test',
                product_description: 'test',
                product_category_id: 'test',
                product_initial_price: 18,
                product_price: 15,
                product_image: 'test',
                product_stock: 10
            }
        }

        jest.spyOn(mssql, 'connect').mockImplementation(() => {
            return {
                request: jest.fn().mockReturnThis(),
                input: jest.fn().mockReturnThis(),
                execute: jest.fn().mockResolvedValue({
                    recordset: []
                })
            }
        })

        await updateProduct(req, res)

        expect(res.status).toHaveBeenCalledWith(200)
        expect(res.json).toHaveBeenCalledWith({
            message: 'Product updated successfully'
        })
    })
    
})




