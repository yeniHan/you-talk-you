import React from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import {BrowserRouter as Router, Route } from 'react-router-dom';
import TopBar from './Components/TopBar';
import Home from './Pages/Home';
import Signup from './Pages/Signup';
import Login from './Pages/Login';
import Profile from './Pages/Profile';
import RegisterCourse from './Pages/RegisterCourse';
import SearchTeachers from './Pages/SearchTeachers';
import TeacherInfo from './Pages/TeacherInfo';
import CourseInfo from './Pages/CourseInfo';
import MsgBox from './Pages/MsgBox';
import MySchedule from './Pages/MySchedule';
import MyCourses_T from './Pages/MyCourses_T';
import MyCourses_S from './Pages/MyCourses_S';
import MyTeachers from './Pages/MyTeachers';
import MyStudents from './Pages/MyStudents';
import { deleteError } from './Actions/actionCreators';
import { connect } from 'react-redux';
import MyAccount from './Pages/MyAccount';
import Statics from './Pages/Statics';


import  sha256  from 'sha256';

function App(props) {
    //Handle errors.. alter the error => close the alter => deleteError
    //But, the errors handled by other components'll be ignored in the <App/>
    
    let { code } = props
    console.log('code:', code);
    console.log('pw sha:', sha256('111111'));
    
    
    if(code){
      if(code !== 403&& code !== 'Si1' && code !== 'Si2' && code !== 'Acc'){
        if(code === 'Ut') {
           alert('세션이 만료되었습니다. 다시 로그인해 주십시오.')
        }
        else alert('네트워크 장애가 발생하였습니다.')
        props.deleteError()
      }
    } 
  return (
    <div className="App">

      <Router>
        <TopBar/>
        <Route exact path="/" component={Home} />
        <Route path='/signup' component={Signup} />
        <Route path='/login' component={Login} /> 
        <Route path='/profile' component={Profile} />     
        <Route path='/courses/register' component={RegisterCourse}/>   
        <Route path='/search/teachers' component={SearchTeachers} />     
        <Route path='/teacher/:teacherID' component={TeacherInfo} /> 
        <Route path='/course/:courseID' component={CourseInfo} />     
        <Route path='/msgs' component={MsgBox} />   
        <Route path='/schedule' component={MySchedule} />               
        <Route path='/mycourses/teacher' component={MyCourses_T} />    
        <Route path='/mycourses/student' component={MyCourses_S} />  
        <Route path="/mystudents" component={MyStudents} />
        <Route path="/myteachers" component={MyTeachers} />
        <Route path="/account" component={MyAccount} />
        <Route path="/statics" component={Statics} />
        
      </Router>
    </div>
  );
}


const mapStateToProps = (state) => ({
  code: state.error.code
})

const mapDispatchToProps = (dispatch) => ({
  deleteError: () => dispatch(deleteError())
})

export default connect(mapStateToProps, mapDispatchToProps )(App);
