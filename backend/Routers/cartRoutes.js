import { Router } from "express";
import {addToCart,getCartItems,removeItemFromCart,emptyCart} from "../Controllers/cartController.js";

const cartRouter = Router();

cartRouter.post('/:product_id', addToCart)
cartRouter.get('/items', getCartItems)
cartRouter.post('/items/:product_id', removeItemFromCart)
cartRouter.post('/all/items', emptyCart)




export default cartRouter;