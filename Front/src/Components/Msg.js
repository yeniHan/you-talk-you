import React from 'react';
import noImg from '../Assets/Imgs/noImg.png';
import './Msg.scss';


class Msg extends React.Component{
    clickReadBtn = async(isTypeOne, msg) => {
        let { ID, type, lessonID, read} = this.props.msg
        if(read === 0) await this.props.asyncSetRead(ID, type, lessonID)
        if(!isTypeOne) this.props.toggleMsgPopup(true, msg)
    }

    render(){
        let { ID, fromName, content, read, photo, ts, from, type, lessonID, datetime} = this.props.msg
        let newMsg = {...this.props.msg}    
        newMsg.datetime = new Date(ts*60000).toLocaleString()
        newMsg.photo = photo == null? null : `http://localhost:8080/src/profilePhoto/${photo}`
        

        //1) Confirm request msg..
        if(type === 1 ){
            //Fomating the content is needed..
            //content: `${studentUsername}/${coursename}/ ${startTS}/${endTS})/${msg}`
            let contArr = content.split('/')
            let startDT = new Date(parseInt(contArr[2])*60000).toLocaleString()
            let endDT = new Date(parseInt(contArr[3])*60000).toLocaleString()
            let msg = contArr[4]
            // rewrite the content..
            content = [`Student, ${contArr[0]} sent a lesson reservation request for your course.`,
            `Coursename: ${contArr[1]}`, `Time: ${startDT} ~ ${endDT}`, `Message from the student: ${msg}`]
            let contentEls = content.map(line => {
                return <div>{line}</div>
            })

            //In the case of a Rsv msg, read = 1 means that the teacher confirmed the lesson.
            let classesMsg = read === 0? 'msg confirmMsgs': 'msg confirmMsgs read' 
            let classesCfBtn = read === 0? 'confirm-btn': 'confirm-btn confirmed'
            return (
                <div className={classesMsg}>
                    <div className="imgNfromName">
                        <img src={newMsg.photo == null? noImg: newMsg.photo}/>
                        <div className="fromName">From <span>{fromName}</span></div>                        
                    </div>
                    <div className="box">
                        <div className="content">{contentEls}</div>
                        <div className="dt">{newMsg.datetime}</div>
                        <button disabled={read === 0? false: true} onClick={() => this.clickReadBtn(true)} className={classesCfBtn}>Confirm</button>
                    </div>
                </div>
            )
        }
        //2. Confirm msgs +  normal msgs.. 
        else {
            // if type = 2; if the confirm msg, formating the content is needed
            // `${coursename}/${courseID})/${teacherName}/${teacherID}/${startDT}/${endDT}`
            let slicedContent;
            let classes;
            if(type === 2){
                slicedContent = `Your lesson reservation was confirmed..`
 
                classes = 'msg confirmMsgs'
            }else{
                slicedContent = content.slice(0, 20) + '...'
                classes = 'msg'
            }


            if (read === 1) classes = classes + ' read' 

            return (
                <div className={classes}>
                    <div className="imgNfromName">
                        <img src={newMsg.photo}/>
                        <div className="fromName">From <span>{fromName}</span></div>                        
                    </div>
                    <div className="box">
                        <div className="content sliced">{slicedContent}<div className="read-msg-btn" onClick={() => this.clickReadBtn(false, newMsg)}>Read the message</div></div>
                        <div className="dt">{newMsg.datetime}</div>
                    </div>           
                </div>
            )
        }
    }

}

export default Msg;