import { registerUser } from "../userController.js"
import bcrypt from 'bcrypt';
import { generateAccessToken, transferAnonCart } from '../../Middleware/index.js'
import { validateRegisterSchema } from '../../Validators/userControllerValidators.js'; 
import { DB } from '../../DBHelpers/index.js'; 

const reqMock = {
    body: {
      u_name: "Wonder Woman",
      email: "wonderwoman@gmail.com",
      password: "passtest1",
      session_id: "1232"
      
    },
  };
  
const resMock = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
};
jest.mock('../../Middleware/index.js');
jest.mock('../../Validators/userControllerValidators.js', () => ({
  validateRegisterSchema: {
    validate: jest.fn(),
  },
}));
jest.mock('../../DBHelpers/index.js', () => ({
  DB: {
    exec: jest.fn(),
  },
}));
jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));
jest.mock('../../Middleware/index.js', () => ({
    generateAccessToken: jest.fn(),
    transferAnonCart: jest.fn(),
}));

describe("USER CONTROLLER, REGISTER USER",()=>{
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should return a 422 response for invalid input', async () => {
        validateRegisterSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
        await registerUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(422);
        expect(resMock.json).toHaveBeenCalledWith({
          status: 'error',
          message: 'Validation error',
        });
      
    });

    it('should return a 201 response and generate a token for a valid Registration', async () => {
        const userData = {
          user_id: 1,
          u_name: 'Wonder Woman',
          is_admin: false,
          password: 'hashedPassword'
        };
        
        validateRegisterSchema.validate.mockReturnValue({ error: null });
        bcrypt.hash.mockResolvedValue('hashedPassword');
        DB.exec.mockResolvedValue({ rowsAffected: [1],recordset: [userData] });
        generateAccessToken.mockReturnValue('testToken');
    
        await registerUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(201);
        expect(resMock.json).toHaveBeenCalledWith({
          status: 'success',
          user: {
            id: userData.user_id,
            u_name: userData.u_name,
            is_admin: userData.is_admin
          },
          message: 'User Registered Successfully',
          token: 'testToken',
        });
    
        expect(transferAnonCart).toHaveBeenCalledWith(
          reqMock.body.session_id,
          userData.user_id,
          reqMock,
          resMock,
          expect.any(Function)
        );
      });

    
      // it('should return a 409 response For An Existing Email', async () => {
        
      //   validateRegisterSchema.validate.mockReturnValue({ error: null });
      //   DB.exec.mockRejectedValueOnce(new Error({number: 2627, message: 'there is a duplicate key value'}));
      //   await registerUser(reqMock, resMock);
      //   expect(resMock.status).toHaveBeenCalledWith(409);
      //   expect(resMock.json).toHaveBeenCalledWith({
      //           'status': 'error',
      //           error: "This Email is already in use"
      //   });
    
   
      // });

     
      it('should return a 500 response for a database error', async () => {
        validateRegisterSchema.validate.mockReturnValue({ error: null });
        DB.exec.mockRejectedValueOnce(new Error('Database error'));
        await registerUser(reqMock, resMock);
        expect(resMock.status).toHaveBeenCalledWith(500);
        expect(resMock.json).toHaveBeenCalledWith({
          status: 'error',
          error: 'Internal Server Error',
        });
      });


    




})