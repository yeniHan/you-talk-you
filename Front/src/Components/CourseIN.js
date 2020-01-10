import React from 'react';
import './CourseIN.scss';


const CourseIN = (props) => {
    let { courseID, coursename, langName, goToCourseInfo } = props
    return (
        <div onClick={() => goToCourseInfo(courseID)} id={'crs-' + courseID} className="courses"><div className="crs-names">{coursename}</div><div className="crs-langs">{'[' + langName + ']'}</div></div>
    )
}

export default CourseIN;