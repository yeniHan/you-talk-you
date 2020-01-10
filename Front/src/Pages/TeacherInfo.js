import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import authAxios from '../Utils/authAxios';
import noVideo from '../Assets/Imgs/noVideo.png';

import './TeacherInfo.scss';
// import {} from '../Actions/ActionCreators';

import KRFlag from '../Assets/Imgs/KRFlag.png';
import USFlag from '../Assets/Imgs/USFlag.png';
import FRFlag from '../Assets/Imgs/FRFlag.png';
import DEFlag from '../Assets/Imgs/DEFlag.png';
import CNFlag from '../Assets/Imgs/CNFlag.png';
import noImg from '../Assets/Imgs/noImg.png';

import AvLang from '../Components/AvLangs'
import TeachingLang from '../Components/TeachingLang';
import Tag from '../Components/Tag';
import CourseIN from '../Components/CourseIN';
import Fetching from '../Components/Fetching';
import Score from '../Components/Score';
import ReviewPopup from '../Components/ReviewPopup';
import Review from '../Components/Review';




class TeacherInfo extends React.Component{
    state = {
        nationalityFlags: {
            KR: KRFlag,
            US: USFlag,
            CN: CNFlag,
            FR: FRFlag,
            DE: DEFlag
        },
        experienceStrs: ['없음', '1년 미만', '1 ~3년', '3 ~ 5년', '5년 이상'],
        teacher: null,
        teachingLangs: {KR: 0 , EN: 0 ,  DE: 0,  FR: 0 ,  CN: 0 },        
        langNames: {KR: '한국어', EN: '영어',  DE: '독일어',  FR: '프랑스어' ,  CN: '중국어'}        
    }

    goToCourseInfo = (courseID) => {
        this.props.history.push(`/course/${courseID}`)
    }

    toggleReviewPopup = (toggle) => {
        if(toggle === 'on'){
            document.querySelector('#teacher-info .wrapper').classList.add('show-popup')
        }else{
            document.querySelector('#teacher-info .wrapper').classList.remove('show-popup')
            this.asyncGetTeacher(this.state.teacher.ID)
        }
    }

    asyncGetTeacher =  (teacherID) => {
        authAxios({
            url: `http://localhost:8080/info/teacher/${teacherID}`,
            method:'GET',
            headers: {'Content-Type': 'application/json'},
            data: {
                teacherID: teacherID
            }
            }, this.props.dispatch,  
             (teacher) => {
            
                //포멧이 필요한 fields: tags, availiable langs, teaching langs, gender, intro_video
                let { ID, username, photo, nationality , tags, gender, professional, availableLangs, experience, introduction, courses, intro_video, avr_score, reviews} = teacher
                //1)tags
                //  "xx/xx/xx"
                let tagsS = tags != null && tags !== ''? tags.split('/'): [] 
                //2)Teaching langs
                let teachingLangsS = this.state.teachingLangs
                if(courses != null){
                    courses.forEach(crs => {
                        teachingLangsS[crs.lang] = teachingLangsS[crs.lang] + 1
                    })
                }

                //3) gender                

                //4) Intro video
                if(intro_video != null){
                    let videoURLArr = intro_video.split('/')
                    let videoID = videoURLArr[videoURLArr.length - 1]
                    intro_video = `http://www.youtube.com/embed/${videoID}`
                }
                
                this.setState({
                    ...this.state,
                    teacher: {
                        ID: ID,
                        username: username,
                        photoURL: photo != null? `http://localhost:8080/src/profilePhoto/${photo}`: null,
                        tags: tagsS,
                        gender: gender ,
                        nationality: nationality == null? 'no': nationality,
                        professional: professional,
                        experience: experience == null? 0: experience,
                        availableLangs: {
                            KR:  availableLangs.KR == null? 0 : availableLangs.KR,
                            EN:  availableLangs.EN == null? 0 : availableLangs.EN,
                            CN:  availableLangs.CN == null? 0 : availableLangs.CN,
                            FR:  availableLangs.FR == null? 0 : availableLangs.FR,
                            DE:  availableLangs.DE == null? 0 : availableLangs.DE
                        },
                        courses: courses == null? [] : courses,
                        introduction: introduction == null? '' : introduction,
                        teachingLangs: teachingLangsS,
                        introVideo: intro_video,
                        avrScore: avr_score,
                        reviews: reviews
                    }
                })
                return {type: null}
            }, ['teacher'])
    }

