import { Router } from "express";
import {addProduct,getProducts,getProductById,deleteProduct,editProduct,uploadImage,getAllProducts,searchProduct,getProductByCategory} from "../Controllers/productController.js";
import {authenticateToken} from "../Middleware/index.js"
import multer from 'multer';
const productRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
productRouter.post('/',authenticateToken, addProduct);
productRouter.get('/?', getAllProducts);
productRouter.get('/:product_id', getProductById);
productRouter.delete('/:product_id',authenticateToken, deleteProduct);
productRouter.patch('/:product_id',authenticateToken,editProduct);
productRouter.post('/upload-image', upload.single('product_image'), uploadImage);
productRouter.get('/search/:query',searchProduct)
productRouter.get('/all/:product_category',getProductByCategory)




export default productRouter;