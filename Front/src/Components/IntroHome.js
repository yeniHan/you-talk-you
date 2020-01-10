import React from 'react';
import './IntroHome.scss';
import arrowDownImg from '../Assets/Imgs/arrow-down.svg';

class IntroHome extends React.Component{
    render(){
        return (
            <div>
                <div id="introHome-sloped"></div>
                <div id="btn-go-to-below"><img  src={arrowDownImg}></img></div>
                <div>
                    
                </div>
            </div>
        )
    }
}

export default IntroHome;