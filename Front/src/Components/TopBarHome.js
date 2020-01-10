import React from 'react';
import './TopBarHome.scss';
import bubbleImg from '../Assets/Imgs/bubble1.svg';
import { withRouter } from 'react-router-dom';
// import 


class TopBarHome extends React.Component{
    state = {
    }

    goToPage = (page) => {
        let { history } = this.props;
        
        history.push(page);
    }
    

    
    
    render(){
        return (
            <div id="top-bar__home" className="top-bar">
                <div className="main-logo">
                    <img src={bubbleImg}/>
                    <div>YouTalkYou</div>
                </div>

                <div className="top-menu">
                    <div onClick={()=>this.goToPage('login')}><span>로그인</span></div>
                    <div onClick={()=>this.goToPage('signup')}><span>등록</span></div>
                </div>
            </div>
        )
    }
}

export default withRouter(TopBarHome);