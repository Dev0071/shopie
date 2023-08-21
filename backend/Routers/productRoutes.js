import { Router } from "express";
import {addProduct,getProducts,getProductById,deleteProduct,editProduct} from "../Controllers/productController.js";


const productRouter = Router();

productRouter.post('/', addProduct);
productRouter.get('/?', getProducts);
productRouter.get('/:product_id', getProductById);
productRouter.delete('/:product_id', deleteProduct);
productRouter.patch('/:product_id', editProduct);




export default productRouter;