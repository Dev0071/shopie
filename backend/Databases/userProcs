CREATE OR ALTER PROCEDURE usp_AddUser
    @user_id VARCHAR(255),
    @u_name VARCHAR(255),
    @email VARCHAR(255),
    @password VARCHAR(255)
AS
BEGIN
    INSERT INTO [User] (user_id,u_name, email, password)
    VALUES (@user_id, @u_name,@email, @password);
    SELECT user_id,u_name,is_admin FROM [User] WHERE user_id=@user_id
END;





GO
CREATE OR ALTER PROCEDURE usp_GetUserByMail
    @email VARCHAR(255)
   
AS
BEGIN
	SELECT * from [User] where email=@email
    
END;

GO
CREATE OR ALTER PROCEDURE usp_UpdatePassword(
	@user_id VARCHAR(255),
	@password VARCHAR(255))
AS 
BEGIN
	UPDATE [User] SET password = @password where @user_id = @user_id;
END;


GO
GO
CREATE OR ALTER PROCEDURE usp_AddToken(
	@user_id VARCHAR(255),
	@token VARCHAR(255),
	@expiry DATETIME)
AS
BEGIN
	MERGE INTO ResetToken AS target
	USING (SELECT @user_id AS user_id) AS source
	ON target.user_id = source.user_id
	WHEN MATCHED THEN
		UPDATE SET token = @token, expiry = @expiry
	WHEN NOT MATCHED THEN
		INSERT (user_id, token, expiry)
		VALUES (@user_id, @token, @expiry);
END;
