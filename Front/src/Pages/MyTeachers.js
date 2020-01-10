import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { asyncGetMyTeachers, resetSendMsgSuccess} from '../Actions/actionCreators';
import Fetching from '../Components/Fetching';
import MyTeacher from '../Components/MyTeacher';
import './MyTeachersMyStudents.scss';
import MsgPopup from '../Components/MsgPopupMyT';


class MyTeachers extends React.Component{
    state = {
        receiver: null
    }

    toggleMsgPopup = async (toggle, receiver = null) => {
        //When a user click 'Read the message' btn,
        //1) Store the selected msg's ID
        //2) turn the popup on
        console.log('toggleMsgPopup() msg:', receiver);
        
        let popupEl = document.querySelector('.wrapper')
            
        if(toggle === true){
            await this.setState({
                receiver: receiver
            })

            popupEl.classList.add('show-popup')
        }else{
            popupEl.classList.remove('show-popup')
            this.setState({
                receiver: null
            })
        }
    }

    goToTeacherInfo = (teacherID) => {
        this.props.history.push(`/teacher/${teacherID}`)
    }

    goToCourseInfo = (e) => {
        let courseID = e.target.id.split('-')[1]
        this.props.history.push(`/course/${courseID}`)
    }

    componentDidMount() {
        this.props.asyncGetMyTeachers()
    }

    render() {
        if(this.props.successSendMsg){
            alert('메세지가 성공적으로 전송되었습니다.')
            this.props.resetSendMsgSuccess()
        }
        let {teachers} = this.props
        if(teachers){

            if(teachers.length > 0){
                let teacherEls = teachers.map(teacher => {
                    return <MyTeacher key={teacher.ID} teacher={teacher} toggleMsgPopup={this.toggleMsgPopup} goToCourseInfo={this.goToCourseInfo} goToTeacherInfo={this.goToTeacherInfo} />
                })

                return (
                    <div id="my-teachers">
                        {teacherEls }
                        <MsgPopup receiver={this.state.receiver} toggleMsgPopup={this.toggleMsgPopup}/>
                    </div>
                )
            
            }else{
                return(
                    <div id="my-teachers" className="no-data">
                        <div id="no-data">You hasn't taken any course yet.</div>
                    </div>
                )
            }
        }else{
            return(
                <div id="my-teachers">
                    <Fetching/>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    teachers: state.user.myTeachers,
    successSendMsg: state.msgs.successSendMsg    
})

const mapDispatchToProps = (dispatch) => ({
    asyncGetMyTeachers: () => dispatch(asyncGetMyTeachers()),
    resetSendMsgSuccess: () => dispatch(resetSendMsgSuccess())    
})

export default withRouter( connect(mapStateToProps, mapDispatchToProps) (MyTeachers));
