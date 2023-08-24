import { Router } from "express";
import {addToCart,getCartItems,removeItemFromCart,emptyCart,removeallSuchItemsFromCart} from "../Controllers/cartController.js";

const cartRouter = Router();

cartRouter.post('/:product_id', addToCart)
cartRouter.get('/items', getCartItems)
cartRouter.post('/items/:product_id', removeItemFromCart)
cartRouter.post('/all/items', emptyCart)
cartRouter.post('/all/items/:product_id',removeallSuchItemsFromCart)




export default cartRouter;