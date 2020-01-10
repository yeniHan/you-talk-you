import React from 'react';
import './Score.scss';

const Score = (props) => {
    let {score} = props
    
    if(score >= 0 && score <0.5){
        return <div className="scores"><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><span className="score">{score}</span></div>
    }else if( score >=0.5 && score < 1.0) {
        return <div className="scores"><i class="fas fa-star-half-alt"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><span className="score">{score}</span></div>
    }else if( score >=1.0 && score < 1.5){
        return <div className="scores"><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><span className="score">{score}</span></div>
    }else if( score >=1.5 && score < 2){
        return <div className="scores"><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><span className="score">{score}</span></div>
    }else if( score >= 2.0 && score <2.5){
        return <div className="scores"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><span className="score">{score}</span></div>
    }else if( score >=2.5 && score < 3 ){
        return <div className="scores"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><i class="far fa-star"></i><i class="far fa-star"></i><span className="score">{score}</span></div>
    }else if ( score >= 3.0 && score < 3.5){
        return <div className="scores"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><span className="score">{score}</span></div>
    } else if( score >= 3.5 && score < 4){
        return <div className="scores"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><i class="far fa-star"></i><span className="score">{score}</span></div>
    }else if( score >=4.0 && score < 4.5){
        return <div className="scores"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="far fa-star"></i><span className="score">{score}</span></div>    
    }else if (score >= 4.5 && score < 5){
        return <div className="scores"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i><span className="score">{score}</span></div>
    }else if(score === 5.0){
        return <div className="scores"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><span className="score">{score}</span></div>
    }
    else{
        return <div className="scores"><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><i class="far fa-star"></i><span className="score">{score}</span></div>
    }
}

export default Score;