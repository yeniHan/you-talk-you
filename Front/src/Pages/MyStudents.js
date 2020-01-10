import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { asyncGetMyStudents, resetSendMsgSuccess} from '../Actions/actionCreators';
import Fetching from '../Components/Fetching';
import MyStudent from '../Components/MyStudent';
import './MyTeachersMyStudents.scss';
import MsgPopup from '../Components/MsgPopupMyT';


class MyStudents extends React.Component{
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
        }
    }

    goToStudentInfo = (studentID) => {
        this.props.history.push(`/student/${studentID}`)
    }

    goToCourseInfo = (e) => {
        let courseID = e.target.id.split('-')[1]
        this.props.history.push(`/course/${courseID}`)
    }

    componentDidMount() {
        this.props.asyncGetMyStudents()
    }

    render() {
        if(this.props.successSendMsg){
            alert('메세지가 성공적으로 전송되었습니다.')
            this.props.resetSendMsgSuccess()
        }
        let {students} = this.props
        if(students){
            if(students.length === 0){
                return (
                    <div id="my-students" className="no-data">
                        <div id="no-data">You have no student yet.</div>
                    </div>
                )
            }else{

                let studentEls = students.map(student => {
                    return <MyStudent key={student.ID} student={student} toggleMsgPopup={this.toggleMsgPopup} goToCourseInfo={this.goToCourseInfo} goToStudentInfo={this.goToStudentInfo} />
                })

                return (
                    <div id="my-students">
                        {studentEls}
                        <MsgPopup receiver={this.state.receiver} toggleMsgPopup={this.toggleMsgPopup}/>
                    </div>
                )
            }
        }else{
            return(
                <div id="my-students">
                    <Fetching/>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    students: state.user.myStudents,
    successSendMsg: state.msgs.successSendMsg
})

const mapDispatchToProps = (dispatch) => ({
    asyncGetMyStudents: () => dispatch(asyncGetMyStudents()),
    resetSendMsgSuccess: () => dispatch(resetSendMsgSuccess())
})

export default withRouter( connect(mapStateToProps, mapDispatchToProps) (MyStudents));
