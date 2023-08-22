import { Router } from "express";
import {addToCart,getCartItems} from "../Controllers/cartController.js";

const cartRouter = Router();

cartRouter.post('/', addToCart)
cartRouter.get('/items', getCartItems)




export default cartRouter;