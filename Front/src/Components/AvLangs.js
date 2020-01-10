import React from 'react';
import Level from './Level';
import './AvLang.scss';

const AvLang = (props) => {
    let { langName, level } = props
    return (
        <div className="av-langs"><div className="lang-name">{langName}</div><Level level={level}/></div>
    )
}

export default AvLang;