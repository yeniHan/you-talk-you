import React from 'react';
import './Course.scss';

const Course = (props) => {
    let { courseID, coursename, langName, goToCourseInfo } = props
    return (
        <div id={'crs-' + courseID} className="courses" onClick={() => goToCourseInfo(courseID)}><div className="crs-names">{coursename}</div><div className="crs-langs">{'[' + langName + ']'}</div></div>
    )
}

export default Course;