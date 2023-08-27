import { Router } from "express";
import {loginUser, registerUser,logoutUser,resetPassword, changePassword} from "../Controllers/userController.js";


const userRouter = Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.post('/logout', logoutUser);
userRouter.post('/reset-password',resetPassword)
userRouter.patch('/change-password/:token',changePassword)




export default userRouter;