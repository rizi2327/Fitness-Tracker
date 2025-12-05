import axios from 'axios';

const  API= axios.create(
    {
        baseURL:'http://localhost:8080/api/v1'
    }
);

export const UserSignUp = async(data)=>API.post('users/signup',data);
export const UserSignIn = async(data)=>API.post('/users/signin',data);

