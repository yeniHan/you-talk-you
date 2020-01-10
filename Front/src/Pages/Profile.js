import React from 'react';
import './Profile.scss';
import { connect } from 'react-redux'; 
import { withRouter } from 'react-router-dom';
import { asyncGetProfile, deleteError } from '../Actions/actionCreators';
import StudentProfile from '../Components/StudentProfile';
import TeacherProfile from '../Components/TeacherProfile';
import Fetching from '../Components/Fetching';


class Profile extends React.Component{

    state = {
        component: null,
        profile: null
    }

    // getDerivedStateFromProps(props, state){
    //     console.log('props:', props)
    //     if(props.user == null) props.asyncGetUser()
    // }

    componentDidMount() {
        console.log('Prfofile cdm()');
        if(this.props.profile == null) this.props.asyncGetProfile()
    }

    componentDidUpdate(){
        let { error, deleteError, history } = this.props      
        
        
    }

    render(){

        let { profile } = this.props
        let component = null
        if(profile == null) {
            component = <Fetching/>
        }else {
            // *user_type :  
            // -student: 0     -teacher: 1
            if( profile.user_type === 0 ) component = <StudentProfile /> 
            else if(profile.user_type === 1)  component = <TeacherProfile />
            else component = <Fetching/>
        }

        

        return (
            <div id="user"> 
                {component}
            </div>
        )
    }
}


const mapStateToProps = (state) => {
    // user_type varchar(10) NOT NULL,
    // username varchar(20) NOT NULL,
    // pw varchar(30) NOT NULL,
    // email varchar(200) NOT NULL,
    // courses text,
    // gender tinyint,
    // nationality varchar(5),
    // availableLangs varchar(200),
    // teachingLangs varchar(200),
    // introduction mediumtext DEFAULT '',
    // professional boolean,
    // experience tinyint,
    // tags varchar(256),
    return {
        profile: state.user.profile,
        error: state.error,
        shouldUpdateProfile: state.user.shouldUpdateProfile
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        asyncGetProfile : () => dispatch(asyncGetProfile()),
        deleteError: () => dispatch(deleteError())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Profile);