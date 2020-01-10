import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './SchedulePopup.scss';
import ExpiredStorage from 'expired-storage';
import { getTimeString } from '../Utils/dateFunctions';


const storage = new ExpiredStorage


const SchedulePopup = (props) => {
    if(props.schedule){
        console.log('schedule:', props.schedule);
        
        let { datetime, lessons } = props.schedule
   
        let lessonEls = lessons.slice(0, 4).map(ls => {
            let {startTS, endTS, coursename, username, confirm } = ls
            let sTime = getTimeString(startTS*60000)
            let eTime = getTimeString(endTS*60000)
            let classesConfirm = confirm === 1? "time confirm": "time"
            let userType = storage.getItem('userType') 
            let teacherNameEl = userType == null|| userType === '1'? null: <div>Teacher <span className="tname">{username}</span></div>       
            return (
                <div className="lesson">
                    <div className={classesConfirm}>{sTime + '~'+ eTime} {confirm === 0? 'Not confirmed': null}</div>
                    <div>Course <span className="crsname">{coursename}</span></div>
                    {teacherNameEl}
                </div>
            )            
        })

        return (
            <div className="wrapper">            
                <div id="schedule-popup">
                    <div id="content-box">
                        <div id="datetime">{datetime}</div>
                        <div>{ lessons.length >= 1? lessonEls: 'No schedule'}</div>
                    </div>
                    <i id="ic-close" class="fas fa-times" onClick={() => props.togglePopup(false)}></i>                           
                </div>
            </div>
        )
    }else{
        return (
            <div className="wrapper">            
                <div className="schedule-popup">
                </div>
            </div>
        )
    }
}


const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
})

export default connect( mapStateToProps, mapDispatchToProps) (SchedulePopup) ;