import http from 'k6/http';
import { sleep, check } from 'k6';

const url = 'http://localhost:3000/';

export const options = {
    stages: [
        { duration: '5s', target: 10 },
        { duration: '5s', target: 5 },
      ],
  };

export default async function () {

    let body = {
        email: 'ruth.wamuyu@thejitu.com',
        password: 'joystone2'
    };
    let headers = { 'Content-Type': 'application/json' };

    const loginResponse = await http.asyncRequest('POST', `${url}api/users/login`,JSON.stringify(body), { headers });

    check(loginResponse, {
        'Login successful': (resp) => resp.status === 200
    });

   

    sleep(1);
}