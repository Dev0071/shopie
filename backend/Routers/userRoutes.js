import { Router } from "express";
import {loginUser, registerUser,logoutUser} from "../Controllers/userController.js";


const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);




export default userRouter;