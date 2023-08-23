import { DB } from "../DBHelpers/index.js";

export const addToCart = async(req,res)=>{
    try {
        
        const product_id = req.params.product_id
        const product_quantity = 1;
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

export const emptyCart = async(req,res)=>{
    try{
    const user_id = req.session.user_id || null;
    const session_id = req.sessionID;

    await DB.exec('usp_EmptyCart',{user_id, session_id});
        return res.status(200).json({
            status:'success',
            message: 'Products were removed from cart'
        })
    

} catch (error) {
    
    return res.status(500).json({
        status: 'error',
        message: 'Error Removing Products From Cart',
    })      
}
}


export const removeItemFromCart = async(req,res)=>{
    try{
    const user_id = req.session.user_id || null;
    const session_id = req.sessionID;
    const product_id = req.params.product_id;
    const {quantity} = req.body
    console.log(quantity)

    const response = await DB.exec('usp_RemoveFromCart',{user_id, session_id,product_id, quantity});
    console.log(response)
        return res.status(200).json({
            status:'success',
            message: 'Product was removed from cart'
        })
    

} catch (error) {
    console.log(error)
    return res.status(500).json({
        status: 'error',
        message: 'Error Removing Product From Cart',
    })
        
}

}