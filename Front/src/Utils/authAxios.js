import { addError } from "../Actions/actionCreators";
import axios from 'axios';
import ExpiredStorage from 'expired-storage';


const authAxios = ( options, dispatch, successFunction, dataFieldsFromS = [], dataFromA = [], newAccessToken= null, newRefreshToken = null) => {
 
    let storage = new ExpiredStorage()
    
    
    let accessToken = newAccessToken == null? storage.getItem('access_token') : newAccessToken
    let refreshToken = newRefreshToken == null? storage.getItem('refresh_token') : newRefreshToken

    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${accessToken}`
    }

    if(accessToken != null ){

        axios(options)
        .then(res => {
            
            var data = res.data
            //If the access token was expired when the serer tries to authorize the req with the tokens,
            // even though it was not expired when it was sent by the front app.

            if(data.error != null){
                dispatch(addError(data.message, data.code))
            }else{
                //Send the values to the successFunction
                dataFieldsFromS.push('hasNewMsg')                
                let values = []
                dataFieldsFromS.forEach(function( field ){
                    values.push(data[field])
                })

                values = values.concat(dataFromA)
                
                
                dispatch(successFunction(...values))
            }
        })
        .catch(err => {
    console.log('axios err.responese:', err.response);
                
            if(err.response){
                if(err.response.status === 403) return authAxios(options, dispatch, successFunction, dataFieldsFromS, dataFromA)  
                dispatch(addError(err.response.data.message, err.response.data.code !== undefined ?  err.response.data.code: 'Net1'))
                console.log('err has response!');
                
            }else{
                dispatch(addError(err.message !== undefined? err.message: err.toString(), err.code !== undefined? err.code: 'Net1'))
            }
        })

    }else{
        let optionsRef = {
            url: 'http://localhost:8080/auth/refresh',
            method: 'POST',
            headers: {
                'Content-Type': "application/x-www-form-urlencoded"
            },
            data: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=client&client_secret=secret`
        }

        axios(optionsRef)
        .then(res => {
            var data = res.data
            if(data.error) { 
                dispatch(addError(data.message, data.code))
            }else{
                let newAccessToken = data.access_token
                let newRefreshToken = data.refresh_token
                storage.setItem('access_token', newAccessToken, data.expires_in)
                storage.setItem('refresh_token', newRefreshToken)                
                // options.headers.set('Authorization', 'Bearer ' + accessToken)
                return authAxios(options, dispatch, successFunction, dataFieldsFromS, dataFromA, newAccessToken, newRefreshToken)
            }
        })
        .catch(err => {
    console.log('axios err.response:', err.response);
    
            if(err.response){
                if(err.response.status === 403) dispatch(addError(err.response.data.message, 403))  
                dispatch(addError(err.response.data.message, err.response.data.code !== undefined ?  err.response.data.code: 'Net1'))
            }
            else{
                dispatch(addError(err.message !== undefined? err.message: err.toString(), err.code !== undefined? err.code: 'Net1'))
            }
        })

    }

}


export default authAxios;