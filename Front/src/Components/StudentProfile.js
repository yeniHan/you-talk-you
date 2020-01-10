import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { asyncEditProfile, addError, resetEditSuccess } from '../Actions/actionCreators'; 
import KRFlag from '../Assets/Imgs/KRFlag.png';
import USFlag from '../Assets/Imgs/USFlag.png';
import FRFlag from '../Assets/Imgs/FRFlag.png';
import DEFlag from '../Assets/Imgs/DEFlag.png';
import CNFlag from '../Assets/Imgs/CNFlag.png';
import noImg from '../Assets/Imgs/noImg.png'
import toggleOn from '../Assets/Imgs/toggle-on.png';
import toggleOff from '../Assets/Imgs/toggle-off.png';
import AvLang from './AvLangs'
import LearningLang from './TeachingLang';
import Tag from './Tag';
import Course from './Course';
import AvLangsPopup from '../Components/AvLangsPopup';
import FileReader from 'filereader';



class StudentProfile extends React.Component {

    
    state = {
        photo: null,  
        photoURL: null,
        nationality: null,
        nationalityFlags: {
            KR: KRFlag,
            US: USFlag,
            CN: CNFlag,
            FR: FRFlag,
            DE: DEFlag
        },
        tags: [],
        newTag: '',
        gender: 'female',
        introduction: '',
        availableLangs: {KR: 0, EN: 0, CN: 0, DE: 0, FR: 0},
        courses: [],
        learningLangs: {KR: 0 , EN: 0 ,  DE: 0,  FR: 0 ,  CN: 0 },
        langNames: {KR: '한국어', EN: '영어',  DE: '독일어',  FR: '프랑스어' ,  CN: '중국어'}
    } 



    onChangeHandler = (e, data = null) =>{
        let name, val;
        if(data) {
            name = 'availableLangs'
            val = data
        }else{
            name = e.target.name
            val = e.target.value
        }

        if(name === 'photo'){
                
            this.setState({
                ...this.state,
                photoURL: window.URL.createObjectURL(e.target.files[0]),
                photo: e.target.files[0]
            })
        }
        else {
            switch(name){

                case 'nationality':
                    if(val === 'no') {
                        document.querySelector('#nationality img').classList.add('no')
                    }
                    else{
                        document.querySelector('#nationality img').classList.remove('no')
                    }
                    break;

                case 'gender':
                    let oppVal = val === 'female'? 'male': 'female';
                    document.querySelector(`label[for=gender-${val}]`).classList.add('checked') 
                    document.querySelector(`label[for=gender-${oppVal}]`).classList.remove('checked')                 
                    break;    


            }

            this.setState({
                ...this.state,
                [name]: val
            })
        }

    }

    toggleAvlPopup = (toggle) => {
        if(toggle === 'on'){
            let {KR, EN, CN, DE, FR } = this.state.availableLangs
            document.querySelector('#student-profile .wrapper').classList.add('show-popup')
            document.querySelector('select[name=avaliableLangs-KR]').value = KR.toString()
            document.querySelector('select[name=avaliableLangs-EN]').value = EN.toString()
            document.querySelector('select[name=avaliableLangs-CN]').value = CN.toString()
            document.querySelector('select[name=avaliableLangs-DE]').value = DE.toString()
            document.querySelector('select[name=avaliableLangs-FR]').value = FR.toString()
        }else{
            document.querySelector('#student-profile .wrapper').classList.remove('show-popup')
        }
    }


    changeTags = (e, delOrAdd) => {
        let { tags } = this.state
        let tag;
        
        if(delOrAdd === 'del'){
            tag = e.target.id.split('-')[3]
            let idx = tags.indexOf(tag)
            tags.splice(idx, 1)
            this.setState({
                ...this.state,
                tags: tags
            })
        }else{
            tag = this.state.newTag
            let newTags= tags.concat([tag])
            // tags.push(tag)
            document.querySelector('input[name=newTag]').value = ''            
            this.setState({
                ...this.state,
                tags: newTags,
                newTag: ''
            })
        }
    }

