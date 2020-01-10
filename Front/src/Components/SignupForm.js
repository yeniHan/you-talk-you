import React from 'react';

const SignupForm = (props) => {
    let {onFocusHandler, onBlurHandler, onChangeHandler, signup} = props

    return (
        <div className="form">
            <div className="title">등록</div>                
            <div id="ip-username">
                <div className="ip-row">
                    <i className="fas fa-user"></i><input placeholder="Full name" type="text" name="username" onFocus={(e) => onFocusHandler(e)} onBlur={(e)=>onBlurHandler(e)} onChange={(e)=> onChangeHandler(e)}></input>
                </div>   
                <div className="notice">3~20자 이하 특수문자 불포함</div>
            </div>
            <div id="ip-email">
                <div className="ip-row">
                    <i className="fas fa-envelope"></i><input placeholder="Email" type="text" name="email" onFocus={(e) => onFocusHandler(e)} onBlur={(e)=>onBlurHandler(e)} onChange={(e)=> onChangeHandler(e)}></input>
                </div>
                <div className="notice">올바른 이메일 주소를 입력해주세요.</div>
            </div>
            <div id="ip-pw">
                <div className="ip-row">
                    <i className="fas fa-lock"></i><input placeholder="Password" type="password" name="pw" onFocus={(e) => onFocusHandler(e)} onBlur={(e)=>onBlurHandler(e)} onChange={(e)=> onChangeHandler(e)}></input>
                </div>
                <div className="notice">6~20자이하. 2개이상의 숫자와 2개이상의 특수문자 포함.</div>
            </div>
            <div id="ip-user-type">
                <div><label  name="userType" htmlFor="ut-student">Student</label><input name="userType" id="ut-student" type="radio" value="student" onChange={(e)=> onChangeHandler(e)}></input></div>
                <div><label  name="userType" htmlFor="ut-teacher">Teacher</label><input name="userType" id="ut-teacher" type="radio" value="teacher" onChange={(e)=> onChangeHandler(e)}></input></div>                        
            </div>
            <button className="signup-login-btn" onClick={signup} >등록 하기</button>       
        </div>
    )
}   

export default SignupForm;