import { DB } from "../DBHelpers/index.js";
import { v4 as uuidv4 } from 'uuid';
import { validateProductAddSchema } from "../Validators/productControllerValidator.js";






export const addProduct = async(req,res) => {
    try {

        const { error } = validateProductAddSchema.validate(req.body);

        if(error){
            return res.status(422).json({
                'status': 'error',
                'message': error.message
            }
            )
        }

        const product_id = uuidv4();

        const {product_name, product_description, price,product_quantity, product_image, product_category} = req.body

        await DB.exec('usp_AddProduct',{product_id,product_name,product_description, price,product_quantity,  product_image, product_category})

        return res.status(200).json({
            'status': 'success',
            'message': 'Product added successfully'
        })

    } catch (error) {
        if(error.number == 50000 && error.class == 16){

            return res.status(400).json({
                'status': 'error',
                'message': error.message
            })

        }
       
        return res.status(500).json( {'status': 'error','message': 'Error Adding Product'});
    }
}


export const getProducts = async (req, res) => {
    try {
        
        //TO HANDLE PAGINATION, ADDING THE LIMITS AND PAGE NUMBERs
        const {PageSize, PageNumber} = req.params
        console.log(PageSize, PageNumber)
        let response;

        if (PageNumber && PageSize){
            response = await DB.exec('usp_GetProducts',{PageSize, PageNumber});
        }
        else{
            response = await DB.exec('usp_GetProducts');
        }
        let products = response.recordset

        if(products.length == 0){
            return res.status(404).json({
                status:'error',
                'message': 'No Products found'
             })
           
        }
        else{
            return res.status(200).json({
                'status':'success',
                 'products': products
             })
           
        }

       
        
    } catch (error) {
        

        return res.status(500).json( {
            status: 'error',
            message: 'Error Getting Products'});
        
    }
}


export const getProductById = async (req, res) => {
    try {
        const {product_id} = req.params

        const response = await DB.exec('usp_GetProductById',{product_id});

        if(response.rowsAffected[0] == 1){
            return res.status(200).json({
               'status':'success',
                'product': response.recordset[0]


            })
        }
        else{
            return res.status(404).json({
                status:'error',
               'message': 'Product not found'
             })
        }
            
    } catch (error) {
        
        return res.status(500).json( {
            status: 'error',
            message: 'Error Getting Product'});
    }
       
}

export const deleteProduct = async(req,res) => {
    try {
        const {product_id} = req.params

        const response = await DB.exec('usp_DeleteProduct',{product_id});

        if(response.rowsAffected[0] == 0){
            return res.status(404).json({
                status:'error',
              'message': 'Product not found'
             })
        }
        return res.status(200).json({
            status:'success',
           'message': 'Product Deleted Successfully'
         })
    } catch (error) {
        console.log(error);
        return res.status(500).json( {
            status: 'error',
            message: 'Error Getting Product'});
        }
       
    
}

export const editProduct = async(req,res) =>{
    try {
        
    } catch (error) {
        
    }

}