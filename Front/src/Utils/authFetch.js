import { addError } from "../Actions/actionCreators";
import ExpiredStorage  from 'expired-storage';

const authFetch = (url, body, dispatch, addError, successFunction, storage, dataFields = null,contentType = null, newAccessToken= null, newRefreshToken = null) => {
    let storagi = new ExpiredStorage()
    console.log('storage:', storagi );
    
    console.log('auth fetch body:', typeof body);
    
    let accessToken = newAccessToken == null? storage.getItem('access_token') : newAccessToken
    let refreshToken = newRefreshToken == null? storage.getItem('refresh_token') : newRefreshToken
    
    let headers = new Headers({
        "Content-Type": contentType == null? "application/json": contentType,
        "Authorization": `Bearer ${accessToken}`
    })
    let options = {
        method: "POST",
        headers: headers, 
        body: body
    }

    if(accessToken != null ){
        console.log('protected rcs req, accessToken:', accessToken)



        fetch(url, options)
        .then(res => {
            console.log('protected rcs req 1st .then()')
            return res.json()
        })
        .then(obj => {
            //If the access token was expired when the serer tries to authorize the req with the tokens,
            // even though it was not expired when it was sent by the front app.
            if(obj.code === 402){
                return authFetch(url, body, dispatch, addError, successFunction, storage,  dataFields, contentType)
            }
            else if(obj.error != null){
                dispatch(addError(obj.message, obj.code))
            }else{
                //Send the values to the successFunction
                let values = []
                if(dataFields){
                    dataFields.forEach(function( field ){
                        values.push(obj[field])
                    })
                }
                console.log('values:', values)
                dispatch(successFunction(...values))
            }
        })
        .catch(err => {
            console.log('Here catch in authFetch() err:', err);
            dispatch(addError('Network error', 'Net1'))
        })

    }else{
        console.log('refresh grant req')
        let optionsRef = {
            method: 'POST',
            headers: new Headers({
                "Content-Type": "application/x-www-form-urlencoded"
            }),
            body: `grant_type=refresh_token&refresh_token=${refreshToken}&client_id=client&client_secret=secret`
        }

        fetch('http://localhost:8080/auth/refresh', optionsRef)
        .then(res => {
            console.log('refresh grant req has been sent')
            return res.json()
        })
        .then(tokens => {
            console.log('refresh gran req, tokens:', tokens)
            if(tokens.error) { 
                dispatch(addError(tokens.message, tokens.code))
            }else{
                let newAccessToken = tokens.access_token
                let newRefreshToken = tokens.refresh_token
                storage.setItem('access_token', newAccessToken, tokens.expires_in)
                storage.setItem('refresh_token', newRefreshToken)                
                // options.headers.set('Authorization', 'Bearer ' + accessToken)
                return authFetch(url, body, dispatch, addError, successFunction, storage, dataFields, contentType, newAccessToken, newRefreshToken)
            }
        })
        .catch(err => {
            dispatch(addError('Network Error', 'Net1'))
        })

    }

}


export default authFetch;