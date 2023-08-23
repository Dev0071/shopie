import jwt from "jsonwebtoken";
import dotenv from 'dotenv';
import { DB } from "../DBHelpers/index.js";
dotenv.config();

export const authenticateToken = (req,res,next)=>{
    const authHeaders = req.headers['authorization'];

    const token = authHeaders && authHeaders.split(' ')[1];

    if(token == null){
       return res.status(401).json({message:'No Token Provided'});
    }

    jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err instanceof jwt.TokenExpiredError){
            return res.sendStatus(403).json({message: "Token expired"});
        }
        if(err){
            return res.sendStatus(403).json({message: err});
        }
        req.info = decoded;
       
        next();
    })

}

export const generateAccessToken = (user) => {

    const payload = {
        issuer: user.user_id,
        subject: user.u_name,
        id: user.is_admin
        
    }

    return jwt.sign(payload,process.env.JWT_SECRET,{
        expiresIn: '1630679999'
    })

}

export const transferAnonCart = async(req, res, next)=>{

    try {
        const user_id = req.session.user_id;
        const session_id = req.sessionID;

        if (user_id && session_id) {
    
            await DB.exec("usp_TransferAnonymousToUserCart", { user_id, session_id });
        }
        next();
        
       
        
    } catch (error) {
        console.error("Error transferring items from anonymous cart to user cart:", error);
        next(error);
    }



}