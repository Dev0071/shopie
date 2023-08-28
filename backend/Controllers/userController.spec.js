import { DB } from "../DBHelpers/index.js";
import bcrypt  from 'bcrypt';
import { registerUser,loginUser,logoutUser } from "./userController.js";

const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    session: {},
};

jest.mock("../DBHelpers/index.js");
jest.mock('joi');
describe("User Controller Tests", () => {
    it ("Should Add User User And return A token", async() => {
        jest.mock('uuid', () => ({
            v4: jest.fn(() => 'mocked-user-id'),
        }));
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("loremipsumloremipsum");
        jest.spyOn(joi).mockResolvedValueOnce()
        const req = {
            body: {
                u_name: "Wonder Woman",
                email: "wonderwoman@gmail.com",
                password: "passtest1",
                session_id: "232"
            }
        }
        
        jest.mock('../DBHelpers/index.js', () => ({
            exec: jest.fn(() => ({
              recordset: [{ user_id: loremipsumloremipsum, u_name: 'Wonder Woman', is_admin: false }],
              rowsAffected: [1],
            }))
        }),

        await registerUser(req,res),
        expect(res.status).toHaveBeenCalledWith(201)

    )
       
       
    })




});
        