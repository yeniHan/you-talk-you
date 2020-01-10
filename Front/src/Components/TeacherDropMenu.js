import React from 'react';


const TeacherDropMenu = (props) => {
    let { goToThisPage, toggleDRMenu } = props
    
    return(
        <div id="drop-down-menu" className="hide" onMouseLeave={() => toggleDRMenu(false)}>
            <div onClick={()=>goToThisPage('/profile')}>MY PROFILE</div>
            <div onClick={()=>goToThisPage('/account')}>MY ACCOUNT</div>
            <div onClick={()=>goToThisPage('/mycourses/teacher')}>MY COURSES</div>
            <div onClick={()=>goToThisPage('/mystudents')}>MY STUDENTS</div>    
            <div onClick={()=>goToThisPage('/statics')}>STATICS</div>                                                
            <div onClick={()=>goToThisPage('/login')}>LOGOUT</div>
        </div>
    )
}

export default TeacherDropMenu;