import React from 'react';
import { asyncLogin, deleteError, logout } from '../Actions/actionCreators';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Login extends React.Component {

    state = {
        username : null,
        usernameValid: false,
        pw: null,
        pwValid: false
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


    onBlurHandler = (e) => {
        let name = e.target.name
        let val = e.target.value
        const ipRow = document.querySelector(`#ip-${name} .ip-row`)
        const noticeEl = document.querySelector(`#ip-${name} .notice`)
        let valid = false

        if(name === 'username'){
            if(val.length >=3 && val.length <= 20) valid = true
            
        }else if(name === 'pw'){
            if(val.length >= 6 && val.length <=20) valid = true
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

        
        this.setState({
            ...this.state,
            [name]:val
        })
    }

    login = () => {
        let { username, usernameValid, pw, pwValid } = this.state

        if(usernameValid  && pwValid ) {
     
            this.props.asyncLogin(username, pw)
            // console.log(res)
        }
    }

    componentDidMount () {
        this.props.logout()
    }

    componentDidUpdate(prevProps){
        if(this.props.loginSuccess) {
            this.props.history.push('/profile')
        }
        else if(this.props.error.code){
            let {code} = this.props.error
            if(code === 403) alert('Username과 password가 일치하지 않습니다. 다시 시도해주세요.')
            this.props.deleteError()
        }

    }


    render(){


        return (
            <div id="login">
                <div className="form">
                    <div className="title">로그인</div>                
                    <div id="ip-username">
                        <div className="ip-row">
                            <i className="fas fa-user"></i><input placeholder="Full name" type="text" name="username" onFocus={(e) => this.onFocusHandler(e)} onBlur={(e)=> this.onBlurHandler(e)} onChange={(e)=> this.onChangeHandler(e)}></input>
                        </div>   
                        <div className="notice">이름은 3~20자 이하여야 합니다.</div>
                    </div>
                    <div id="ip-pw">
                        <div className="ip-row">
                            <i className="fas fa-lock"></i><input placeholder="Password" type="password" name="pw" onFocus={(e) => this.onFocusHandler(e)} onBlur={(e)=> this.onBlurHandler(e)} onChange={(e)=> this.onChangeHandler(e)}></input>
                        </div>
                        <div className="notice">암호는 6~20자사이로 입력해주세요. 대소문자를 구별합니다.</div>                    
                    </div>
                    <button className="signup-login-btn" onClick={this.login} >로그인 하기</button>       
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        loginSuccess: state.user.loginSuccess,
        error: state.error
    }

}

const mapDispatchToProps = (dispatch) => {
    return {
        asyncLogin: (username, password) => dispatch(asyncLogin(username, password)),
        deleteError: () => dispatch(deleteError()),
        logout: () => dispatch(logout())
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Login)) ;