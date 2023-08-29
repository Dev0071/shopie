import http from 'k6/http';
import { sleep, check } from 'k6';

const url = 'http://localhost:3000/';

export const options = {
    stages: [
        { duration: '5s', target: 100 },
        { duration: '5s', target: 50 },
      ],
  };

export default async function () {

    const productsRes = await http.asyncRequest('GET', `${url}api/products`);

    check(productsRes, {
        'Register Status is 200': (r) => r.status === 200,
      });
    

   
   

    sleep(1);
}