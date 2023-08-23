import { DB } from "../DBHelpers/index.js";
import { v4 as uuidv4 } from 'uuid';
import { validateProductAddSchema } from "../Validators/productControllerValidator.js";
import cloudinary from 'cloudinary';
import dotenv from 'dotenv'



dotenv.config()
cloudinary.config({
    cloud_name: process.env.CLOUDNAME,
    api_key: process.env.CLOUDAPI_KEY,
    api_secret: process.env.API_SECRET
  })



export const addProduct = async(req,res) => {
    try {
        const admin = req.info.is_admin
        if(!admin){
            return res.status(401).json({
                status: 'error',
                message: 'Only Admins can add products'
            })
        }
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



export const getAllProducts = async (req, res) => {
    try {
        
        const response = await DB.exec('usp_GetAllProducts');
        
        const products = response.recordset

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
        
        console.log(error);
        return res.status(500).json( {
            status: 'error',
            message: 'Error Getting Products'});
        
    }
}

//NOT IN USE AT THE MOMENT
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
        
        console.log(error);
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
        const admin = req.info.is_admin
        if(!admin){
            return res.status(401).json({
                status: 'error',
                message: 'Only Admins can Delete Products'
            })
        }
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
        
        return res.status(500).json( {
            status: 'error',
            message: 'Error Getting Product'});
        }
       
    
}

export const editProduct = async(req,res) =>{
    try {
        const admin = req.info.is_admin
        if(!admin){
            return res.status(401).json({
                status: 'error',
                message: 'Only Admins can edit products'
            })
        }
        const { error } = validateProductAddSchema.validate(req.body);

        if(error){
            return res.status(422).json({
                'status': 'error',
                'message': error.message
            }
            )
        }
        const {product_id} = req.params;
        const {product_name, product_description, price,product_quantity, product_image, product_category} = req.body


        const response = await DB.exec('usp_EditProduct',{product_id,
            product_name, product_description,
            price,product_quantity,
            product_image, product_category});
        
        if(response.rowsAffected[0] == 0){
                return res.status(404).json({
                    status:'error',
                  'message': 'Product not found'
                 })
        }
        else{
            const response = await DB.exec('usp_GetProductById',{product_id});

            return res.status(200).json({
                status:'success',
                message: 'Product Edited Successfully',
                product: response.recordset[0]
        })

        }
       
        
    } catch (error) {
        console.log(error);
          
        return res.status(500).json( {
            status: 'error',
            message: 'Error Getting Product'});
    
       
        
    }

}



export const uploadImage =  async(req,res)=>{
    try {
        const cloudinaryResult = await cloudinary.v2.uploader.upload_stream(
            {
              folder: 'product-images',
              public_id: uuidv4(),
              format: 'png',
              width: 500,
              height: 500,
              crop: 'limit',
              background_removal: 'auto:eco',
              transformation: [
                { effect: 'sharpen:500' }
              ]
            },
            async (err, result) => {
              if (err) {
                return res.status(400).json({
                  status: 'error',
                  message: 'Error uploading image'
                });
              }
      
              const product_image = result.secure_url;
      
              return res.status(200).json({
                status: 'success',
                message: 'Image successfully uploaded',
                product_image   
              });
            }
          );
      
          req.file.stream.pipe(cloudinaryResult);
           
        
    } catch (error) {
        return res.status(500).json( {
            status: 'error',
            message: 'Error Uploading Image'});
        
    }
  
}

export const searchProduct = async(req,res)=>{
    try {
        const { query } = req.params;

        const results = await DB.exec('usp_SearchProducts', { query });

        if(results.rowsAffected[0]==0){
            return res.status(404).json({
                status:'error',
              'message': 'No Products found'
             })
        }
        
        res.status(200).json({
             status:'success',
             products: results.recordset
             });
   

        
    } catch (error) {
        
        res.status(500).json({ error: 'Error While Searching' })
        
    }
}

export const getProductByCategory = async(req,res)=>{
    try {
        
        const product_category = req.params.product_category;
      
        const resp = await DB.exec('usp_GetAllProductsByCategory',{product_category});

        if(resp.rowsAffected == 0){
            return res.status(404).json({
                status:'error',
             'message': `No Products in Category ${product_category} Found`
             })
        }

        return res.status(200).json({
            status:'success',
            products: resp.recordset,
        
        })

    } catch (error) {
       
        return res.status(500).json( {
            status: 'error',
            message: `Error getting Items Based on Category${category}`});
        
    }
   


}