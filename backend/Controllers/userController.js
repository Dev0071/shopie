import { DB } from "../DBHelpers/index.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt  from 'bcrypt';
import jwt  from "jsonwebtoken";
import { validateRegisterSchema,validateloginSchema } from "../Validators/userControllerValidators.js";
import { generateAccessToken } from "../Middleware/index.js"

export const registerUser = async(req,res)=>{
    try {
    
        const {error} = validateRegisterSchema.validate(req.body)
        if(error){
            return res.status(422).json({
                'status': 'error',
                'message': error.message
            }
            )
        }

        const user_id = uuidv4()
        const { u_name, email, password } = req.body;
        const hashed_password  = await bcrypt.hash(password, 5)

        await DB.exec("usp_AddUser",
        {user_id, u_name, email, password:hashed_password});

        const payload = {
            user_id,u_name
        }
        const token = generateAccessToken(payload)
        return res.status(201).json(
            {
                'status': 'success',
                message: 'User Registered Successfully',
                token,
                user: {
                    user_id,
                    u_name,
                }
            }
        )
    } catch (error) {
        if (error.number == 2627 && error.message.includes('duplicate key value')) {
            return res.status(409).json(
                {
                    'status': 'error',
                    error: "This Email is already in use"
                }
            )

        }
        
        return res.status(500).json(
            {
                'status': 'error',
                error: "Internal Server Error"
            }
        )
    }
}


export const loginUser = async (req, res) =>{
try {
    
    const {error} = validateloginSchema.validate(req.body)
  
    if(error){
        return res.status(422).json({
            'status': 'error',
            'message': error.message
        }
        )
    }

    const{email,password} = req.body

    
    const record = await (DB.exec('usp_GetUserByMail', { email }))
    const user = record.recordset
    if (user.length == 0) {

        return res.status(404).json(
            {
                status: "error",
                message: "Seems You Do Not have An Account "
            }
        )
    }
   
    else {
        const { password: hashedPwd, ...payload } = user[0];
        const comparePwd = await bcrypt.compare(password, hashedPwd);
        if (comparePwd) {
            const token = generateAccessToken(payload)
            return res.status(200).json({
                status: "success",
                user: {
                    id: user[0]['user_id'],
                    u_name: user[0]['u_name'],
                },
                message: "Login successful",
                token
            })
        }
        else {
            return res.status(403).json({

                status: "error",
                message: "Password is not correct"
            })
        }
    }
}
catch (error) {
    console.log(error)
    return res.status(500).json(
        {
            status: "error",
            message: "Error Trying to log in"
        }
    )
}
}