    componentDidMount () {
        let {match: {params}} = this.props

        let teacherID = params.teacherID
        this.asyncGetTeacher(teacherID)
        
    }

    render() {
        
        let { teacher } = this.state
        if(teacher != null){
            let { ID, username, availableLangs, avr_score, courses, experience, gender, introduction, nationality , photoURL, professional, tags, teachingLangs, introVideo, avrScore, reviews} = this.state.teacher
            let { experienceStrs, langNames } = this.state


            let tagEls = tags.map((tag, idx) => {
                return <div className="tag">{tag}</div>
            })

            let availableLangEls = Object.keys(availableLangs).map((langCode, idx) => {
                if(availableLangs[langCode] !== 0) {
                    return <AvLang key={idx} langName={langNames[langCode]} level={availableLangs[langCode]}/>
                }
            })


            let tlKeys = Object.keys(teachingLangs)

            let tlEls = tlKeys.map((k, i) => {
                if(teachingLangs[k] !== 0) return <TeachingLang key={langNames[k] + teachingLangs[k]} langName={langNames[k]} crsNum={teachingLangs[k]}/>  
            })

            let coursesEl = courses.map(crs => {
                return <CourseIN goToCourseInfo={this.goToCourseInfo} langName={langNames[crs.lang]} coursename={crs.coursename} courseID={crs.ID} />
            })

            let reviewEls = reviews.map(review => {
                return <Review score={review.score} review={review.review} writer={review.writer}/>
            })
            let introVideoEl = introVideo == null ? <div id="intro-video"><img src={noVideo} width="320px"/></div> : <div id="intro-video"><iframe width="610" height="341" src={introVideo}></iframe></div>            

            return (
                <div id="teacher-info">
                        {introVideoEl}
                        <div id="photoNinfo">
                            <img id="photo" src={photoURL == null ? noImg : photoURL}/>
                            <div id="info">
                                <div id="professional">{professional === 1? 'PROFESSIONAL TEACHER': 'COMMUNITIY TEACHER' }</div>
                                <div id="usernameNflag"><div id="username">Teacher, {username}</div> <img id="flag-img" src={this.state.nationalityFlags[nationality]}/></div>
                                <div id="tag-list">{tagEls}</div>
                                <div id="gender">
                                    <div className="field-name">GENDER</div><div>{gender === 0? 'Male': 'Female'}</div>
                                </div>
                                <div id="experience">
                                    <div className="field-name">EXPREIENCE</div><div>{experienceStrs[experience]}</div>
                                </div>
                            </div>
                        </div>
            
                        <div id="introduction">
                            <div className="field-name">SELF INTRODUCTION</div>
                            <div>{introduction}</div>
                        </div>
                        <div id="available-langs">
                            <div className="field-name">ALSO SPEAKS..</div>
                            <div id="available-langs-list">{availableLangEls}</div>
                        </div>
                        <div id="teaching-langs">
                            <div className="field-name">TEACHES..</div>
                            <div id="teaching-langs-list">{tlEls}</div>
                        </div>  
                        <div id="courses">
                            <div className="field-name">COURSES</div>  
                            <div id="courses-list">{coursesEl}</div>                  
                        </div>
                        <div id="review">
                            <div id="fieldnameNscore"><div className="field-name">REVIEWS</div><div><Score score={avrScore}/></div><div id="review-btn" onClick={()=> this.toggleReviewPopup('on') }>리뷰 남기기</div></div>
                            <div id="review-list">{reviewEls}</div>
                        </div>
                        <ReviewPopup ID={ID} toggleReviewPopup={this.toggleReviewPopup} reviewKind={'teacher'}/> 
                    </div>
            )
        }else {
            return (
                <div id="teacher-info"><Fetching/></div>
            )
        }
   
    }
}





const mapStateToProps = (state) => ({
    error: state.error
})

const mapDispatchToProps = (dispatch) => ({
    dispatch: dispatch
})

export default withRouter(connect(mapStateToProps, mapDispatchToProps) (TeacherInfo));
