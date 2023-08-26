import { DB } from "../DBHelpers/index.js";
import { v4 as uuidv4 } from 'uuid';
export const addToCart = async(req,res)=>{
    try {
        const session_id = req.body.session_id || uuidv4();;
        const user_id = req.body.user_id || null;
        const product_id = req.params.product_id
        const product_quantity = 1;
        
        if (!req.body.session_id) {
          res.cookie('session_id', session_id);
        }   
        await DB.exec('usp_AddToCart',{product_id, product_quantity, session_id, user_id});

        return res.status(201).json({
            status:'success',
            message: 'Product added to cart successfully',
            sess: session_id,
          
        })

        
    } catch (error) {
        console.log(error);
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
        
        const session_id = req.params.session_id
        const user_id = req.params.user_id || null;
        const response = await DB.exec('usp_GetCartItems',{user_id, session_id});
        const products = response.recordset;
        console.log(req.cookies.session_id)
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
        console.log(error)
        return res.status(500).json({
            status: 'error',
            message: 'Error Getting Items From Cart',
        })
            
    }

}

export const emptyCart = async(req,res)=>{
    try{
        const session_id = req.body.session_id;
        const user_id = req.body.user_id || null;
        console.log(session_id)
    await DB.exec('usp_EmptyCart',{user_id, session_id});
        return res.status(200).json({
            status:'success',
            message: 'Products were removed from cart'
        })
    

} catch (error) {
    // console.log(error)
    return res.status(500).json({
        status: 'error',
        message: 'Error Removing Products From Cart',
    })      
}
}


export const removeItemFromCart = async(req,res)=>{
    try{
    const session_id = req.body.session_id;
    const user_id = req.body.user_id || null;
    const product_id = req.params.product_id;
    console.log(session_id)
    const response = await DB.exec('usp_RemoveFromCart',{user_id, session_id,product_id})
    
    if(response.rowsAffected[0] == 1){
        return res.status(200).json({
            status:'success',
            message: 'Product was removed from cart'
        })
    }
    else{
        return res.status(404).json({
            status:'error',
            message: 'Product was not found in the cart'
        })
    }

       
    

} catch (error) {
    // console.log(error)
    return res.status(500).json({
        status: 'error',
        message: 'Error Removing Product From Cart',
    })
        
}

}

export const removeallSuchItemsFromCart = async(req,res)=>{
    try{
    const session_id = req.body.session_id;
    const user_id = req.body.user_id || null;
    const product_id = req.params.product_id;
   
    const response = await DB.exec('usp_RemoveallSuchItemsFromCart',{user_id, session_id,product_id})
    
    if(response.rowsAffected[0] == 1){
        return res.status(200).json({
            status:'success',
            message: 'Product was removed from cart'
        })
    }
    else{
        return res.status(404).json({
            status:'error',
            message: 'Product was not found in the cart'
        })
    }
    }
    catch(error){
        return res.status(500).json({
            status:'error',
            message: 'Error Removing Item'
        })

    }
}