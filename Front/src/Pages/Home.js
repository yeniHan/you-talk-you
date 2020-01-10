import React from 'react';
import TopBarHome from '../Components/TopBarHome';
import IntroHome from '../Components/IntroHome';
import './Home.scss';



class Home extends React.Component{

    render(){
        return (
            <div id="home">
                <div id="wrapper"></div>
                <iframe width="100%" height="503px"
                    src="https://www.youtube.com/embed/hE2Ira-Cwxo?autoplay=1&loop=1&controls=0&playlist=hE2Ira-Cwxo" allow="autoplay, loop">
                </iframe>
                <div id="text-above-video">
                    <div className="tab-title">새로운 배움을 시작해보세요.</div>
                    <div className="tab-content">
                        <p>전 세계 500만명의 learners들과</p>
                        <p>다양한 지식 및 기술을 배우는 즐거움을 나눠보세요.</p>
                    </div>                    
                </div>
                <IntroHome/>
            </div>
        )
    }

}

export default Home;