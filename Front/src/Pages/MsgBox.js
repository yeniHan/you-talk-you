import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { asyncGetMsgs, asyncSetRead, resetSendMsgSuccess } from '../Actions/actionCreators';
import './MsgBox.scss';
import Fetching from '../Components/Fetching';
import Msg from '../Components/Msg';
import MsgPopupReply from '../Components/MsgPopupReply';


class MsgBox extends React.Component{
    state = {
        selectedMsg: null
    }


    toggleMsgPopup = async (toggle, msg = null) => {
        //When a user click 'Read the message' btn,
        //1) Store the selected msg's ID
        //2) turn the popup on
        
        let popupEl = document.querySelector('#msg-box .wrapper')
            
        if(toggle === true){
            await this.setState({
                selectedMsg: msg
            })

            popupEl.classList.add('show-popup')
        }else{
            let inputEl = document.querySelector('#msg-popup-reply textarea')
            inputEl.value = ''
            popupEl.classList.remove('show-popup')
        }
    }

    componentDidMount () {
        this.props.asyncGetMsgs()

    }




    render() {
        
        let { msgs, asyncSetRead } = this.props
        
        if(this.props.successSendMsg) {
            alert('메세지를 성공적으로 보냈습니다.')
            this.props.resetSendMsgSuccess()
        }
        if(!msgs) return ( <div id="msg-box"><Fetching/></div> ) 
        else if(msgs.length === 0 ) { return <div id="msg-box" className="no-msg"><div id="no-msg">You have no message yet.</div></div>}
        else{
            
            let msgEls =  msgs.map(msg => {
                return (
                    <Msg key={msg.ID} msg={msg}  asyncSetRead={asyncSetRead} toggleMsgPopup={this.toggleMsgPopup}/>
                )
            })
            
            return (
                <div id="msg-box">
                    {msgEls}
                    <MsgPopupReply msg={this.state.selectedMsg} toggleMsgPopup={this.toggleMsgPopup}/>
                </div>
            )
        }
    }
}

const mapStateToProps = (state) => ({
    msgs: state.msgs.msgs,
    successSendMsg: state.msgs.successSendMsg
})

const mapDispatchToProps = (dispatch) => ({
    asyncGetMsgs: () => dispatch(asyncGetMsgs()),
    asyncSetRead: (msgID, type, lesssonID) => dispatch(asyncSetRead(msgID, type, lesssonID)),
    resetSendMsgSuccess: () => dispatch(resetSendMsgSuccess())
})


export default connect( mapStateToProps, mapDispatchToProps) (MsgBox);
