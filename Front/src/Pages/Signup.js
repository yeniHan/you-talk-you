import React from 'react';
import './SignupLogin.scss';
import { asyncSignup, deleteError } from '../Actions/actionCreators';
import { connect } from 'react-redux';
import SignupForm from '../Components/SignupForm';
import SignupSuccess from '../Components/SignupSuccess';


class SignUp extends React.Component{

    state = {
        username: null,
        usernameValid: false,
        email: null,
        emailValid: false,
        pw: null,
        pwValid: false,
        userType: 'student'
    }

    onFocusHandler = (e) => {
        let name = e.target.name
        const ipRow = document.querySelector(`#ip-${name} .ip-row`) 
        const noticeEl = document.querySelector(`#ip-${name} .notice`)
        
        if(ipRow.classList.length === 1){
            ipRow.classList.add('focus')
            noticeEl.classList.add('focus')
        }else{
            let thisClass = ipRow.classList.contains('invalid')? 'invalid' : 'valid'
            ipRow.classList.replace(thisClass,'focus')
            let thisClass_ip = noticeEl.classList.replace('invalid', 'focus')          
        }


    }

    chkPWorUserame = (isPw, val) => {
        let tmpVal;
        let spcialRex = /[!"#$%&'()*+,-./:;<=>?@[\\\]\\\^_`{\\\|}~]/g
        tmpVal = val.replace(spcialRex, '*')


        if(isPw === true){
            let countS = 0
            let countN = 0
            let numRex = /[0-9]/g        
            tmpVal = tmpVal.replace(numRex, '#')
            
            tmpVal.split('').forEach(char=>{
                if(char === '*') countS ++
                else if(char === '#') countN ++
            })

            console.log('tmpVal:', tmpVal, 'countN:',countN, 'countS:',countS);
            

            if(val.length < 6 || val.length >20) {
                console.log('Too short Too long');
                
                return  false
            }
            if(countS <2) {
                console.log('special chars');
                
                return  false
            }if(countN <2) {
                console.log('nums');
                
                return false            
            }
    
            return true

        }else{
            let countS = 0            
            tmpVal.split('').forEach(char=>{
                if(char === '*') countS ++
            })
            console.log('tmpVal:', tmpVal, 'countS:',countS);

            if(val.length <3 || val.length > 20) {
                console.log('Too short Too long');
                
                return false
            }
            if(countS > 0) {
                console.log('special chars');
                
                return false
            }
    
            return true
        }

    }

    onBlurHandler = (e) => {
        let name = e.target.name
        let val = e.target.value
        const ipRow = document.querySelector(`#ip-${name} .ip-row`)
        const noticeEl = document.querySelector(`#ip-${name} .notice`)
        let valid = false

        if(name === 'username'){
            valid = this.chkPWorUserame(false, val)
            
        }else if(name === 'email'){
            valid = val.split('').indexOf('@') === -1 ? false: true
            
        }else if(name === 'pw'){
            valid = this.chkPWorUserame(true, val)
        }

        noticeEl.classList.remove('focus')
        

        if(valid){
            let thisClass = ipRow.classList.remove('focus') 
            ipRow.classList.add('valid')
      
        }else{
            ipRow.classList.add('invalid')
            noticeEl.classList.add('invalid')
        }

    
        let state = this.state
        state[`${name}Valid`] = valid? true: false
        this.setState(state)
    }


    onChangeHandler = (e) => {
        let name = e.target.name
        let val = e.target.value

        if(name === 'userType') {
            document.querySelector(`label[for=ut-${val}]`).classList.add('selected')
            let opp = val === 'student'? 'teacher': 'student'
            document.querySelector(`label[for=ut-${opp}]`).classList.remove('selected')
        }
        this.setState({
            ...this.state,
            [name]:val
        })
    }


    signup = () => {
        let { username, usernameValid, email, emailValid, pw, pwValid, userType } = this.state

        if(usernameValid && emailValid && pwValid ) {
     
            this.props.asyncSignup({
                username: username,
                email: email,
                password: pw,
                userType: userType
            })
            // console.log(res)

            
        }

    }

    

    render(){
        let { error, deleteError, signupSuccess } = this.props

        if(error.code != null){
            if(error.code ==="Si1"){
                alert('입력하신 정보가 유효하지 않습니다. 다시 입력해주세요.')
            }
            else if(error.code === "Si2"){
                alert('이미 존재하는 username입니다. 다른 username을 사용해주세요.')
            } 
            deleteError()                                                                    
        }
        
        if(signupSuccess){
            return(
                <div id="signup">
                    <SignupSuccess/>
                </div>
            )
        }
        
        return (
            <div id="signup">
                <SignupForm onBlurHandler={this.onBlurHandler} onFocusHandler={this.onFocusHandler} onChangeHandler={this.onChangeHandler} signup={this.signup}/>
            </div>
        )
        

    }
    
}


const mapStateToProps = (state) => {
    return {
        error: state.error,
        user: state.user,
        signupSuccess: state.user.signupSuccess
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        asyncSignup: (user) => dispatch(asyncSignup(user)),
        deleteError: () => dispatch(deleteError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps )(SignUp);