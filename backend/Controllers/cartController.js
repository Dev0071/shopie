import { validateCartSchema } from "../Validators/productControllerValidator.js";
import { DB } from "../DBHelpers/index.js";

export const addToCart = async(req,res)=>{
    try {
        const { error } = validateCartSchema.validate(req.body);
        if(error){
            return res.status(422).json({
                'status': 'error',
                'message': error.message
            }
            )
        }
        const { product_id, product_quantity } = req.body;
        const session_id = req.sessionID;
        const user_id = req.session.user_id || null;

        await DB.exec('usp_AddToCart',{product_id, product_quantity, session_id, user_id});

        return res.status(201).json({
            status:'success',
            message: 'Product added to cart successfully',
          
        })

        
    } catch (error) {
        // console.log(error);
        if(error.number == 50000 && error.message.includes("Insufficient quantity"))
        {
            return res.status(404).json({
                status: 'error',
                message: 'Product Is Not Available' });
        }

        return res.status(500).json( {
            status: 'error',
            message: 'Error Adding Product to Cart'});
        
    }
   
}


export const getCartItems = async(req,res)=>{
    try {
        const user_id = req.session.user_id || null;
        const session_id = req.sessionID;

        const response = await DB.exec('usp_GetCartItems',{user_id, session_id});

        const products = response.recordset;

        if(products.length > 0){
            return res.status(200).json({
                status:'success',
                products
            })
        }
        else{
            return res.status(404).json({
                status: 'error',
                message: 'Cart is Empty'
            })
        }

    } catch (error) {
        return res.status(500).json({
            status: 'error',
            message: 'Error Getting Items From Cart',
        })
            
    }

}