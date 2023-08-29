import { DB } from "../DBHelpers/index.js";
import { v4 as uuidv4 } from 'uuid';
import bcrypt  from 'bcrypt';
import { validateRegisterSchema,validateloginSchema,validateUpdatePassword } from "../Validators/userControllerValidators.js";
import { generateAccessToken,transferAnonCart } from "../Middleware/index.js"
import { sendResetLink } from "../EmailService/sendResetLink.js";
import dotenv from 'dotenv';
dotenv.config();
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

        const response = await DB.exec("usp_AddUser",
        {user_id, u_name, email, password:hashed_password});
        const new_user = response.recordset[0]


        if(response.rowsAffected[0] == 1){
            const payload = {
                user_id:new_user.user_id,
                u_name: new_user.u_name,
                is_admin: new_user.is_admin
            }
            
            const token = generateAccessToken(payload)
            const session_id = req.body.session_id|| '';
                transferAnonCart(session_id, new_user.user_id, req, res, async () => {
               
                return res.status(201).json({
                    'status': 'success',
                    message: 'User Registered Successfully',
                    token,
                    user: {
                        user_id,
                        u_name,
                        is_admin: new_user.is_admin
                    }
                });
            });
        

        }
        else{
            
            return res.status(500).json(
                {
                    'status': 'error',
                    error: "Internal Server Error"
                }
            )
            

        }

        
    } catch (error) {
        // console.log(error)
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
            const session_id = req.body.session_id|| '';
            transferAnonCart(session_id, user[0]['user_id'],req, res, async () => {
            return res.status(200).json({
                status: "success",
                user: {
                    id: user[0]['user_id'],
                    u_name: user[0]['u_name'],
                    is_admin: user[0]['is_admin']
                },
                message: "Login successful",
                token
            })
        });
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


// export const logoutUser =  (req, res) => {

//     req.session.destroy((err) => {
//       if (err) {
//         return res.status(500).json({
//             status: 'error',
//             message: 'Internal Server Error'
//         });
//       }
//       res.status(200).json({ 
//         status: 'success',
//         message: 'Logout successful' 
//     });
// });

export const logoutUser =  (req, res) => {
    try {
        res.clearCookie('user_id');
        res.clearCookie('sessionId');
        console.log(res)
        return res.status(200).json({
            status: "success",
            message: "Logout successful"
        });
    } catch (error) {
        return res.status().json({
            message: error.message
        })
        
    }

    
};
  



export const resetPassword = async(req, res)=>{

    try {
        const { email } = req.body;
        if(!email){
            return res.status(422).json(
                {
                    status: 'error',
                    message: 'Email is required'
                }
            )
        }
        const record = await (DB.exec('usp_GetUserByMail', { email }))
        if(record.rowsAffected == 1){
        const user = record.recordset[0]
        const user_mail = user.email;
        const u_name = user.u_name;
        const user_id = user.user_id
        const token = Math.random().toString(36).slice(2, 8);
        const expiry = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
        const response = await DB.exec("usp_AddToken",
        {user_id, token, expiry});
  
        const link = `${process.env.FE_URL}?${token}${user_id}`
        sendResetLink(user_mail,u_name,link)

        return res.status(200).json(
            {status: 'success',
            message: 'If You Have An Acount with Us, you will receive an email'}
        )
        }
        return res.status(200).json(
            {status: 'success',
            message: 'If You Have An Acount with Us, you will receive an email'}
        )

    } catch (error) {
        console.log(error)
        return res.status(500).json(
            {status: 'error',
            message: 'Internal Server Error'}
        )
    }

    
}

export const changePassword = async(req,res)=>{
    try {

        const {error} = validateUpdatePassword.validate(req.body)
        if(error){
            return res.status(422).json({
                'status': 'error',
                'message': error.message
            }
            )
        }
        const password = req.body.password
        const user_id = req.params.token.substring(6)
        // const token = req.params.token.substring(0,6)//to validate the token againt the expiry time soon...
        const hashed_password  = await bcrypt.hash(password, 5)
        const response = await DB.exec('usp_UpdatePassword',{user_id,password:hashed_password})
        console.log(response.rowsAffected[0])
        if(response.rowsAffected[0] == 0){
            return res.status(400).json({
                status:'error',
                message: 'Error Changing Password'
            })
        }
        else{
        
        return res.status(200).json({
            status:'success',
            message: 'Password Changed Successfully'
        })
    }
        
    } catch (error) {
        
        return res.status(500).json({
            status:'error',
            message: "Internal Server Error"
        })
        
    }

}
  