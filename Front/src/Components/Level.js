import React from 'react';
import './Level.scss';

const Level = (props) => {
    let html = []
    for(let i = 0 ; i < 5; i ++ ){
        let el = i < props.level ? <div className="fill"></div>: <div></div>
        html.push(el)
    }

    return (
        <div className="level">{html}</div>
    )

}

export default Level;