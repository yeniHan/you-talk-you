import React from 'react';
import './TopBarLS.scss';
import { withRouter } from 'react-router-dom';



class TopBarLS extends React.Component{

    goHome = () => {
        this.props.history.push('/')
    }

    movePage = () => {
        this.props.history.push(this.props.btName === '등록'? '/signup': 'login')
    }
    

    render() {
        let { btName } = this.props
        return (
            <div id="top-bar__ls" className="top-bar">
                <div className="main-logo-n-name" onClick={this.goHome}>
                    <div className="bubble"></div>
                    <div className="tail-border"></div>
                    <div className="tail-fill"></div>
                    <span>YouTalkYou</span>
                </div>
                <button className="ls-btn" onClick={this.movePage}>{btName}</button>
            </div>
        )
    }

}

export default withRouter(TopBarLS);