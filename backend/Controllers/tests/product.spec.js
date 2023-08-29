import { validateProductAddSchema } from '../../Validators/productControllerValidator'; 
import { DB } from '../../DBHelpers/index.js'; 
import * as product from "../productController.js"; 
import { v4 as uuidv4 } from 'uuid';
const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};

jest.mock('../../DBHelpers/index.js', () => ({
    DB: {
      exec: jest.fn(),
    },
}));


jest.mock('../../Validators/productControllerValidator', () => ({
    validateProductAddSchema: {
      validate: jest.fn(),
    },
}));

jest.mock('uuid', () => {
    return {
        uuidv4: jest.fn(() => 'mocked-uuid'),
    };
  });


describe("PRODUCT CONTROLLER TESTS - ADD PRODUCT",()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });
    it("Should return a 422 if the body sent is invalid",async()=>{
        const reqMock = {
            info: {
              id: true, 
            },
          };
        validateProductAddSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
        await product.addProduct(reqMock, resMock);

        expect(resMock.status).toHaveBeenCalledWith(422);
        expect(resMock.json).toHaveBeenCalledWith({
          status: 'error',
          message: 'Validation error',
        });
      

    })

    it("Should return a 401 if the request is made by a non Admin",async()=>{

        const reqMock = {
            info: {
              id: false, 
            },
          };
        validateProductAddSchema.validate.mockReturnValue({ error: { message: null } });
        await product.addProduct(reqMock, resMock);
        expect(DB.exec).not.toHaveBeenCalled();
        expect(resMock.status).toHaveBeenCalledWith(401);
        expect(resMock.json).toHaveBeenCalledWith({
            status: 'error',
            message: 'Only Admins can add products'
        });
      

    })

    // it("Should return a 200  if the product is added successfully",async()=>{
    //     const reqMock = {
    //         info: {
    //           id: true, 
    //         }
    //       };
    //       validateProductAddSchema.validate.mockReturnValue({ error: { message: false } });
    //       jest.mock('uuid', () => {
    //         return {
    //           v4: jest.fn(() => 'mocked-uuid'), 
    //         };
    //       });
    //       DB.exec.mockResolvedValue();
    //       await product.addProduct(reqMock, resMock);
    //       expect(resMock.status).toHaveBeenCalledWith(200);
    //       expect(DB.exec).toHaveBeenCalledWith('usp_AddProduct', {
    //         product_id: 'mocked-uuid',
    //         product_name: "SonyBravia",
    //         product_description: "cool screen blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah",
    //         price: 300,
    //         product_quantity: 3,
    //         product_category: "Electronics",
    //         product_image: "https://imgs.search.brave.com/"
            
    //       });

    //       expect(resMock.status).toHaveBeenCalledWith(200);

    // })


})



describe("PRODUCT CONTROLLER TESTS GET PRODUCTS",()=>{
  afterEach(() => {
    jest.clearAllMocks();
});
    it("Should return a 200 if there are products fetched and return the products as an array",async()=>{
      const products = {
        "product_name": "SonyBravia",
        "product_description": "cool screen blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah",
        "price": 300,
        "product_quantity": 3,
        "product_category": "Electronics",
        "product_image": "https://imgs.search.brave.com/" 
    }
    const reqMock = {}
      DB.exec.mockResolvedValue({ rowsAffected: [1],recordset: [products] });
      await product.getAllProducts(reqMock,resMock);
      expect(resMock.status).toHaveBeenCalledWith(200);
      // expect(resMock.json).products.toBe(Object)

      })

    it("Should return a 404 if there are no products fetched and a message saying so",async()=>{
      DB.exec.mockResolvedValue({ recordset: [] });
      const mockReq = {}
      await product.getAllProducts(mockReq, resMock);
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
              status: 'error',
              message: 'No Products found',
              
            });
    })

    it("Should return a 500 if there is a database error",async()=>{
      
      DB.exec.mockRejectedValueOnce(new Error('Database error'));
      const mockReq = {}
      await product.getAllProducts(mockReq, resMock);
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        status: 'error',
        message: 'Error Getting Products'
      });

    })
})

describe("PRODUCT CONTROLLER TESTS GET PRODUCT BY ID",()=>{

    it("Should return a 200 if the product is found and the product details are returned",async()=>{
      const productData = {
        "product_id": "123",
        "product_name": "SonyBravia",
        "product_description": "cool screen blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah blah",
        "price": 300,
        "product_quantity": 3,
        "product_category": "Electronics",
        "product_image": "https://imgs.search.brave.com/" 
    }

    const mockReq = {
      params: "123"

    }
      
    DB.exec.mockResolvedValue({ rowsAffected: [1],recordset: [productData] });
    await product.getProductById(mockReq,resMock);
    expect(resMock.status).toHaveBeenCalledWith(200);
    expect(resMock.json).toHaveBeenCalledWith({
      'status':'success',
        product: productData
    })
          
    })

    it("Should return a 404 if the product is not found and a message saying so",async()=>{

      const mockReq = {
        params: "124"
  
      }
      DB.exec.mockResolvedValue({ rowsAffected: [0],recordset: [] });
      await product.getProductById(mockReq,resMock);
      expect(resMock.status).toHaveBeenCalledWith(404);
      expect(resMock.json).toHaveBeenCalledWith({
        'status':'error',
        message: 'Product not found'
      })
    })

    it("Should return a 500 if there is a database error",async()=>{
      const mockReq = {}
      DB.exec.mockRejectedValue(new Error('Database error'));
      await product.getProductById(mockReq,resMock);
      expect(resMock.status).toHaveBeenCalledWith(500);
      expect(resMock.json).toHaveBeenCalledWith({
        'status':'error',
        message: 'Error Getting Product'
      })

    })


 
})