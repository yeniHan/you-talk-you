import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './MyCourse.scss';
// import {} from '../Actions/actionCreators';


const MyCourse_S = (props) => {
    let { ID, coursename,  lessNum} = props.course
    
    return(
        <div className="my-course" >
            <div>
                <div className="f-name">Coursename</div>
                <div className="crs-name">{coursename}</div>
            </div>
            <div>
                <div >{lessNum} lessons has been done.</div>
            </div>
            <div className="more-info-btn" onClick={()=> props.history.push(`/course/${ID}`)}>More information</div>
        </div>
    )
}

export default withRouter(MyCourse_S);