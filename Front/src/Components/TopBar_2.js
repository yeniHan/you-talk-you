import React from 'react';
import './TopBar_2.scss';
import bubbleImg from '../Assets/Imgs/bubble2.png';
// import 


class TopBar extends React.Component{
    state = {

    }

    
    
    render(){
        return (
            <div id="top-bar">
                <div id="main-logo">
                    <img src={bubbleImg}/>
                    <div>YouTalkYou</div>
                </div>

                <div id="top-menu">
                    <div><i class="fas fa-search"></i><span>강의 찾기</span></div>
                    <div><i class="fas fa-search"></i><span>강사 찾기</span></div>
                    <div><i class="fas fa-book-reader"></i><span>강의</span></div>
                    <div><i id="ic-msg" class="far fa-comment-dots"></i></div>
                    <div><i id="ic-account" class="far fa-user-circle"></i></div>
                </div>
            </div>
        )
    }
}

export default TopBar;