    editProfile = () => {
        let state = this.state
        let { ID, photo, nationality, gender, tags, introduction, availableLangs} = this.state

        nationality = nationality === 'no'? null: nationality
        tags = tags.join('/')
        gender = gender=== 'male'? 0 : 1 

        introduction = introduction.replace(/"/gi,`\\"`)
        introduction = introduction.replace(/'/gi,`\\'`)


        let newProfile = {
            ID: ID,
            tags: tags,
            nationality: nationality,
            gender: gender,
            availableLangs: availableLangs,
            introduction: introduction,
        }
        if(photo != null) newProfile.photo = photo
        
        this.props.asyncEditProfile(newProfile)
            
    } 


    goToCourseInfo = (courseID) => {
        this.props.history.push(`/course/${courseID}`)
    }


    componentDidMount () {
        //********************************************************************************************************** */
        // 최초 rendering 시 TODO
        // 1. profile 정보 중 EDIT가능 한 fields들을 모두 state에 저장한다. 몇가지 포멧이 필요한 field들은 포멧 후, 저장하기 !!
        // 2. Form에 profile 정보를 입력하기
        //********************************************************************************************************** */
        
        
        // 1. profile 정보 중 EDIT가능 한 fields들을 모두 state에 저장한다. 몇가지 포멧이 필요한 field들은 포멧 후, 저장하기 !!
        
        //포멧이 필요한 fields: tags, availiable langs, learning langs
        let { ID, photo, nationality ,tags, gender,  availableLangs, introduction, courses } = this.props.profile

        //1)tags
        //  "xx/xx/xx"
        let tagsS = tags != null && tags !== ''? tags.split('/'): [] 
                

        //2)Teaching langs

        let learningLangsS = this.state.learningLangs
        if(courses != null){
            courses.forEach(crs => {
                learningLangsS[crs.lang] = learningLangsS[crs.lang] + 1
            })

        }

        gender = gender === 0? 'male': 'female'
        
        this.setState({
            ...this.state,
            ID: ID,
            photoURL: photo != null? `http://localhost:8080/src/profilePhoto/${photo}`: null,
            tags: tagsS,
            gender: gender ,
            nationality: nationality == null? 'no': nationality,
            availableLangs: {
                KR:  availableLangs.KR == null? 0 : availableLangs.KR,
                EN:  availableLangs.EN == null? 0 : availableLangs.EN,
                CN:  availableLangs.CN == null? 0 : availableLangs.CN,
                FR:  availableLangs.FR == null? 0 : availableLangs.FR,
                DE:  availableLangs.DE == null? 0 : availableLangs.DE
            },
            courses: courses == null? [] : courses,
            introduction: introduction == null? '' : introduction,
            learningLangs: learningLangsS
        })
        
        
        //2. Form 에 profile정보 입력하기
        //1) 국적
        // let nationalityEl = document.getElementById('sel-nationality')
        // nationalityEl.value = nationality == null ? 'no': nationality
        // // //flag img show
        // if(nationality != null) {
        //     document.getElementById(`${nationality}-flag`).style.display = 'block'
        // }


        //The fields which I can't set by setting the state 
        // 1) 성별
        document.querySelector(`label[for=gender-${gender}]`).classList.add('checked')

        //2) introduction
        let introductionEl = document.querySelector('textarea[name=introduction]')
        
    }



    render(){

        //
        if(this.props.editSuccess === true) {
            alert('수정이 성공적으로 이루어졌습니다.')
            this.props.resetEditSuccess()
        }
        
        let { tags, introduction, availableLangs, courses, learningLangs, langNames} = this.state 
        let tagEls = tags.map((tag, idx) => {
            return <Tag key={idx} tag={tag} changeTags={this.changeTags}/>
        })

        let availableLangEls = Object.keys(availableLangs).map((langCode, idx) => {
            if(availableLangs[langCode] !== 0) {
                return <AvLang key={idx} langName={langNames[langCode]} level={availableLangs[langCode]}/>
            }
        })

        let tlKeys = Object.keys(learningLangs)
        
        let tlEls = tlKeys.map((k, i) => {
            if(learningLangs[k] !== 0) return <LearningLang key={langNames[k] + learningLangs[k]} langName={langNames[k]} crsNum={learningLangs[k]}/>  
        })

        let coursesEl = courses.map(crs => {
            return <Course langName={langNames[crs.lang]} coursename={crs.coursename} courseID={crs.ID} goToCourseInfo={this.goToCourseInfo}/>
        })
        

        return (
            <div id="student-profile">
                <div id="title">My Profile</div>
                <div id="columns">
                    <div id="column-1">
                        <div id="photo">
                            <form>
                            <img src={this.state.photoURL == null ? noImg : this.state.photoURL}/>
                            <input id="photo-input" type="file" name="photo" accept="image/*" onChange={this.onChangeHandler}/>
                            </form>
                        </div>
                        <div id="username">Student, {this.props.profile.username}</div>
                        <div id="nationality">
                            <div  className="field-name">국적</div>
                            <img id="KR-flag" src={this.state.nationalityFlags[this.state.nationality]}/>
                            <select name="nationality" id="sel-nationality" value={this.state.nationality} onChange={this.onChangeHandler}>
                                <option value="no">미선택</option>
                                <option value="KR">대한민국</option>
                                <option value="US">미국</option>
                                <option value="CN">중국</option>
                                <option value="FR">프랑스</option>
                                <option value="DE">독일</option>
                            </select>
                        </div>               
                        <div id="tags">
                            <div className="field-name">태그</div>
                            <div id="condition">10개까지 가능</div>
                            <div><div id="tags-list">{tagEls}</div>
                            <input name="newTag" type="text" placeholder="Add a new tag" onChange={this.onChangeHandler} value={this.state.newTag}/>
                            <i class="fas fa-plus-circle ic-add" onClick={(e) => this.changeTags(e, 'add')}></i></div>
                        </div>         
                    </div>
                    <div id="column-2">
                        <div id="gender">
                            <div className="field-name">성별</div>
                            <label for="gender-male">남성</label>
                            <input id="gender-male" name="gender" type="radio" value="male" onChange={this.onChangeHandler}/>
                            <label for="gender-female">여성</label>                            
                            <input id="gender-female" name="gender" type="radio" value="female" onChange={this.onChangeHandler}/>
                        </div>
                        <div id="introduction">
                            <div className="field-name">자기 소개</div>
                            <textarea name="introduction" value={introduction} onChange={this.onChangeHandler}/>
                        </div>
                        <div id="available-langs">
                            <div className="field-name">사용 가능한 언어<button id="avl-edit-btn" onClick={()=>this.toggleAvlPopup('on')}>수정하기</button></div>
                            <div id="available-langs-list">{availableLangEls}</div>
                        </div>
                        <div id="learning-langs">
                            <div className="field-name">수강 중인 언어</div>
                            <div id="learning-langs-list">{tlEls}</div>
                        </div>

                        <div id="courses">
                            <div className="field-name">수강 중인 코스</div>  
                            <div id="courses-list">{coursesEl}</div>                  
                        </div>                  
                    </div>
                </div>
                <div id="btns">
                    <button id="edit-btn" onClick={this.editProfile}>수정하기</button>
                </div>
                <AvLangsPopup availableLangs={availableLangs} onChangeHandler={this.onChangeHandler} toggleAvlPopup={this.toggleAvlPopup}/>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    profile: state.user.profile,
    editSuccess: state.user.editSuccess
})

const mapDispatchToProps = (dispatch) => ({
    asyncEditProfile: (newProfile) => dispatch(asyncEditProfile(newProfile)),
    addError: (msg, code) => dispatch(addError(msg, code)),
    resetEditSuccess: () => dispatch(resetEditSuccess())
})

export default withRouter( connect (mapStateToProps, mapDispatchToProps)(StudentProfile));








