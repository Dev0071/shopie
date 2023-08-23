import { DB } from "../DBHelpers/index.js";
import bcrypt  from 'bcrypt';
import { registerUser,loginUser,logoutUser } from "./userController.js";

const res = {
    status: jest.fn(() => res),
    json: jest.fn(),
    session: {},
};

jest.mock("../DBHelpers/index.js");

describe("User Controller Tests", () => {

    it ("Should Add User User And return A token", async() => {
        jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce("loremipsumloremipsum");

        const req = {
            body: {
                u_name: "Wonder Woman",
                email: "wonderwoman@gmail.com",
                password: "passtest1"
            }
        }
        
        const response = DB.exec()
    })
   


})