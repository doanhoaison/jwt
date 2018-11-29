import axio from 'axios';
import { GET_ERRORS } from './types';
export const registerUser = (user, history ) => dispatch =>{
    console.log('register action');
    axio.post('/api/user/register', user)
        .then(res => {
            console.log(res);
            history.push('/login');
        })
        .catch(err => {
            console.log(err.response);
            dispatch({
                type: GET_ERRORS,
                payload: err.response.data
            })
        })
}

export const loginUser = (user) => dispatch => {
    axio.post('/api/user/login', user)
    .then(res => {
        console.log(res.data)
    })
    .catch(error => {
        dispatch({
            type: GET_ERRORS,
            payload: error.response.data
        })
    })
}