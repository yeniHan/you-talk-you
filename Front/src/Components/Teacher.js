import React from 'react';
import KRFlag from '../Assets/Imgs/KRFlag.png';
import USFlag from '../Assets/Imgs/USFlag.png';
import FRFlag from '../Assets/Imgs/FRFlag.png';
import DEFlag from '../Assets/Imgs/DEFlag.png';
import CNFlag from '../Assets/Imgs/CNFlag.png';
import noImg from '../Assets/Imgs/noImg.png'
import Score from '../Components/Score';
import './Teacher.scss';

const Teacher = (props) => {
    let {ID, photo, username, nationality, teachingLangs, KR, EN, CN, DE, FR, avr_score, professional, showTeacher } = props
    let langNames = {KR: '한국어', EN: '영어',  DE: '독일어',  FR: '프랑스어' ,  CN: '중국어'}
    let flagPhoto = {
        KR: KRFlag,
        US: USFlag,
        CN: CNFlag,
        FR: FRFlag,
        DE: DEFlag
    }
    let professionalStr = professional === 1? 'PROFESSIONAL TEACHER': 'COMMUNITY TEACHER'
    if(teachingLangs == null) teachingLangs = '없음' 
    else {
        teachingLangs = teachingLangs.split('/')
        teachingLangs = teachingLangs.map(code => {
            return langNames[code]
        })
        teachingLangs = teachingLangs.join(', ')
    }
    let avLangs = []
    let langNlev = [['한국어', KR], ['영어', EN], ['중국어', CN] , ['독일어', DE], [ '프랑스어', FR]]
    langNlev.forEach(arr => {
       if( arr[1] >= 3 )  avLangs.push(arr[0])
    }) 
    
    avLangs = avLangs.join(', ')
    
    return(
        <div className="teacher" onClick={(e) => showTeacher(ID)}>
            <div>
                <img className="teacher-photo" src={`http://localhost:8080/src/profilePhoto/${photo}`}/>
                <Score score={avr_score}/>
            </div>
            <div>
                <div className="usernameNflag"><div className="username">{username}</div><img className="flag-img" src={nationality == null? noImg : flagPhoto[nationality]}/></div>
                <div className="professional field-text">{professionalStr}</div>
                <div className="teaching-langs">
                    <div className="field-text">TEACHES...</div>
                    <div>{teachingLangs}</div>
                </div>
                <div className="av-langs">
                    <div className="field-text">ALSO SPEAKS...</div>
                    <div>{avLangs}</div>
                </div>
            </div>
        </div>
    )
}

export default Teacher;