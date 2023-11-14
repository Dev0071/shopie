GO
CREATE OR ALTER PROCEDURE usp_EmptyCart
    @user_id VARCHAR(255),
    @session_id VARCHAR(255)
AS
BEGIN
    BEGIN TRY
         
        BEGIN TRANSACTION;

        
        CREATE TABLE #RemovedProducts (
            product_id VARCHAR(255)
        );
        IF @user_id IS NULL
        BEGIN
            INSERT INTO #RemovedProducts (product_id)
            SELECT product_id
            FROM AnonymousCart
            WHERE session_id = @session_id;

            DELETE FROM AnonymousCart WHERE session_id = @session_id;
        END

        ELSE
        BEGIN
            INSERT INTO #RemovedProducts (product_id)
            SELECT product_id
            FROM UserCart
            WHERE user_id = @user_id;

            DELETE FROM UserCart WHERE user_id = @user_id;
        END
        UPDATE Product
        SET product_quantity = product_quantity +
            (SELECT COUNT(*) FROM #RemovedProducts rp WHERE rp.product_id = Product.product_id)
        WHERE EXISTS (SELECT 1 FROM #RemovedProducts rp WHERE rp.product_id = Product.product_id);

        COMMIT;
        DROP TABLE #RemovedProducts;
    END TRY
    BEGIN CATCH

        ROLLBACK;
        THROW;
    END CATCH;
END;


GO
CREATE OR ALTER PROCEDURE usp_RemoveallSuchItemsFromCart
    @user_id VARCHAR(255),
    @session_id VARCHAR(255),
    @product_id VARCHAR(255)
AS
BEGIN
    BEGIN TRY
        DECLARE @deletedItemCount INT;

        SET @deletedItemCount = 0;

        BEGIN TRANSACTION;

        IF @user_id IS NULL
        BEGIN
            
            DELETE FROM AnonymousCart WHERE session_id = @session_id AND product_id = @product_id;
            SET @deletedItemCount += @@ROWCOUNT;
        END
        ELSE
        BEGIN
            DELETE FROM UserCart WHERE user_id = @user_id AND product_id = @product_id;
            SET @deletedItemCount += @@ROWCOUNT;
        END

        UPDATE Product
        SET product_quantity = product_quantity + @deletedItemCount
        WHERE product_id = @product_id;

        COMMIT;
    END TRY
    BEGIN CATCH
        ROLLBACK; 

        THROW;
    END CATCH;
END;



GO
CREATE OR ALTER PROCEDURE usp_TransferAnonymousToUserCart
    @session_id VARCHAR(255),
    @user_id VARCHAR(255)
AS
BEGIN
    BEGIN TRY
        BEGIN TRANSACTION;
        IF EXISTS (SELECT 1 FROM AnonymousCart WHERE session_id = @session_id)
        BEGIN
            DECLARE @product_id VARCHAR(255);
            DECLARE @quantity INT;
            DECLARE cart_cursor CURSOR FOR
            SELECT product_id, quantity
            FROM AnonymousCart
            WHERE session_id = @session_id;
            OPEN cart_cursor;
            FETCH NEXT FROM cart_cursor INTO @product_id, @quantity;

            WHILE @@FETCH_STATUS = 0
            BEGIN
                DECLARE @existing_user_cart INT;
                SELECT @existing_user_cart = COUNT(*)
                FROM UserCart
                WHERE user_id = @user_id AND product_id = @product_id;

                IF @existing_user_cart = 0
                BEGIN
                    INSERT INTO UserCart (user_id, product_id, quantity)
                    VALUES (@user_id, @product_id, @quantity);
                END
                ELSE
                BEGIN
                    UPDATE UserCart
                    SET quantity = quantity + @quantity
                    WHERE user_id = @user_id AND product_id = @product_id;
                END
                DELETE FROM AnonymousCart
                WHERE session_id = @session_id AND product_id = @product_id;
                FETCH NEXT FROM cart_cursor INTO @product_id, @quantity;
            END;

            CLOSE cart_cursor;
            DEALLOCATE cart_cursor;
        END

        COMMIT;
    END TRY
    BEGIN CATCH
       
        ROLLBACK;
        THROW;
    END CATCH;
END;




GO
CREATE OR ALTER PROCEDURE usp_GetCartItems
    @user_id VARCHAR(255),
    @session_id VARCHAR(255)
AS
BEGIN
    IF @user_id IS NULL
    BEGIN
        SELECT
            ac.product_id,
            SUM(ac.quantity) AS combined_quantity,
            p.product_name,
            p.price
        FROM (
            SELECT
                
                product_id,
                SUM(quantity) AS quantity
            FROM AnonymousCart
            WHERE session_id = @session_id
            GROUP BY cart_id, product_id
        ) AS ac
        INNER JOIN Product p ON ac.product_id = p.product_id
        GROUP BY ac.product_id, p.product_name, p.price;
    END
    ELSE
    BEGIN
        SELECT
          
            uc.product_id,
            SUM(uc.quantity) AS quantity,
            p.product_name,
            p.price
        FROM (
            SELECT
                cart_id,
                product_id,
                SUM(quantity) AS quantity
            FROM UserCart
            WHERE user_id = @user_id
            GROUP BY cart_id, product_id
        ) AS uc
        INNER JOIN Product p ON uc.product_id = p.product_id
        GROUP BY  uc.product_id, p.product_name, p.price;
    END
END;





GO
CREATE OR ALTER PROCEDURE usp_AddToCart
    @product_id VARCHAR(255),
    @session_id VARCHAR(255),
    @user_id VARCHAR(255),
    @product_quantity INT
AS
BEGIN
    BEGIN
        DECLARE @available_quantity INT;
        SELECT @available_quantity = product_quantity
        FROM Product
        WHERE product_id = @product_id;
        IF @available_quantity >= @product_quantity
        BEGIN
            IF @user_id IS NULL
            BEGIN
                INSERT INTO AnonymousCart (product_id, session_id, quantity)
                VALUES (@product_id, @session_id, @product_quantity);
            END
            ELSE
            BEGIN
                INSERT INTO UserCart (user_id, product_id, quantity)
                VALUES (@user_id, @product_id, @product_quantity);
            END
            UPDATE Product
            SET product_quantity = @available_quantity - @product_quantity
            WHERE product_id = @product_id;
        END
        ELSE
        BEGIN
            RAISERROR('Insufficient quantity available for this product.', 16, 1);
        END
    END
END;





GO
CREATE OR ALTER PROCEDURE usp_RemoveFromCart  
    @user_id NVARCHAR(36),  
    @session_id NVARCHAR(36),  
    @product_id NVARCHAR(36)  
AS  
BEGIN  
    BEGIN TRY  
        BEGIN TRANSACTION;   
          
        IF @user_id IS NULL  
        BEGIN  
            DELETE FROM AnonymousCart  
            WHERE cart_id = (  
                SELECT MIN(cart_id)  
                FROM AnonymousCart  
                WHERE product_id = @product_id  
            AND session_id = @session_id);  
        END  
        ELSE  
        BEGIN  
            DELETE FROM userCart  
            WHERE cart_id = (  
                SELECT MIN(cart_id)  
                FROM userCart  
                WHERE product_id = @product_id  
    AND user_id = @user_id  
            );  
        END;  
  
        IF @@ROWCOUNT = 1  
        BEGIN  
            UPDATE Product  
            SET product_quantity = product_quantity + 1  
            WHERE product_id = @product_id;  
        END;  
          
        COMMIT;  
    END TRY  
    BEGIN CATCH  
        ROLLBACK;  
    END CATCH;  
END;  