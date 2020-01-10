import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './MyCourse.scss';
// import {} from '../Actions/actionCreators';


const MyCourse_T = (props) => {
    let { ID, coursename, regDate, stuNum, lessNum} = props.course
    
    regDate = regDate.replace('T', ' ').slice(0, 10)
    return(
        <div className="my-course" >
            <div>
                <div className="f-name">Coursename</div>
                <div className="crs-name">{coursename}</div>
            </div>
            <div>
                <div className="f-name">Registeration date</div>
                <div>{regDate}</div>
            </div>
            <div>
                <div >{stuNum} students has registered the course.</div>
            </div>
            <div>
                <div >{lessNum} lessons has been done.</div>
            </div>
            <div className="more-info-btn" onClick={()=> props.history.push(`/course/${ID}`)}>More information</div>
        </div>
    )
}

export default withRouter(MyCourse_T);