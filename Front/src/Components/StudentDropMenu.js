import React from 'react';

const  StudentDropMenu = (props) => {
    let { goToThisPage, toggleDRMenu } = props
    
    return(
        <div id="drop-down-menu" className="hide" onMouseLeave={() => toggleDRMenu(false)}>
            <div onClick={()=>goToThisPage('/profile')}>MY PROFILE</div>
            <div onClick={()=>goToThisPage('/account')}>MY ACCOUNT</div>
            <div onClick={()=>goToThisPage('/mycourses/student')}>MY COURSES</div>
            <div onClick={()=>goToThisPage('/myteachers')}>MY TEACHERS</div>                    
            <div onClick={()=>goToThisPage('/login')}>LOGOUT</div>
        </div>
    )
}

export default StudentDropMenu;