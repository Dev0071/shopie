import { Router } from "express";
import {addToCart,getCartItems,removeItemFromCart,emptyCart,removeallSuchItemsFromCart} from "../Controllers/cartController.js";

const cartRouter = Router();

cartRouter.post('/:product_id/', addToCart)
cartRouter.get('/items/:session_id/:user_id?/', getCartItems)
cartRouter.post('/item/:product_id/', removeItemFromCart)
cartRouter.post('/all/items', emptyCart)
cartRouter.post('/all/items/:product_id',removeallSuchItemsFromCart)




export default cartRouter;