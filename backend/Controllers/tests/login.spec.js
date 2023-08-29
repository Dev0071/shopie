import { loginUser } from "../userController.js"
import bcrypt from 'bcrypt';
import { generateAccessToken, transferAnonCart } from '../../Middleware/index.js'
import { validateloginSchema } from '../../Validators/userControllerValidators.js'; 
import { DB } from '../../DBHelpers/index.js'; 


const reqMock = {
  body: {
    email: "wonderwoman@gmail.com",
    password: "passtest1",
    
  },
};

const resMock = {
  status: jest.fn().mockReturnThis(),
  json: jest.fn(),
};


jest.mock('../../Validators/userControllerValidators.js', () => ({
  validateloginSchema: {
    validate: jest.fn(),
  },
}));
jest.mock('../../DBHelpers/index.js', () => ({
  DB: {
    exec: jest.fn(),
  },
}));
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));
jest.mock('../../Middleware/index.js', () => ({
  generateAccessToken: jest.fn(),
  transferAnonCart: jest.fn(),
}));

describe('User Controller Tests-LOGIN FUNCTION', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return a 422 response for invalid input', async () => {
    validateloginSchema.validate.mockReturnValue({ error: { message: 'Validation error' } });
    await loginUser(reqMock, resMock);
    expect(resMock.status).toHaveBeenCalledWith(422);
    expect(resMock.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Validation error',
    });
  });

  it('should return a 404 response for a non-existent user', async () => {
    validateloginSchema.validate.mockReturnValue({ error: null });
    DB.exec.mockResolvedValue({ recordset: [] }); 
    await loginUser(reqMock, resMock);
    expect(resMock.status).toHaveBeenCalledWith(404);
    expect(resMock.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Seems You Do Not have An Account ',
    });
  });
  
  // it('should return a 200 response and generate a token for a valid login', async () => {
  //   const userData = {
  //     user_id: 1,
  //     u_name: 'Wonder Woman',
  //     is_admin: false,
  //     password: 'hashedPassword',
  //   };
  //   validateloginSchema.validate.mockReturnValue({ error: null });
  //   DB.exec.mockResolvedValue({ recordset: [userData] });
  //   bcrypt.compare.mockResolvedValue(true); 
  //   generateAccessToken.mockReturnValue('testToken');

  //   await loginUser(reqMock, resMock);
  //   expect(resMock.status).toHaveBeenCalledWith(200);
  //   expect(resMock.json).toHaveBeenCalledWith({
  //     status: 'success',
  //     user: {
  //       id: userData.user_id,
  //       u_name: userData.u_name,
  //       is_admin: userData.is_admin,
  //     },
  //     message: 'Login successful',
  //     token: 'testToken',
  //   });

  //   expect(transferAnonCart).toHaveBeenCalledWith(
  //     reqMock.body.session_id,
  //     userData.user_id,
  //     reqMock,
  //     resMock,
  //     expect.any(Function)
  //   );
  // });
  it('should return a 403 response for an incorrect password', async () => {
    const userData = {
      user_id: 1,
      u_name: 'Wonder Woman',
      is_admin: false,
      password: 'hashedPassword',
    };
    validateloginSchema.validate.mockReturnValue({ error: null });
    DB.exec.mockResolvedValue({ recordset: [userData] });
    bcrypt.compare.mockResolvedValue(false); 
    await loginUser(reqMock, resMock);
    expect(resMock.status).toHaveBeenCalledWith(403);
    expect(resMock.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Password is not correct',
    });
  });

 

  it('should return a 500 response for internal server errors', async () => {
    validateloginSchema.validate.mockReturnValue({ error: null });
    DB.exec.mockRejectedValue(new Error('Database error'));
    await loginUser(reqMock, resMock);
    expect(resMock.status).toHaveBeenCalledWith(500);
    expect(resMock.json).toHaveBeenCalledWith({
      status: 'error',
      message: 'Error Trying to log in',
    });
  });

 
});
