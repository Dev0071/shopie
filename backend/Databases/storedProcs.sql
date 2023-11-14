GO
CREATE OR ALTER PROCEDURE usp_AddProduct
    @product_id VARCHAR(255),
    @product_name VARCHAR(255), 
    @product_description TEXT,  
    @price DECIMAL(10, 2),    
    @product_quantity INT,     
    @product_image VARCHAR(255), 
    @product_category ProductCategoryType 
AS
BEGIN
    IF EXISTS (SELECT 1 FROM ProductCategory WHERE CategoryName = @product_category) 
    BEGIN
        INSERT INTO Product (product_id, product_name, product_description, price, product_quantity, product_image, product_category)
        VALUES (@product_id, @product_name, @product_description, @price, @product_quantity, @product_image, @product_category);
    END
    ELSE
    BEGIN
        RAISERROR('Invalid product category.', 16, 1);
    END;
END;

GO
CREATE OR ALTER PROCEDURE usp_GetAllProductsByCategory  
   @product_category ProductCategoryType    
AS  
BEGIN  
    SELECT *  
    FROM Product where product_quantity>0 AND product_category=@product_category ORDER BY added_at;  
END;








-- GO
-- CREATE OR ALTER PROCEDURE usp_GetProducts
--     @PageSize INT = NULL,
--     @PageNumber INT = NULL
-- AS
-- BEGIN
--     DECLARE @Offset INT
--     SET @Offset = (@PageNumber - 1) * @PageSize;

--     SELECT *
--     FROM Product
--     ORDER BY product_id
--     OFFSET ISNULL (@Offset,0) ROWS
--     FETCH NEXT ISNULL (@PageSize,10) ROWS ONLY;
-- END;

GO
CREATE OR ALTER PROCEDURE usp_EditProduct
    @product_id VARCHAR(255),
    @product_name VARCHAR(255),      
    @product_description TEXT,       
    @price DECIMAL(10, 2),          
    @product_quantity INT,           
    @product_image VARCHAR(255),     
    @product_category ProductCategoryType  
AS
BEGIN
    UPDATE Product
    SET
        product_name = @product_name,
        product_description = @product_description,
        price = @price,
        product_quantity = @product_quantity,
        product_image = @product_image,
        product_category = @product_category
    WHERE
        product_id = @product_id;
END;




GO
CREATE OR ALTER PROCEDURE usp_GetAllProducts
AS
BEGIN
    SELECT *
    FROM Product where product_quantity>0 ORDER BY added_at;
END;

GO
CREATE OR ALTER PROCEDURE usp_SearchProducts
    @query VARCHAR(255)
AS
BEGIN
    SELECT *
    FROM Product
    WHERE (product_name LIKE '%' + @query + '%'
       OR product_category LIKE @query + '%') AND product_quantity>0;
END;
GO
CREATE OR ALTER PROCEDURE usp_DeleteProduct  
    @product_id VARCHAR(255)  
AS  
BEGIN  
    BEGIN TRY
        BEGIN TRANSACTION;
        DELETE FROM UserCart WHERE product_id = @product_id;
        DELETE FROM AnonymousCart WHERE product_id = @product_id;
        UPDATE Product SET product_quantity = 0 WHERE product_id = @product_id;
        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK;
        THROW;
    END CATCH;
END;

GO
CREATE OR ALTER PROCEDURE usp_GetProductById  
     @product_id VARCHAR(255)  
AS  
BEGIN  
    SELECT *  
    FROM Product  
 WHERE product_id = @product_id  AND product_quantity>0
END;