import http from 'k6/http';
import { check, sleep } from 'k6';

const BASE_URL = 'http://localhost:3000/api/user/'; 

export const options = {
  stages: [
    { duration: '1m', target: 10 },
     
  ],
};

export default function () {
  
  const register = {
    u_name: 'testuser',
    email: 'test@example.com',
    password: 'testpassword1',

  };

 
  const registerResponse = http.post(`${BASE_URL}/register`, {
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(register)
  });

  check(registerResponse, {
    'Register Status is 201': (r) => r.status === 201,
  });


  sleep(1);


  const login = {
    email: 'test@example.com',
    password: 'testpassword',
  };

  const loginResponse = http.post(`${BASE_URL}/login`,{
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(login)

  });

  check(loginResponse, {
    'Login Status is 200': (r) => r.status === 200,
  });


  sleep(1);
}
