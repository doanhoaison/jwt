import axio from 'axios';
import jwt_decode from 'jwt-decode';

//
import setAuthToken from '../setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER } from './types';
//
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
        const { token } = res.data;
        localStorage.setItem("jwtToken", token);
        setAuthToken(token);
        const decoded = jwt_decode(token);
        console.log(decoded);
        dispatch(setCurrentUser(decoded));
    })
    .catch(error => {
        console.log(error);
        dispatch({
            type: GET_ERRORS,
            payload: error.response.data
        })
    })
}

export const setCurrentUser = decoded => {
    return {
        type: SET_CURRENT_USER,
        payload: decoded
    }
}

export const logoutUser = (history) => dispatch => {
    localStorage.removeItem('jwtToken');
    setAuthToken(false);
    dispatch(setCurrentUser({}));
    history.push('/login');
    
}