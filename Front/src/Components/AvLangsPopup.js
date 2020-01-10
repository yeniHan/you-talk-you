import React from 'react';
import './AvLangsPopup.scss';
import { connect } from 'react-redux';

class AvLangsPopup extends React.Component{
    state = {
        KR: 0, 
        EN: 0, 
        CN: 0,
        DE: 0,
        FR: 0
    }

    onChangeHandlerAvl = (e, lang) => {
        console.log('onCHange!');
        

        this.setState({
            ...this.state,
            [lang]: parseInt(e.target.value)
        })
    }
    componentDidMount(){
        let {avLangs } = this.props
        
        this.setState({
            KR: avLangs.KR == null? 0: avLangs.KR,
            EN: avLangs.EN == null? 0: avLangs.EN,
            CN: avLangs.CN == null? 0: avLangs.CN,
            FR: avLangs.FR == null? 0: avLangs.FR,
            DE: avLangs.DE == null? 0: avLangs.DE,
        })   
    }


    render () {
        
        return (
        <div className="wrapper">
            <div id="av-langs-popup">
                <div>
                    <div className="title">언어 능력 정보 설정</div>
                    <div className="select-box">
                        <span>한국어</span> 
                        <select name="avaliableLangs-KR" onChange={(e) => this.onChangeHandlerAvl(e, 'KR')}>
                        <option value="0">Novice</option>
                            <option value="1">Novice high</option>
                            <option value="2">Intermediate</option>                            
                            <option value="3">Intermediate high</option>
                            <option value="4">Advanced</option>
                            <option value="5">Native speaker</option>
                        </select>
                    </div>
                    <div className="select-box">
                        <span>영어</span> 
                        <select name="avaliableLangs-EN" onChange={(e) =>this.onChangeHandlerAvl(e, 'EN')}>
                        <option value="0">Novice</option>
                            <option value="1">Novice high</option>
                            <option value="2">Intermediate</option>                            
                            <option value="3">Intermediate high</option>
                            <option value="4">Advanced</option>
                            <option value="5">Native speaker</option>
                        </select>
                    </div>
                    <div className="select-box">
                        <span>중국어</span> 
                        <select name="avaliableLangs-CN" onChange={(e) => this.onChangeHandlerAvl(e, 'CN')}>
                        <option value="0">Novice</option>
                            <option value="1">Novice high</option>
                            <option value="2">Intermediate</option>                            
                            <option value="3">Intermediate high</option>
                            <option value="4">Advanced</option>
                            <option value="5">Native speaker</option>
                        </select>
                    </div>                   
                    <div className="select-box">
                        <span>독일어</span> 
                        <select name="avaliableLangs-DE" onChange={(e) =>this.onChangeHandlerAvl(e, 'DE')}>
                        <option value="0">Novice</option>
                            <option value="1">Novice high</option>
                            <option value="2">Intermediate</option>                            
                            <option value="3">Intermediate high</option>
                            <option value="4">Advanced</option>
                            <option value="5">Native speaker</option>
                        </select>
                    </div>
                    <div className="select-box">
                        <span>프랑스어</span> 
                        <select name="avaliableLangs-FR" onChange={(e) =>this.onChangeHandlerAvl(e, 'FR')}>
                            <option value="0">Novice</option>
                            <option value="1">Novice high</option>
                            <option value="2">Intermediate</option>                            
                            <option value="3">Intermediate high</option>
                            <option value="4">Advanced</option>
                            <option value="5">Native speaker</option>
                        </select>
                    </div>
                    <button id="av-change-btn" onClick={(e) => this.props.onChangeHandler(e, this.state)}>변경하기</button>
                </div>
                <span className="ic-close"><i class="fas fa-times" onClick={() => this.props.toggleAvlPopup('off')}></i></span>                
            </div>
        </div>
        )
    }
    
}


const mapStateToProps = (state) => ({
    avLangs: state.user.profile.availableLangs,
})

const mapDispatchToProps = (dispatch) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(AvLangsPopup);