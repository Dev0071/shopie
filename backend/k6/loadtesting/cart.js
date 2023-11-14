import http from 'k6/http';
import {sleep} from 'k6';


const url = 'http://localhost/3000/api'

export const options = {
    vus: 20,
    duration: '30s'
};

export default function (){
    http.get(`${url}/cart/s/ce570a49-8ed5-46ac-9523-020128b949a`)
    sleep(1);
    
}

export function removeCartItem(){
    const body = {
        session_id: "12343"
    }
    const headers = {
        'Content-Type': 'application/json',
    };
    
    const response = http.post(`${url}/cart/item/ce570a49`, JSON.stringify(body), { headers });

    check(response, {
        'Remove Item successful': (resp) => resp.status === 200
    });

}

export function addItemToCart(){
    const body = {
        session_id: "12343"
    }
    const headers = {
        'Content-Type': 'application/json',
    };
    
    const response = http.post(`${url}/cart/ce570a49`, JSON.stringify(body), { headers });

    check(response, {
        'Remove Item successful': (resp) => resp.status === 200
    });

}

export function removeallSuchItemsFromCart(){
    const body = {
        session_id: "12343"
    }
    const headers = {
        'Content-Type': 'application/json',
    };
    
    const response = http.post(`${url}/cart/item/ce570a49`, JSON.stringify(body), { headers });

    check(response, {
        'Remove Item successful': (resp) => resp.status === 200
    });

}