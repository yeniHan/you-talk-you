import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import './MsgPopupReply.scss';
import { asyncSendMsg } from '../Actions/actionCreators';
import noImg from '../Assets/Imgs/noImg.png';


class MsgPopupReply extends React.Component{
    state = {
        reply: ''
    }

    onChangeHandler = (e) => {
        this.setState({
            ...this.state,
            reply: e.target.value
        })
    }

    clickReplyBtn = () => {
        // format the content
        let { reply } = this.state
        let { from, to} = this.props.msg 
        reply = reply.replace(/'/gi,`\\'`)
        reply = reply.replace(/"/gi,`\\"`)
        this.props.asyncSendMsg( from, reply)
    }

    render() {
        
        let { msg} = this.props

        console.log('MsgPopup() msg:', msg);
        console.log('state:', this.state);
        
        
        if(msg){
            console.log('msg popoup this.props.msg:', this.props.msg );
            
            let { type, ID, datetime, fromName, content, photo, from, to} = msg 
            if(type === 2){
            // `${coursename}/${courseID})/${teacherName}/${teacherID}/${startDT}/${endDT}`

                var contArr = content.split('/')
                let startDT = new Date(parseInt(contArr[4]*60000)).toLocaleString()
                let endDT = new Date(parseInt(contArr[5])*60000).toLocaleString()
                content = [`Your lesson reservation was confirmed.`, 
                        `Teacher: ${contArr[3]}`,
                        `Coursename: ${contArr[0]}`, `Time: ${startDT} ~ ${endDT}`].map(line => {
                            return <div>{line}</div>
                        })
            }

            
            return (
                <div className="wrapper">            
                    <div id="msg-popup-reply" className="msg-popup">
                        <div id="content-box">
                            <div id="imgNfrom">
                                <img src={photo==null? noImg: photo}/><div id="fromName">From <span>{fromName}</span></div>
                            </div>
                            <div id="content">{content}</div>
                            <div id="dt">{datetime}</div>
                            <div id="reply-box">
                                <textarea name="reply" onChange={this.onChangeHandler}/>
                                <div id="reply-btn" onClick={this.clickReplyBtn} >Reply</div>
                            </div>
                        </div>
                        <i id="ic-close" class="fas fa-times" onClick={() => this.props.toggleMsgPopup(false)}></i>                      
                    </div>
                </div>
            )
        }else{
            return (
                <div className="wrapper">            
                    <div id="msg-popup">
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

export default connect( mapStateToProps, mapDispatchToProps) (MsgPopupReply) ;