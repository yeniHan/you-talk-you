import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
// import {} from '../Actions/ActionCreators';
import authAxios from '../Utils/authAxios';
import './CourseInfo.scss';
import KRFlag from '../Assets/Imgs/KRFlag.png';
import USFlag from '../Assets/Imgs/USFlag.png';
import FRFlag from '../Assets/Imgs/FRFlag.png';
import DEFlag from '../Assets/Imgs/DEFlag.png';
import CNFlag from '../Assets/Imgs/CNFlag.png';
import noImg from '../Assets/Imgs/noImg.png';
import noVideo from '../Assets/Imgs/noVideo.png';


import Fetching from '../Components/Fetching';
import Score from '../Components/Score';
import ReviewPopup from '../Components/ReviewPopup';
import Review from '../Components/Review';
import ReservePopup from '../Components/ReservePopup';
import { thisTypeAnnotation } from '@babel/types';



class CourseInfo extends React.Component{
    state = {
        nationalityFlags: {
            KR: KRFlag,
            US: USFlag,
            CN: CNFlag,
            FR: FRFlag,
            DE: DEFlag
        },
        course: null,        
        teacher: null,
        langNames: {KR: '한국어', EN: '영어',  DE: '독일어',  FR: '프랑스어' ,  CN: '중국어'}                
    }

    asyncGetCourse =  (courseID) => {
        authAxios({
            url: `http://localhost:8080/info/course/${courseID}`,
            method:'GET',
            headers: {'Content-Type': 'application/json'},
            data: {
                courseID: courseID
            }
            }, this.props.dispatch,  
             (course, teacher) => {
                
            
                // Intro video needs to be formated
                if(course.videoURL != null){
                    let videoURLArr = course.videoURL.split('/')
                    let videoID = videoURLArr[videoURLArr.length - 1]
                    course.videoURL = `http://www.youtube.com/embed/${videoID}`
                }

                teacher.photoURL =  teacher.photo != null? `http://localhost:8080/src/profilePhoto/${teacher.photo}`: null
                delete teacher.photo                


                this.setState({
                    ...this.state,
                    course: {
                        ...course,
                        videoURL: course.videoURL
                    }, 
                    teacher: teacher
                })

                return {type: null}
            }, ['course', 'teacher'])
    }

    toggleReviewPopup = (toggle) => {
        if(toggle === 'on'){
            document.querySelector('#review-popup-wrapper').classList.add('show-popup')
        }else{
            document.querySelector('#review-popup-wrapper').classList.remove('show-popup')
            this.asyncGetCourse(this.state.course.ID)
        }
    }

    toggleReservePopup = (toggle) => {
        if(toggle === 'on'){
            document.querySelector('#reserve-popup-wrapper').classList.add('show-popup')
        }else{
            document.querySelector('#reserve-popup-wrapper').classList.remove('show-popup')
            this.asyncGetCourse(this.state.course.ID)
        }
    }

    goToTeacherInfo = () => {
        this.props.history.push(`/teacher/${this.state.teacher.ID}`)
    }


    componentDidMount () {
        let {match: {params}} = this.props

        let courseID = params.courseID
        this.asyncGetCourse(courseID)
       
    }

    render() {
        console.log('CourseInfo');
        let {course, teacher} = this.state
        if( course == null || teacher == null){
            return (
                <div>
                    <Fetching/>
                </div>
            )

        }else{
            let {ID, coursename, lang, videoURL, introduction, price, unitTime, reviews} = this.state.course
            let valNunit = course.unitTime.split('/')
            let unit = valNunit[1] === 'H'? 'hour(s)': 'minute(s)'
            let unitTimeStr = valNunit[0] + ' ' + unit
            let c_avrScore = this.state.course.avr_score                        
            let {username, nationality, photoURL, professional, crsNum, stuNum} = this.state.teacher
            let t_avrScore = this.state.teacher.avr_score            
            let videoURLEl = videoURL == null ? <div id="intro-video"><img src={noVideo} width="533px"/></div> : <div id="intro-video"><iframe width="610" height="341" src={videoURL}></iframe></div>
            let reviewEls = reviews.map(review => {
                return <Review score={review.score} review={review.review} writer={review.writer}/>
            })

            return  (
                <div id="course-info">
                    <div id="coursename">{'[' + this.state.langNames[lang] + '] ' + coursename}</div>
                    {videoURLEl}
                    <div id="course-details">
                        <div className="col-name">Course Details</div>
                        <div id="introduction" className="fields">
                            <div className="field-name">INTRODUCTION</div>
                            <div>{introduction}</div>
                        </div>
                        <div className="fields">
                            <div className="field-name">Price</div>
                            <div>{'$ ' + price}</div>
                        </div>
                        <div className="fields">
                            <div className="field-name" >Unit time</div>
                            <div>{unitTimeStr}</div>
                        </div>
                    </div>
                    <div id="teacher">
                        <div className="col-name">Teacher Info</div>
                        <div id="photoNinfo">
                            <img id="photo" src={photoURL == null ? noImg : photoURL}/>
                            <div id="info">
                                <div id="professional">{professional === 1? 'PROFESSIONAL TEACHER': 'COMMUNITIY TEACHER' }</div>
                                <div id="usernameNflag"><div id="username">Teacher, {username}</div> <img id="flag-img" src={this.state.nationalityFlags[nationality]}/></div>
                                <Score score={t_avrScore}/>
                                <div className="content-row">{crsNum} courses</div>
                                <div className="content-row">{stuNum} students</div>
                            </div>
                        </div>
                    </div>
                    <div id="review">
                        <div id="fieldnameNscore"><div className="field-name">REVIEWS</div><div><Score score={c_avrScore}/></div><div id="review-btn" onClick={()=> this.toggleReviewPopup('on') }>리뷰 남기기</div></div>
                        <div id="review-list">{reviewEls}</div>
                    </div>
                    <ReviewPopup ID={ID} reviewKind={'course'} toggleReviewPopup={this.toggleReviewPopup}/>                                     
                    <div id="reserve-btn" onClick={() => this.toggleReservePopup('on')}>강의 예약하기</div>  
                    <ReservePopup  ID={ID} unitTime={unitTime} coursename={coursename} teacherID={this.state.teacher.ID} teachername={username} coursename={coursename} price={price} toggleReservePopup={this.toggleReservePopup}/>              
                </div>
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



export default connect( mapStateToProps, mapDispatchToProps) (CourseInfo);
