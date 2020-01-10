import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './MyTeacherMyStudent.scss';

// import {} from '../Actions/actionCreators';


const MyTeacher = (props) => {
    let { goToTeacherInfo, goToCourseInfo, toggleMsgPopup } = props
    let { ID, photo, username, lessonNum, courses} = props.teacher
    let photoURL = photo != null? `http://localhost:8080/src/profilePhoto/${photo}` : null
    // lessonNum = lessonNum === null?||lessonNum 
    let crsEls = courses.map(crs => {
        let crsname = crs.coursename.length <= 33? crs.coursename : crs.coursename.slice(0, 33) + '...'
        return <div id={`crs-${crs.ID}`} className="course" onClick={goToCourseInfo}>{crsname}</div>
    })
    
    return(
        <div className="my-teacher">
            <div>
                <div className="ic-msg-circle" onClick={()=>toggleMsgPopup(true, {ID: ID, username: username, photo: photo})}><i className="far fa-envelope ic-msg"></i></div>
                <div className="img-n-name">
                    <img src={photoURL}/><span className="teachername" onClick={() => goToTeacherInfo(ID)}>{username}</span>
                </div>
                <div className="other-info">
                    <div>You've taken <span>{lessonNum }</span> lessons</div>
                    {crsEls}
                </div>
            </div>
        </div>
    )
}

export default MyTeacher ;