import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import {  aysncGetMyCourses, asyncGetMsgs } from '../Actions/actionCreators';
import MyCourse from '../Components/MyCourse_S';
import './MyCourses.scss';

class MyCourses_S extends React.Component{
    state = {

    }

    componentDidMount () {
        this.props.aysncGetMyCourses(0)
    }

    render() {
        let {courses} = this.props
        let els = courses.map(crs => {
            return <MyCourse course={crs}/>
        })
        
        return (
            <div id="my-courses">
                <div id="title">Your courses</div>
                {courses.length === 0? <div id="no-data">No course</div>: els }
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    courses : state.user.courses
})

const mapDispatchToProps = (dispatch) => ({
    aysncGetMyCourses: (userType) => dispatch(aysncGetMyCourses(userType))
})

export default connect (mapStateToProps, mapDispatchToProps) (MyCourses_S)