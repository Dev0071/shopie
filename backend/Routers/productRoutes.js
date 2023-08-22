import { Router } from "express";
import {addProduct,getProducts,getProductById,deleteProduct,editProduct,uploadImage,getAllProducts} from "../Controllers/productController.js";

import multer from 'multer';
const productRouter = Router();
const upload = multer({ storage: multer.memoryStorage() });
productRouter.post('/', addProduct);
productRouter.get('/?', getAllProducts);
productRouter.get('/:product_id', getProductById);
productRouter.delete('/:product_id', deleteProduct);
productRouter.patch('/:product_id', editProduct);
productRouter.post('/upload-image', upload.single('product_image'), uploadImage);




export default productRouter;