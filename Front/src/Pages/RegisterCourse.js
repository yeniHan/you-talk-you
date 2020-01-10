import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './RegisterCourse.scss';
import { asyncRegisterCourse, resetRegisterCourseSuccess } from '../Actions/actionCreators'

class RegisterCourse extends React.Component{
    state = {
        coursename: null,
        lang: 'KR',
        introduction: null,
        unitTime_val: null,
        unitTime_unit: 'H',
        price_val: null,
        price_currency: 'KR',
        period_val: null,
        period_unit: 'W',
        videoURL: null
    }

    onChangeHandler = (e) => {
        let name = e.target.name
        let val = e.target.value

        if(name === 'coursename' && val.length >= 70){
            val = val.slice(0, 70)
            alert('코스이름은 70자이하까지만 가능합니다.')
        }

        this.setState({
            ...this.state,
            [name]: val
        })
    }

    onClickRegisterBtn = () => {
        console.log('onClickRegisterBtn');
        
        let state = this.state
        let hasInvalidVal = false
        Object.keys(state).every((k) => {
            if((state[k] == null|| state[k] === ''|| state[k]==='0')&&(k !== 'videoURL')){
                hasInvalidVal = true
                return false 
            }
            else return true
        })

        if(hasInvalidVal) alert('필수입력정보를 모두 기입해주십시오.')
        else{
            // 한화, 중국 위안화, 기타 currency => Dollar 값으로 변환
            let {price_currency, price_val, introduction, coursename} = state
            price_val = parseFloat(price_val).toFixed(2);
            
            let price_valCur;
            if(price_currency === 'KR'){
                price_valCur = price_val* 0.00085
            }else if(price_currency === 'CN'){
                price_valCur = price_val * 0.14
            }else if(price_currency === 'OTH'){
                price_valCur = price_val * 1.12            
            }else{
                price_valCur = price_val
            }

            coursename = coursename.replace(/"/gi,`\\"`)
            coursename = coursename.replace(/'/gi,`\\'`)
            introduction = introduction.replace(/"/gi,`\\"`)
            introduction = introduction.replace(/'/gi,`\\'`)

            
            
            this.props.asyncRegisterCourse({
                coursename: coursename, 
                lang: state.lang,
                introduction: introduction,
                unitTime: state.unitTime_val + '/'+ state.unitTime_unit,
                price:  price_valCur,
                period: state.period_val + '/' + state.period_unit,
                videoURL: state.videoURL
            })

            this.setState({
                coursename: null,
                lang: 'KR',
                introduction: null,
                unitTime_val: null,
                unitTime_unit: 'H',
                price_val: null,
                price_currency: 'KR',
                period_val: null,
                period_unit: 'W',
                videoURL: null
            })

            // reset 
            // 1)input fields..
            document.querySelector('input[name=coursename]').value = ''
            document.querySelector('textarea[name=introduction]').value = ''  
            document.querySelector('input[name=unitTime_val]').value = ''
            document.querySelector('input[name=price_val]').value = ''
            document.querySelector('input[name=period_val]').value = ''
            document.querySelector('input[name=videoURL]').value = ''
            
            // 2)selects..
            let opsArr = [ document.querySelectorAll('select[name=lang] option'),
                        document.querySelectorAll('select[name=unitTime_unit] option'),
                        document.querySelectorAll('select[name=price_currency] option'),
                        document.querySelectorAll('select[name=period_unit] option')
                    ]
            
            opsArr.forEach(ops => {
                ops.forEach((op, idx) => {
                    if(idx === 0) op.selected = true
                    else op.selected = false
                })
            })
                      
        }
    }

    render(){
        console.log('state:', this.state);
        console.log('registerCourseSucccess:', this.props.registerCourseSuccess);
        
        
        if(this.props.registerCourseSuccess){
            alert('코스 등록이 성공적으로 이루어졌습니다.')
            this.props.resetRegisterCourseSuccess()
        }
        return (
            <div id="register-course">
                <div className="title">Register a course</div>
                <div className="form">
                    <div className="input-box"><div>코스 이름<span id="crc-name-limit">70자 이하</span></div><input name="coursename" type="text" onChange={this.onChangeHandler} /></div>
                    <div className="input-box">
                        <div>언어 과목</div>
                        <select name="lang" onChange={this.onChangeHandler} >
                            <option value="KR">한국어</option>
                            <option value="EN">영어</option>
                            <option value="CN">중국어</option>
                            <option value="DE">독일어</option>
                            <option value="FR">프랑스어</option>
                        </select>
                    </div>
                    <div className="input-box"><div>소개글</div><textarea name="introduction"  onChange={this.onChangeHandler}/></div>
                    <div className="input-box">
                        <div>강의당 소요시간</div>
                        <input type="number" name="unitTime_val" min="1" max="100" onChange={this.onChangeHandler}/>
                        <select name="unitTime_unit" onChange={this.onChangeHandler}>
                            <option value="H">Hour(s)</option>
                            <option value="M">Minuite(s)</option>
                        </select>
                    </div>
                    <div className="input-box">
                        <div>가격</div>
                        <input type="number" name="price_val" min="1" onChange={this.onChangeHandler}/>
                        <select name="price_currency" onChange={this.onChangeHandler}>
                            <option value="KR">Won</option>
                            <option value="US">Dollar</option>
                            <option value="CN">Renminbi </option>
                            <option value="OTH">Euro</option>
                        </select>
                    </div>
                    <div className="input-box">
                        <div>소요 기간</div>
                        <input type="number" name="period_val" min="1" onChange={this.onChangeHandler} />
                        <select name="period_unit" onChange={this.onChangeHandler}>
                            <option value="W">Week(s)</option>
                            <option value="M">Month(s)</option>
                        </select>
                    </div>
                    <div id="optional-field">
                        <div>Optional</div>
                        <div className="input-box">
                            <div>비디오 소개 영상(Youtube)</div>
                            <div id="instruction">해당 Youtube 비디오 영상을 우(right) 클릭하면 나오는 메뉴에서, 'copyURL' 클릭 후, 붙여넣기하세요. (예시: https://youtu.be/S8yidiLA3422Q)</div>
                            <input name="videoURL" type="text" onChange={this.onChangeHandler}/>
                        </div>
                    </div>
                </div>
                <button onClick= {this.onClickRegisterBtn}>등록하기</button>                
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    registerCourseSuccess: state.user.registerCourseSuccess
})

const mapDispatchToProps = (dispatch) => ({
    asyncRegisterCourse: (course) => dispatch(asyncRegisterCourse(course)),
    resetRegisterCourseSuccess: () => dispatch(resetRegisterCourseSuccess())
})

export default withRouter( connect( mapStateToProps, mapDispatchToProps)(RegisterCourse));