import React from 'react';
import './TopBarDash.scss';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import TeacherDropMenu from './TeacherDropMenu';
import StudentDropMenu from './StudentDropMenu';
import ExpiredStorage from 'expired-storage';
import  { addError, deleteError }  from '../Actions/actionCreators';
var storage = new ExpiredStorage()

 
class TopbarDash extends React.Component{
    state = {
        showDRMenu: false,
        userType: parseInt(storage.getItem('userType')),
        hasIcs: ['/msgs', '/search/teachers', '/calendar']
    }

    goToThisPage = (path) => {
        
        this.props.history.push(path)
    }

    toggleDRMenu = (on) => {
        
        if(on === true) document.querySelector('#top-bar__dash #drop-down-menu').classList.replace('hide','show')
        else document.querySelector('#top-bar__dash #drop-down-menu').classList.replace('show', 'hide')

        // this.setState({
        //     showDRMenu: this.state.showDRMenu === true ? false: true
        // })
        
    }

    componentDidMount(){
        if(isNaN(this.state.userType)) {
            this.props.addError('Invalid userType', 'Ut')
        }
        let {pathname} = this.props.location

        //Chk if the pathname is the target path of any ics.
        if(this.state.hasIcs.indexOf(pathname) === -1 ) pathname = 'user'
        let icLinks = document.querySelectorAll('#ic-links .ic-link')


        
        Array.prototype.forEach.call(icLinks, (el) => {
            let targetPath = el.id.split('-')[1]
            if(targetPath === pathname) el.classList.replace('non-current', 'current')
            else el.classList.replace('current', 'non-current')
        })



    }


    componentDidUpdate(){
        console.log('location:', this.props.location);
        let {pathname, hasNewMsg_m, hasNewMsg_u} = this.props.location

        //Chk if the pathname is the target path of any ics.
        if(this.state.hasIcs.indexOf(pathname) === -1 ) pathname = 'user'
        let icLinks = document.querySelectorAll('#ic-links .ic-link')
        Array.prototype.forEach.call(icLinks, (el) => {
            let targetPath = el.id.split('-')[1]
            if(targetPath === pathname) el.classList.replace('non-current', 'current')
            else el.classList.replace('current', 'non-current')
        })

   

    }

    render(){
        // Compare two values
        let {hasNewMsg_u, hasNewMsg_m } = this.props
        let hasNewMsg = hasNewMsg_m.ts > hasNewMsg_u.ts? hasNewMsg_m.val: hasNewMsg_u.val
 
        
        let dropDownMenu = this.state.userType === 1? <TeacherDropMenu goToThisPage={this.goToThisPage} toggleDRMenu={this.toggleDRMenu}/> : <StudentDropMenu goToThisPage={this.goToThisPage} toggleDRMenu={this.toggleDRMenu}/>

        return (
            <div id="top-bar__dash" className="top-bar" >
                <div className="main-logo-n-name" onClick={() => this.goToThisPage('/')}>
                    <div className="bubble"></div>
                    <div className="tail-border"></div>
                    <div className="tail-fill"></div>
                    <span>YouTalkYou</span>
                </div>
                <div id="ic-links">
                    <div id="ic-/calendar" className="non-current ic-link"><i class="far fa-calendar-alt" onClick={() => this.goToThisPage('/schedule')}></i></div>
                    <div id='ic-/search/teachers'  className="non-current ic-link" onClick={() => this.goToThisPage('/search/teachers')}><i className="fas fa-search"></i><span>Teachers</span></div>
                    <div id='ic-/msgs' className="non-current ic-link" onClick={() => this.goToThisPage('/msgs')}><i class="far fa-envelope-open"></i><i id="ic-hasNewMsg" className={ hasNewMsg === true? "fas fa-circle" : "fas fa-circle hide"}></i></div>
                    <div id='ic-user' className="non-current ic-link" onMouseOver={() => this.toggleDRMenu(true)}><i class="far fa-user"></i></div>
                </div>
                {dropDownMenu}
            </div>
        )
    }
}


//The reason for getting thes values as propss is to make it trigger this dash bar to render whenever hasNewMsg from the server is sent to the client.
//Because the client can't know hasNewMsg of which store is the most recent. 
//whenerver hasNewMsg is sent, compare two values and get the latest one

const mapStateToProps = (state) => ({
    hasNewMsg_u : state.user.hasNewMsg,
    hasNewMsg_m : state.msgs.hasNewMsg
})

const mapDispatchToProps = (dispatch) => ({

})

export default withRouter( connect(mapStateToProps, mapDispatchToProps)(TopbarDash));