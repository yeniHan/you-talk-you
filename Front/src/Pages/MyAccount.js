import React from 'react'; 
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { asyncGetAccount, asyncEditAccount, deleteError, resetEditAccountSuccess} from '../Actions/actionCreators';
import './MyAccount.scss';
import Fetching from '../Components/Fetching';


class MyAccount extends React.Component{

    state = {
        email: null,
        emailValid: false,
        oldPw: null,
        oldPwValid: true,
        newPw: null,
        newPwValid: false,
        newPwRepeat: null,
        newPwRepeatValid: false,
    }

    onFocusHandler = (e) => {
        let name = e.target.name
        const ipRow = document.querySelector(`#ip-${name} .ip-row`) 
        
        
        if(ipRow.classList.length === 1){
            ipRow.classList.add('focus')
            if(name !== "oldPw") document.querySelector(`#ip-${name} .notice`).classList.add('focus')
        }else{
            let thisClass = ipRow.classList.contains('invalid')? 'invalid' : 'valid'
            ipRow.classList.replace(thisClass,'focus')
            if(name !== "oldPw") document.querySelector(`#ip-${name} .notice`).classList.replace('invalid', 'focus')          
        }

    }

    chkPW = ( val) => {
        let tmpVal;
        let spcialRex = /[!"#$%&'()*+,-./:;<=>?@[\\\]\\\^_`{\\\|}~]/g
        tmpVal = val.replace(spcialRex, '*')


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



    }

    onBlurHandler = (e) => {
        let name = e.target.name
        let val = e.target.value
        const ipRow = document.querySelector(`#ip-${name} .ip-row`)
        let valid = false


        if(name === 'email'){
            valid = val.split('').indexOf('@') === -1 ? false: true
            
        }else if(name === 'newPw'){
            valid = this.chkPW(val)
        }else if(name === 'newPwRepeat'){
            valid = this.state.newPw === val ? true: false
        }

        
        if(name !== "oldPw"){
            const noticeEl = document.querySelector(`#ip-${name} .notice`)
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
    }


    onChangeHandler = (e) => {
        let name = e.target.name
        let val = e.target.value

        this.setState({
            ...this.state,
            [name]:val
        })
    }


    onClickEditBtn = () => {
        let {email,
        emailValid,
        oldPw,
        newPw,
        newPwValid,
        newPwRepeat,
        newPwRepeatValid} = this.state
        email = email === '' || email == null? null :email
        oldPw = oldPw === '' || oldPw == null ? null: oldPw
        newPw = newPw === '' || newPw == null ? null: newPw
        let {asyncEditAccount} = this.props
        if(email == null && oldPw == null && newPw == null){
            alert('수정하실 정보를 기입해주세요.')
        }
        else if(email != null && oldPw == null && newPw == null){
            asyncEditAccount( email, null, null)               
        }else if(email == null && oldPw != null & newPw != null){
            if(newPwValid  && newPwRepeatValid ) {
                asyncEditAccount(null,oldPw, newPw)           
            }
        }
        else{
            if(newPwValid && emailValid && newPwRepeatValid ) {
                asyncEditAccount(email,oldPw, newPw)           
            }
        }


    }

    componentDidMount(){
        this.props.asyncGetAccount()
    }

    render() {
        console.log('sate:', this.state);
        
        let { code, editAccountSuccess, account, deleteError, resetEditAccountSuccess} = this.props
        if(code === 'Acc'){
            alert('기존 패스워드가 일치하지 않습니다.')
            deleteError()
        }
        if(editAccountSuccess){
            alert('계정정보가 성공적으로 수정되었습니다.')
            resetEditAccountSuccess()
        }
        if(account){
            return (
                <div id="my-account">
                    
                    <div id="title">Edit you account</div>
                    <div id="form">
                        <div id="instruction">For the field which you don't want to edit, leave it blank.</div>
                        <div id="ip-email">
                            <div className="ip-row">
                                <i className="fas fa-envelope"></i><input placeholder={account.email} type="text" name="email" onFocus={(e) => this.onFocusHandler(e)} onBlur={(e)=>this.onBlurHandler(e)} onChange={(e)=> this.onChangeHandler(e)}></input>
                            </div>
                        <div className="notice">올바른 이메일 주소를 입력해주세요.</div>
                        </div>
                        <div id="ip-oldPw">
                            <div className="ip-row">
                                <i className="fas fa-lock"></i><input placeholder="Current password" type="password" name="oldPw" onFocus={(e) => this.onFocusHandler(e)} onBlur={(e)=>this.onBlurHandler(e)} onChange={(e)=> this.onChangeHandler(e)}></input>
                            </div>
                        </div>
                        <div id="ip-newPw">            
                            <div className="ip-row">
                                <i className="fas fa-lock"></i><input placeholder="New password" type="password" name="newPw" onFocus={(e) => this.onFocusHandler(e)} onBlur={(e)=>this.onBlurHandler(e)} onChange={(e)=> this.onChangeHandler(e)}></input>
                            </div>
                            <div className="notice">6~20자이하. 2개이상의 숫자와 2개이상의 특수문자 포함.</div>
                        </div>
                        <div id="ip-newPwRepeat">
                            <div className="ip-row">
                                <i className="fas fa-lock"></i><input placeholder="Confirm the new password" type="password" name="newPwRepeat" onFocus={(e) => this.onFocusHandler(e)} onBlur={(e)=>this.onBlurHandler(e)} onChange={(e)=> this.onChangeHandler(e)}></input>
                            </div>
                            <div className="notice">새로운 패스워드를 다시 한번 입력해주세요.</div>
                        </div>
                        <button id="edit-btn" onClick={this.onClickEditBtn} >Edit</button>    

                    </div>
                </div>
            )
        }else{
            return (
                <div>
                    <Fetching/>
                </div>
            )
        }
    }
}


const mapStateToProps = (state) => {
    return {
        editAccountSuccess: state.user.editAccountSuccess,
        code: state.error.code,
        account: state.user.account
    }
}
const mapDispatchToProps = (dispatch) => {
    return {
        asyncGetAccount: () => dispatch(asyncGetAccount()),
        asyncEditAccount: (email, oldPw, newPw) => dispatch(asyncEditAccount(email, oldPw, newPw)),
        deleteError: () => dispatch(deleteError()),
        resetEditAccountSuccess: () => dispatch(resetEditAccountSuccess())
    }
}

export default connect(mapStateToProps, mapDispatchToProps )(MyAccount);