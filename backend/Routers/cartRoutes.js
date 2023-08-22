import { Router } from "express";
import {addToCart,getCartItems,removeItemFromCart,emptyCart} from "../Controllers/cartController.js";

const cartRouter = Router();

cartRouter.post('/', addToCart)
cartRouter.get('/items', getCartItems)
cartRouter.post('/items/:id', removeItemFromCart)
cartRouter.post('/items/', emptyCart)




export default cartRouter;