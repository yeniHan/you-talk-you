import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './MsgPopupMyT.scss';
import { asyncSendMsg } from '../Actions/actionCreators';


class MsgPopup extends React.Component{
    state = {
        msg: ''
    }

    onChangeHandler = (e) => {
        this.setState({
            ...this.state,
            msg: e.target.value
        })
    }

    clickSendBtn = () => {
        // format the content
        let { msg } = this.state
        let { ID } = this.props.receiver
        msg = msg.replace(/'/gi,`\\'`)
        msg = msg.replace(/"/gi,`\\"`)
        this.props.asyncSendMsg( ID, msg)
    }

    render() {
        
        console.log('state:', this.state);
        let { receiver } = this.props
        if(receiver){
            let { ID, username, photo } = receiver 
            photo = `http://localhost:8080/src/profilePhoto/${photo}`
            
            return (
                <div className="wrapper">            
                    <div id="msg-popup-myteachers" className="msg-popup">
                        <div id="content-box">
                            <div id="imgNfrom">
                                <img src={photo}/><div id="fromName">To <span>{username}</span></div>
                            </div>
                            <div id="msg-area">
                                <textarea name="msg" onChange={this.onChangeHandler}/>
                                <div id="send-btn" onClick={this.clickSendBtn} >Send</div>
                            </div>
                        </div>
                        <i id="ic-close" class="fas fa-times" onClick={() => this.props.toggleMsgPopup(false)}></i>                           
                    </div>
                </div>
            )
        }else{
            return (
                <div className="wrapper">            
                    <div className="msg-popup">
                    </div>
                </div>
            )
        }
    }
}


const mapStateToProps = (state) => ({
})

const mapDispatchToProps = (dispatch) => ({
    asyncSendMsg: ( to, content) => dispatch(asyncSendMsg( to, content)),
})

export default connect( mapStateToProps, mapDispatchToProps) (MsgPopup) ;